// components/chart/datafeed_upstox.ts
import { Datafeed } from "@/components/chart/datafeed";
import {
  Bar,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
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

  onReady(callback: OnReadyCallback) {
    super.onReady(callback);
  }

  constructor(logoProvider: LogoProvider) {
    super(logoProvider);
    this.marketFeed.on("message", (data) => {
      this.feeds = data.feeds;
      this.refreshRealtime();
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

  private refreshRealtime() {
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

    const instrumentKey = toUpstoxInstrumentKey(symbolInfo);
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
            "30minute",
            "v2",
            (error, data) => {
              if (error) return reject(error);
              return resolve(data);
            },
          );
        }).then((h) => {
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

    const instrumentKey = toUpstoxInstrumentKey(symbolInfo);
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
}
