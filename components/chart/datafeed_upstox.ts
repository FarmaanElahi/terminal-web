import {
  Datafeed,
  LibrarySymbolInfoExtended,
} from "@/components/chart/datafeed";
import {
  Bar,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  StreamingDataFeed,
  SubscribeBarsCallback,
} from "@/components/chart/types";

import { DateTime, FixedOffsetZone } from "luxon";
import { LogoProvider } from "@/components/chart/logo_provider";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";
import { refreshUpstoxToken } from "@/utils/client";
import {
  GetHistoricalCandleResponse,
  GetIntraDayCandleResponse,
  HistoryApi,
} from "upstox-js-sdk";
import * as MarketV3 from "@/utils/upstox/market_v3";
import Feed = MarketV3.com.upstox.marketdatafeeder.rpc.proto.Feed;

export class DatafeedUpstox extends Datafeed implements StreamingDataFeed {
  private readonly marketFeed = new MarketDataStreamer();
  private readonly upstoxHistoryAPI = new HistoryApi();
  private feeds?: Record<string, Feed>;
  private readonly listeners = new Map<
    string,
    {
      instrumentKey: string;
      symbol: LibrarySymbolInfoExtended;
      resolution: ResolutionString;
      onTick: SubscribeBarsCallback;
    }
  >();

  constructor(logoProvider: LogoProvider) {
    super(logoProvider);
    refreshUpstoxToken("**");
    void this.marketFeed.connect();
    this.marketFeed.on("message", (data) => {
      console.log("Feed received: ", data);
      this.feeds = { ...(this.feeds ?? {}), ...data.feeds };
      this.refreshRealtime();
    });
  }

  async getBars(
    symbolInfo: LibrarySymbolInfoExtended,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) {
    const { to, from, countBack, firstDataRequest } = periodParams;
    const toDate = DateTime.fromSeconds(to);
    const day = Math.max(2 * 252, countBack); // Pull Min 10 year data
    const fromDate = DateTime.fromSeconds(from).minus({ day: day });
    const bars = await this.symbolCandle(
      symbolInfo,
      "day",
      toDate,
      fromDate,
      firstDataRequest,
    );
    if (!bars) return onError("Unable to resolve symbol");
    if (bars.length === 0) return onResult([], { noData: true });
    onResult(bars);
  }

  /**
   * Subscribe to real-time updates for a specific symbol.
   */
  subscribeBars(
    symbolInfo: LibrarySymbolInfoExtended,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
  ) {
    const instrumentKey = this.toUpstoxInstrumentKey(symbolInfo);
    if (!this.isSubscribed(instrumentKey)) {
      this.marketFeed.subscribe([instrumentKey], "full");
    }

    this.listeners.set(listenerGuid, {
      instrumentKey,
      symbol: symbolInfo,
      resolution,
      onTick: onTick,
    });
  }

  unsubscribeBars(listenerGuid: string) {
    const { instrumentKey } = this.listeners.get(listenerGuid)!;
    this.listeners.delete(listenerGuid);
    const isStillSubscribed = this.isSubscribed(instrumentKey);
    // There are still some listener for this symbol, we won't disconnect it
    if (isStillSubscribed) return;

    // Unsubscribe from Upstox
    this.marketFeed.unsubscribe([instrumentKey]);
    if (this.feeds?.[instrumentKey]) {
      delete this.feeds[instrumentKey];
    }
  }

  private isSubscribed(instrumentKey: string) {
    return Array.from(this.listeners.values()).some(
      ({ instrumentKey: sKey }) => instrumentKey === sKey,
    );
  }

