// components/chart/datafeed_upstox.ts
import { Datafeed } from "@/components/chart/datafeed";
import {
  Bar,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  QuoteData,
  QuotesCallback,
  ResolutionString,
  StreamingDataFeed,
  SubscribeBarsCallback,
} from "@/components/chart/types";

import { DateTime, FixedOffsetZone, IANAZone } from "luxon";
import { LogoProvider } from "@/components/chart/logo_provider";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";
import {
  GetHistoricalCandleResponse,
  GetIntraDayCandleResponse,
  HistoryApi,
} from "upstox-js-sdk";
import * as MarketV3 from "@/utils/upstox/market_v3";
import { toUpstoxInstrumentKey } from "@/utils/upstox/upstox_utils";
import { UpstoxClient } from "@/utils/upstox/client";
import type { Symbol } from "@/types/symbol";
import { querySymbols } from "@/lib/state/symbol";
import IFeed = MarketV3.com.upstox.marketdatafeeder.rpc.proto.IFeed;

type UpstoxInterval = "day" | "1minute";
type UpstoxIntradayInterval = "1d" | "I1";

export class DatafeedUpstox extends Datafeed implements StreamingDataFeed {
  private readonly zone = new IANAZone("Asia/Kolkata");

  private readonly upstoxHistoryAPI = new HistoryApi();
  private marketFeed = MarketDataStreamer.getInstance();
  private feeds: Record<string, IFeed> = {};
  private readonly listeners = new Map<
    string,
    {
      symbol: LibrarySymbolInfo;
      resolution: ResolutionString;
      onTick: SubscribeBarsCallback;
    }
  >();

  private readonly quoteListeners = new Map<
    string,
    {
      symbols: string[];
      onQuote: QuotesCallback;
    }
  >();

  private instrumentKeyToTicker = new Map<string, string>();
  private prevDayClose = new Map<string, number>();

  onReady(callback: OnReadyCallback) {
    super.onReady(callback);
  }

  constructor(
    logoProvider: LogoProvider,
    private readonly upstox: UpstoxClient,
  ) {
    super(logoProvider);
    this.marketFeed.on("message", (data) => {
      this.feeds = data.feeds;
      this.refreshBar();
      void this.refreshQuotes();
    });
    this.marketFeed.on("open", () => console.log("TBT Connected"));
    this.marketFeed.on("error", (e) => console.error("TBT Conn Failed", e));
    this.marketFeed.on("close", () => console.error("TBT Conn Closed"));
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) {
    // Ensure we are subscribed to realtime data
    this.ensureTBTSubscribe(symbolInfo, periodParams.firstDataRequest);

    const interval: UpstoxInterval = resolution === "1D" ? "day" : "1minute";

    const filtered = await (interval === "day"
      ? this.pullDayCandle(symbolInfo, periodParams, interval)
      : this.pullMinutesCandles(symbolInfo, periodParams, interval));

    if (!filtered) return onError("Unable to resolve symbol");
    if (filtered.length === 0) return onResult([], { noData: true });
    onResult(filtered);
  }

