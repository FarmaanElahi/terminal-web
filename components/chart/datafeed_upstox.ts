import {
  Datafeed,
  LibrarySymbolInfoExtended,
} from "@/components/chart/datafeed";
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

import { DateTime, FixedOffsetZone } from "luxon";
import { LogoProvider } from "@/components/chart/logo_provider";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";
import { GetHistoricalCandleResponse, HistoryApi } from "upstox-js-sdk";
import * as MarketV3 from "@/utils/upstox/market_v3";
import { getUpstoxMarketFeedUrl } from "@/server/upstox";
import Feed = MarketV3.com.upstox.marketdatafeeder.rpc.proto.Feed;

export class DatafeedUpstox extends Datafeed implements StreamingDataFeed {
  private readonly marketFeed = new MarketDataStreamer();
  private readonly upstoxHistoryAPI = new HistoryApi();
  private feeds?: Record<string, Feed>;
  private url?: string;
  private readonly listeners = new Map<
    string,
    {
      instrumentKey: string;
      symbol: LibrarySymbolInfoExtended;
      resolution: ResolutionString;
      onTick: SubscribeBarsCallback;
    }
  >();

  onReady(callback: OnReadyCallback) {
    void this.connect();
    super.onReady(callback);
  }

  constructor(logoProvider: LogoProvider) {
    super(logoProvider);
    this.marketFeed.on("message", (data) => {
      this.feeds = { ...(this.feeds ?? {}), ...data.feeds };
      this.refreshRealtime();
    });
    this.marketFeed.on("open", () => console.log("TBT Connected"));
    this.marketFeed.on("error", (e) => console.error("TBT Conn Failed", e));
    this.marketFeed.on("error", () => console.error("TBT Conn Closed"));
  }

  private async connect() {
    if (!this.url) {
      this.url = await getUpstoxMarketFeedUrl();

      // By the time url is fetch, there might be another request for the same
      if (!this.url) {
        void this.marketFeed.connect(this.url);
      }
    }
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
    // Initiate
    if (firstRequest && !this.isSubscribed(instrumentKey)) {
      this.marketFeed.subscribe([instrumentKey], "full");
    }

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

    const candles = await historyPromise.then((h) => h.data.candles);
    const bars = candles
      .map(([ts, open, high, low, close, volume]) => {
        const utc = FixedOffsetZone.utcInstance;
        const time = DateTime.fromISO(ts.split("+")[0], { zone: utc })
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toMillis();
        return { time, open, high, low, close, volume } as Bar;
      })
      .reverse();

    // Try to push the bar in the initial load itself if it exists
    if (firstRequest && bars.length > 0) {
      const bar = this.getTBTLatestBar(instrumentKey);
      if (bar && bar.time > bars[bars.length - 1].time) {
        bars.push(bar);
      }
    }

    return bars;
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
      const bar = this.getTBTLatestBar(instrumentKey);
      if (bar) onTick(bar);
    }
  }

  private getTBTLatestBar(instrumentKey: string) {
    const feed = this.feeds?.[instrumentKey];
    if (!feed) return null;

    const ohlc = feed.ff?.indexFF?.marketOHLC ?? feed.ff?.marketFF?.marketOHLC;
    const candle = ohlc?.ohlc?.find((f) => f.interval === "1d");
    if (!candle) return null;

    const { ts, open, high, low, close, volume } = candle;
    const utc = FixedOffsetZone.utcInstance;
    const time = DateTime.fromMillis(ts as number, { zone: utc })
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .plus({ day: 1 })
      .toMillis();

    return { time, open, high, low, close, volume } as Bar;
  }
}
