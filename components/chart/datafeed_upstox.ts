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

import { DateTime, FixedOffsetZone, IANAZone } from "luxon";
import { LogoProvider } from "@/components/chart/logo_provider";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";
import {
  GetHistoricalCandleResponse,
  GetIntraDayCandleResponse,
  HistoryApi,
} from "upstox-js-sdk";
import * as MarketV3 from "@/utils/upstox/market_v3";
import Feed = MarketV3.com.upstox.marketdatafeeder.rpc.proto.Feed;

type UpstoxInterval = "day" | "1minute";
type UpstoxIntradayInterval = "1d" | "I1";

export class DatafeedUpstox extends Datafeed implements StreamingDataFeed {
  private readonly zone = new IANAZone("Asia/Kolkata");

  private readonly upstoxHistoryAPI = new HistoryApi();
  private marketFeed = new MarketDataStreamer();
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

  onReady(callback: OnReadyCallback) {
    void this.marketFeed.connectNow();
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

  async getBars(
    symbolInfo: LibrarySymbolInfoExtended,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) {
    // Ensure we are subscribe to realtime date
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
    if (!this.listeners.has(listenerGuid)) return;

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

  toUpstoxInstrumentKey(symbol: LibrarySymbolInfo) {
    const { type, exchange, isin, ticker } = symbol;
    switch (type) {
      case "index": {
        const instrumentKey = INDEX_MAPPINGS[ticker as string];
        if (!instrumentKey) {
          throw new Error("Unable to generate upstox instrument key");
        }
        return instrumentKey;
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
      const { instrumentKey, onTick, resolution } = value;
      const bar = this.getTBTLatestBar(instrumentKey, resolution);
      if (bar) onTick(bar);
    }
  }

  private getTBTLatestBar(instrumentKey: string, resolution: ResolutionString) {
    const upstoxInterval: UpstoxIntradayInterval =
      resolution === "1D" ? "1d" : "I1";
    const feed = this.feeds?.[instrumentKey];
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
    symbolInfo: LibrarySymbolInfoExtended,
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

    const instrumentKey = this.toUpstoxInstrumentKey(symbolInfo);
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
    symbolInfo: LibrarySymbolInfoExtended,
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

    const instrumentKey = this.toUpstoxInstrumentKey(symbolInfo);
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
    symbolInfo: LibrarySymbolInfoExtended,
    firstRequest: boolean,
  ) {
    const instrumentKey = this.toUpstoxInstrumentKey(symbolInfo);
    // Initiate
    if (firstRequest && !this.isSubscribed(instrumentKey)) {
      this.marketFeed.subscribe([instrumentKey], "full");
    }
  }
}

const INDEX_MAPPINGS: Record<string, string> = {
  "BSE:SENSEX": "BSE_INDEX|SENSEX",
  "NSE:CNXENERGY": "NSE_INDEX|Nifty Energy",
  "NSE:NIFTY_INDIA_MFG": "NSE_INDEX|Nifty India Mfg",
  "NSE:CNXINFRA": "NSE_INDEX|Nifty Infra",
  "NSE:CNXFMCG": "NSE_INDEX|Nifty FMCG",
  "NSE:CNXAUTO": "NSE_INDEX|Nifty Auto",
  "NSE:CNXIT": "NSE_INDEX|Nifty IT",
  "NSE:CNXFINANCE": "NSE_INDEX|Nifty Fin Service",
  "NSE:BANKNIFTY": "NSE_INDEX|Nifty Bank",
  "NSE:CNX500": "NSE_INDEX|Nifty 500",
  "NSE:NIFTY": "NSE_INDEX|Nifty 50",
  "NSE:NIFTY_LARGEMID250": "NSE_INDEX|NIFTY LARGEMID250",
  // MISSING
  "NSE:NIFTY_IND_DIGITAL": "NSE_INDEX|",
  "NSE:CNXMNC": "NSE_INDEX|Nifty MNC",
  // MISSING
  "NSE:CNXSERVICE": "NSE_INDEX|",
  "NSE:NIFTY_TOTAL_MKT": "NSE_INDEX|NIFTY TOTAL MKT",
  "NSE:CPSE": "NSE_INDEX|Nifty CPSE",
  "NSE:NIFTY_MICROCAP250": "NSE_INDEX|NIFTY MICROCAP250",
  "NSE:CNXCOMMODITIES": "NSE_INDEX|Nifty Commodities",
  "NSE:NIFTYALPHA50": "NSE_INDEX|NIFTY Alpha 50",
  "NSE:CNXCONSUMPTION": "NSE_INDEX|Nifty Consumption",
  "NSE:NIFTYMIDCAP150": "NSE_INDEX|NIFTY MIDCAP 150",
  "NSE:CNX100": "NSE_INDEX|Nifty 100",
  // MISSING
  "NSE:NIFTYMIDSMAL400": "NSE_INDEX|",
  "NSE:CNXPSE": "NSE_INDEX|Nifty PSE",
  "NSE:NIFTYSMLCAP250": "NSE_INDEX|NIFTY SMLCAP 250",
  "NSE:NIFTYMIDCAP50": "NSE_INDEX|Nifty Midcap 50",
  "NSE:CNXMIDCAP": "NSE_INDEX|NIFTY MIDCAP 100",
  "NSE:CNXSMALLCAP": "NSE_INDEX|NIFTY SMLCAP 100",
  "NSE:NIFTY_MID_SELECT": "NSE_INDEX|NIFTY MID SELECT",
  "NSE:NIFTY_HEALTHCARE": "NSE_INDEX|NIFTY HEALTHCARE",
  "NSE:NIFTY_CONSR_DURL": "NSE_INDEX|NIFTY CONSR DURBL",
  "NSE:NIFTY_OIL_AND_GAS": "NSE_INDEX|NIFTY OIL AND GAS",
  "NSE:NIFTYPVTBANK": "NSE_INDEX|Nifty Pvt Bank",
  "NSE:CNXMEDIA": "NSE_INDEX|Nifty Media",
  "NSE:CNXREALTY": "NSE_INDEX|Nifty Realty",
  "NSE:CNX200": "NSE_INDEX|Nifty 200",
  "NSE:CNXMETAL": "NSE_INDEX|Nifty Metal",
  "NSE:CNXPSUBANK": "NSE_INDEX|Nifty PSU Bank",
  "NSE:CNXPHARMA": "NSE_INDEX|Nifty Pharma",
  "NSE:NIFTYJR": "NSE_INDEX|Nifty Next 50",
};