  /**
   * Subscribe to real-time updates for a specific symbol.
   */
  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
  ) {
    if (!this.isSubscribed(symbolInfo.ticker as string)) {
      this.marketFeed.subscribe([symbolInfo], "full");
    }

    this.listeners.set(listenerGuid, {
      symbol: symbolInfo,
      resolution,
      onTick: onTick,
    });
  }

  unsubscribeBars(listenerGuid: string) {
    if (!this.listeners.has(listenerGuid)) return;

    const { symbol } = this.listeners.get(listenerGuid)!;
    this.listeners.delete(listenerGuid);

    // Check if there are still other listeners for this symbol
    const isStillSubscribed = this.isSubscribed(symbol.ticker as string);

    // There are still some listeners for this symbol, we won't disconnect it
    if (isStillSubscribed) return;

    // Unsubscribe from Upstox
    this.marketFeed.unsubscribe([symbol]);
  }

  private isSubscribed(ticker: string) {
    return Array.from(this.listeners.values()).some(
      ({ symbol }) => symbol.ticker === ticker,
    );
  }

  private refreshBar() {
    if (!this.feeds) return;

    for (const value of this.listeners.values()) {
      const { symbol, onTick, resolution } = value;
      const bar = this.getTBTLatestBar(symbol.ticker as string, resolution);
      if (bar) onTick(bar);
    }
  }

  private getTBTLatestBar(ticker: string, resolution: ResolutionString) {
    const upstoxInterval: UpstoxIntradayInterval =
      resolution === "1D" ? "1d" : "I1";
    const feed = this.feeds?.[ticker];
    if (!feed) return null;

    const ohlc = feed.ff?.indexFF?.marketOHLC ?? feed.ff?.marketFF?.marketOHLC;
    const candle = ohlc?.ohlc
      ?.toSorted((a, b) => ((b.ts ?? 0) as number) - ((a.ts ?? 0) as number))
      .find((f) => f.interval === upstoxInterval);

    if (!candle) return null;

    const { ts, open, high, low, close, volume } = candle;

    // If it is day, it has to be in UTC 12 AM
    if (upstoxInterval === "1d") {
      const time = DateTime.fromMillis(ts as number, { zone: this.zone })
        .plus({ day: 1 })
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toMillis();
      return { time, open, high, low, close, volume } as Bar;
    }

    // If it is intraday, it should be just in UTC
    const time = DateTime.fromMillis(ts as number, { zone: this.zone })
      .toUTC()
      .toMillis();
    return { time, open, high, low, close, volume } as Bar;
  }

  private async pullDayCandle(
    symbolInfo: LibrarySymbolInfo,
    period: PeriodParams,
    interval: UpstoxInterval,
  ) {
    const { to, from, countBack } = period;
    // Load additional data
    const toDate = DateTime.fromSeconds(to);
    const fromDate = DateTime.fromSeconds(from).minus({
      // Min of 10 year or more
      year: Math.max(10, Math.ceil(countBack / 252)),
    });

    const instrumentKey = this.resolveSymbolToInstrumentKey(symbolInfo);
    const historicalCandlePromise = this.upstox
      .getHistoricalCandleData({
        instrumentKey,
        interval,
        toDate: toDate.toFormat("yyyy-MM-dd"),
        fromDate: fromDate.toFormat("yyyy-MM-dd"),
      })
      .then((h) => h.data.candles);

    const intradayCandlePromise = period.firstDataRequest
      ? this.upstox
          .getIntraDayCandleData({
            instrumentKey,
            interval: "30minute",
          })
          .then((h) => {
            if (h.data.candles.length === 0) return [];

            const first = h.data.candles[h.data.candles.length - 1];
            const last = h.data.candles[0];
            const candle = [
              first[0], // timestamp,
              first[1], // open,
              Math.max(...h.data.candles.map((c) => c[2])), // High
              Math.min(...h.data.candles.map((c) => c[3])), // Low
              last[4], // Close
              h.data.candles.map((c) => c[5]).reduce((a, b) => a + b, 0), // Volume
            ] as const;
            return [candle];
          })
      : [];

    const [historical, intraday] = await Promise.all([
      historicalCandlePromise,
      intradayCandlePromise,
    ]);

    const candles =
      intraday.length > 0 ? [...historical, ...intraday] : historical;
    const seen = new Set<number>();

    return candles
      .map(([ts, open, high, low, close, volume]) => {
        const utc = FixedOffsetZone.utcInstance;
        const time = DateTime.fromISO(ts.split("T")[0], { zone: utc })
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toMillis();
        return { time, open, high, low, close, volume } as Bar;
      })
      .filter((b) => {
        if (seen.has(b.time)) return false;
        seen.add(b.time);
        return true;
      })
      .sort((a, b) => a.time - b.time);
  }

  private async pullMinutesCandles(
    symbolInfo: LibrarySymbolInfo,
    period: PeriodParams,
    interval: UpstoxInterval,
  ) {
    const { to, from, countBack } = period;
    // Load additional data
    const toDate = DateTime.fromSeconds(to);
    const fromDate = DateTime.fromSeconds(from).minus({
      // Min of 10 days or more
      day: Math.max(10, Math.ceil(countBack / 400)),
    });

    const instrumentKey = this.resolveSymbolToInstrumentKey(symbolInfo);
    const historicalCandlePromise = new Promise<GetHistoricalCandleResponse>(
      (resolve, reject) => {
        this.upstoxHistoryAPI.getHistoricalCandleData1(
          instrumentKey,
          interval,
          toDate.toFormat("yyyy-MM-dd"),
          fromDate.toFormat("yyyy-MM-dd"),
          "v2",
          (error, data) => {
            if (error) return reject(error);
            return resolve(data);
          },
        );
      },
    ).then((h) => h.data.candles);

    const intradayCandlePromise = period.firstDataRequest
      ? new Promise<GetIntraDayCandleResponse>((resolve, reject) => {
          this.upstoxHistoryAPI.getIntraDayCandleData(
            instrumentKey,
            interval,
            "v2",
            (error, data) => {
              if (error) return reject(error);
              return resolve(data);
            },
          );
        }).then((h) => h.data.candles)
      : [];

    const [historical, intraday] = await Promise.all([
      historicalCandlePromise,
      intradayCandlePromise,
    ]);

    const candles =
      intraday.length > 0 ? [...historical, ...intraday] : historical;
    const seen = new Set<number>();
    return candles
      .map(([ts, open, high, low, close, volume]) => {
        // If it is intraday, it should be just in UTC
        const time = DateTime.fromISO(ts).toUTC().toMillis();
        return { time, open, high, low, close, volume } as Bar;
      })
      .filter((b) => {
        if (seen.has(b.time)) return false;
        seen.add(b.time);
        return true;
      })
      .sort((a, b) => a.time - b.time);
  }

  private ensureTBTSubscribe(
    symbolInfo: LibrarySymbolInfo,
    firstRequest: boolean,
  ) {
    // Initiate subscription if this is the first request and we're not already subscribed
    if (firstRequest && !this.isSubscribed(symbolInfo.ticker as string)) {
      this.marketFeed.subscribe([symbolInfo], "full");
    }
  }

  getVolumeProfileResolutionForPeriod() {
    return "1" as ResolutionString;
  }

  async getQuotes(symbols: string[], onDataCallback: QuotesCallback) {
    console.log("Get quotes", symbols);
    if (symbols.length === 0) {
      console.log("Returning empty");
      return onDataCallback([]);
    }

    // Get all symbols that we have cache for it
    const cachedSymbols = symbols
      .map((v) => this.symbolCache.get(v))
      .filter((v) => v)
      .map((v) => v!);

    // Get all symbols that we don't have cache for it
    const symbolsToQuery = symbols.filter((s) => !this.symbolCache.has(s));
    if (symbolsToQuery.length > 0) {
      // Query symbols that we don't have cache for it
      const s = await querySymbols(symbolsToQuery);
      // Merge all symbols into one
      s.map((symbol) => this.symbolCache.set(symbol.ticker as string, symbol));
      cachedSymbols.push(...s);
    }
    console.log("result", cachedSymbols);

    const mapping = cachedSymbols.map((sy) => ({
      symbol: sy,
      instrumentKey: this.resolveSymbolToInstrumentKey(sy),
    }));

    const instrumentKeys = mapping.map((m) => m.instrumentKey);
    const marketQuotes = await this.upstox.fullMarketQuotes(instrumentKeys);

    const data = mapping.map(({ symbol, instrumentKey }) => {
      // Cache it here so that we don't have to pull the data in refresh quote
      this.symbolCache.set(symbol.ticker as string, symbol);

      const q = Object.values(marketQuotes.data).find(
        (v) => v.instrument_token === instrumentKey,
      );
      if (!q) {
        return {
          s: "error",
          n: symbol.ticker as string,
          v: {},
        } as QuoteData;
      }

      const lp = q.last_price;
      const ch = q.net_change;
      const prevClose = lp - ch;
      // Not available in websocket
      this.prevDayClose.set(symbol.ticker as string, prevClose);
      const chp = (q.net_change / prevClose) * 100;
      const ask = Math.min(...q.depth.sell.map((s) => s.price));
      const bid = Math.max(...q.depth.buy.map((s) => s.price));
      return {
        s: "ok",
        n: symbol.ticker as string,
        v: {
          volume: q.volume,
          lp,
          ch,
          chp,
          exchange: symbol.exchange,
          prev_close_price: prevClose,
          open_price: q.ohlc.open,
          low_price: q.oi_day_low,
          high_price: q.oi_day_high,
          description: symbol.description,
          short_name: symbol.name,
          original_name: symbol.name,
          ask,
          bid,
          spread: ask - bid,
        },
      } as QuoteData;
    });

    onDataCallback(data);
  }

  async subscribeQuotes(
    tickers: string[],
    fastTickers: string[],
    onRealtimeCallback: QuotesCallback,
    listenerGUID: string,
  ) {
    const merged = [...new Set([...tickers, ...fastTickers])];
    if (merged.length === 0) return;

    const s = merged
      .map((s) => this.symbolCache.get(s))
      .filter((s) => s)
      .map((s) => s!);

    this.marketFeed.subscribe(s, "full");
    this.quoteListeners.set(listenerGUID, {
      symbols: merged,
      onQuote: onRealtimeCallback,
    });
  }

  async unsubscribeQuotes(listenerGUID: string) {
    const q = this.quoteListeners.get(listenerGUID);
    if (!q) return;
    const { symbols } = q;
    const s = symbols
      .map((s) => this.symbolCache.get(s))
      .filter((s) => s)
      .map((s) => s!);
    this.marketFeed.unsubscribe(s);
    this.quoteListeners.delete(listenerGUID);
  }

  async refreshQuotes() {
    if (!this.feeds) return;

    for (const value of this.quoteListeners.values()) {
      const { symbols: tickers, onQuote } = value;

      const quotes = tickers
        .map((s) => {
          const symbol = this.symbolCache.get(s);
          const feed = this.feeds[s];
          const ff = feed?.ff?.marketFF ?? feed?.ff?.indexFF;
          if (!ff) return;

          const day = ff?.marketOHLC?.ohlc
            ?.toSorted(
              (a, b) => ((b.ts ?? 0) as number) - ((a.ts ?? 0) as number),
            )
            .find((f) => f.interval === "1d");
          if (!day) return;

          const prevClose = this.prevDayClose.get(s) ?? 0;
          const ch = (ff.ltpc?.ltp ?? 0) - prevClose;
          const chp = (ch / prevClose) * 100;
          const bid = Math.max(
            ...(
              feed.ff?.marketFF?.marketLevel?.bidAskQuote?.map((v) => v.bp) ??
              []
            )
              .filter((v) => v)
              .map((v) => v!),
          );

          const ask = Math.min(
            ...(
              feed.ff?.marketFF?.marketLevel?.bidAskQuote?.map((v) => v.ap) ??
              []
            )
              .filter((v) => v)
              .map((v) => v!),
          );
          return {
            s: "ok",
            n: s,
            v: {
              volume: day.volume,
              lp: ff.ltpc?.ltp,
              ch,
              chp,
              exchange: symbol?.exchange,
              prev_close_price: prevClose,
              open_price: day.open,
              low_price: day.low,
              high_price: day.high,
              description: symbol?.description,
              short_name: symbol?.name,
              original_name: symbol?.name,
              ask,
              bid,
              spread: ask - bid,
            },
          } as QuoteData;
        })
        .filter((v) => v)
        .map((v) => v!);
      onQuote(quotes);
    }
  }

  private resolveSymbolToInstrumentKey(symbol: Symbol | LibrarySymbolInfo) {
    const ticker = symbol.ticker as string;
    const instrumentKey = toUpstoxInstrumentKey(symbol);
    this.instrumentKeyToTicker.set(instrumentKey, ticker);
    return instrumentKey;
  }
}