  async symbolCandle(
    symbolInfo: LibrarySymbolInfo,
    interval: "day",
    to: DateTime,
    from: DateTime,
    firstRequest: boolean,
  ) {
    const instrumentKey = this.toUpstoxInstrumentKey(symbolInfo);
    const timeIndex = 0;
    const openIndex = 1;
    const highIndex = 2;
    const lowIndex = 3;
    const closeIndex = 4;
    const volumeIndex = 5;

    const historyPromise = new Promise<GetHistoricalCandleResponse>(
      (resolve, reject) => {
        this.upstoxHistoryAPI.getHistoricalCandleData1(
          instrumentKey,
          interval,
          to.toFormat("yyyy-MM-dd"),
          from.toFormat("yyyy-MM-dd"),
          "v2",
          (error, data) => {
            if (error) return reject(error);
            return resolve(data);
          },
        );
      },
    );

    const intradayCandle = [] as GetHistoricalCandleResponse["data"]["candles"];
    if (false && firstRequest) {
      const intraday = await new Promise<GetIntraDayCandleResponse>(
        (resolve, reject) => {
          this.upstoxHistoryAPI.getIntraDayCandleData(
            instrumentKey,
            "30minute",
            "v2",
            (error, data) => {
              if (error) return reject(error);
              return resolve(data);
            },
          );
        },
      );

      // Data is in descending order of time
      const { candles } = intraday.data;
      if (candles.length > 0) {
        const time = candles[0][timeIndex];
        const open = candles[candles.length - 1][openIndex];
        const high = Math.max(...candles.map((c) => c[highIndex]));
        const low = Math.min(...candles.map((c) => c[lowIndex]));
        const close = candles[0][closeIndex];
        const volume = candles
          .map((c) => c[volumeIndex])
          .reduce((a, b) => a + b, 0);
        intradayCandle.push([time, open, high, low, close, volume, 0]);
      }
    }

    const candles = [...intradayCandle];
    // Data is descending  order, so we will insert at the first index
    candles.push(...(await historyPromise.then((h) => h.data.candles)));
    return candles
      .map(([ts, open, high, low, close, volume]) => {
        const utc = FixedOffsetZone.utcInstance;
        const time = DateTime.fromISO(ts.split("+")[0], { zone: utc })
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toMillis();
        return { time, open, high, low, close, volume } as Bar;
      })
      .reverse();
  }

  toUpstoxInstrumentKey(symbol: LibrarySymbolInfo) {
    const { type, exchange, isin, ticker } = symbol;
    switch (type) {
      case "index": {
        if (!ticker || !exchange) {
          throw new Error("Unable to generate upstox instrument key");
        }
        if (ticker.includes("CNX")) {
          const new_name = ticker.replace("CNX", "NIFTY");
          return [`${exchange}_INDEX`, new_name].join("|");
        }
        return [`${exchange}_INDEX`, "Nifty 50"].join("|");
      }
      case "stock": {
        if (!isin) {
          throw new Error("Unable to generate upstox instrument key");
        }
        return [`${exchange}_EQ`, isin].join("|");
      }

      case "fund": {
        if (!isin) {
          throw new Error("Unable to generate upstox instrument key");
        }
        return [`${exchange}_EQ`, isin].join("|");
      }
      default:
        throw new Error("Not supported symbol type");
    }
  }

  private refreshRealtime() {
    if (!this.feeds) return;

    for (const value of this.listeners.values()) {
      const { instrumentKey, onTick } = value;
      const feed = this.feeds[instrumentKey];
      if (!feed) continue;
      const ohlc =
        feed.ff?.indexFF?.marketOHLC ?? feed.ff?.marketFF?.marketOHLC;
      const candle = ohlc?.ohlc?.find((f) => f.interval === "1d");
      if (!candle) continue;

      const { ts, open, high, low, close, volume } = candle;
      const utc = FixedOffsetZone.utcInstance;
      const time = DateTime.fromMillis(ts as number, { zone: utc })
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .plus({ day: 1 })
        .toMillis();

      const bar = { time, open, high, low, close, volume } as Bar;
      console.log(
        "Setting Realtime bar",
        instrumentKey,
        JSON.parse(JSON.stringify(bar)),
      );
      onTick(bar);
    }
  }
}
