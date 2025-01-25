import {
  DatafeedConfiguration,
  DatafeedErrorCallback,
  GetMarksCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  StreamingDataFeed,
  TimescaleMark,
} from "@/components/chart/types";
import { AxiosInstance } from "axios";
import { LogoProvider } from "@/components/chart/logo_provider";
import { symbolCandle, symbolResolve, symbolSearch } from "@/lib/state/symbol";
import type { Symbol } from "@/types/symbol";
import { Subsession } from "@/types/supabase";
import { DateTime } from "luxon";

interface LibrarySymbolInfoExtended extends LibrarySymbolInfo {
  quote: Symbol;
}

export class Datafeed implements StreamingDataFeed {
  constructor(
    private readonly axios: AxiosInstance,
    private readonly logoProvider: LogoProvider,
  ) {}

  onReady(callback: OnReadyCallback) {
    const config = {
      supported_resolutions: ["D", "1W", "1M", "3M", "6M", "12M"],
      supports_time: true,
      exchanges: [
        { name: "All", value: "", desc: "" },
        { name: "National Stock Exchange", value: "NSE", desc: "NSE" },
        { name: "Bombay Stock Exchange", value: "BSE", desc: "BSE" },
      ],
      symbols_types: [
        { name: "All", value: "" },
        { name: "Stock", value: "stock" },
        { name: "Index", value: "index" },
        { name: "Fund", value: "fund" },
      ],
      currency_codes: ["INR", "USD"],
      supports_timescale_marks: true,
      supports_marks: true,
    } satisfies DatafeedConfiguration;
    setTimeout(() => callback(config));
  }

  async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ) {
    const data = await symbolSearch(userInput, { exchange, type: symbolType });
    const result = data.map((d) => {
      return {
        symbol: d.name,
        ticker: d.ticker,
        description: d.description,
        type: d.type,
        logo_urls: this.logoProvider.forLogo(d.logo, []),
        exchange: d.exchange,
        exchange_logo: this.logoProvider.forLogo(d.exchange_logo),
      } as SearchSymbolResultItem;
    });
    onResult(result);
  }

  async resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback,
  ) {
    const data = await symbolResolve(symbolName).catch(onError);
    if (!data) return;

    // Map it
    const subsession_id = "regular";
    const minmov = 5;
    const pricescale = 100;
    const sessionDetails = (data.subsessions as Subsession[]).find(
      (s) => s.id === subsession_id,
    );
    const corrections = sessionDetails?.["session-correction"];
    const session = sessionDetails?.session;
    const session_display = sessionDetails?.["session-display"];
    const listed_exchange = data.exchange;

    const symbol = {
      name: data.name,
      ticker: data.ticker,
      description: data.description,
      type: data.type,
      logo_urls: this.logoProvider.forLogo(data.logo, []),
      exchange: data.exchange,
      listed_exchange: listed_exchange,
      exchange_logo: data.exchange_logo,
      timezone: data.timezone,
      subsessions: data.subsessions,
      subsession_id: subsession_id,
      corrections: corrections,
      minmov: minmov,
      pricescale: pricescale,
      currency_code: data.currency,
      session: session,
      industry: data.industry,
      sector: data.sector,
      has_intraday: false,
      session_display: session_display,
      data_status: "endofday",
      has_daily: true,
      session_holidays: data.session_holidays,
      isin: data.isin,
    } as LibrarySymbolInfoExtended;
    onResolve(symbol);
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
    const day = Math.max(10 * 252, countBack); // Pull Min 10 year data
    const fromDate = DateTime.fromSeconds(from).minus({ day: day });
    const bars = await symbolCandle(
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

  subscribeBars(): void {}

  unsubscribeBars(): void {}

  getTimescaleMarks(
    symbolInfo: LibrarySymbolInfoExtended,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
  ) {
    const { earnings_release_date_fq_h, earnings_release_next_date } =
      symbolInfo.quote ?? {};
    const marks = [] as TimescaleMark[];
    let currIndex = 0;

    // Earning Marks
    const earnings = (earnings_release_date_fq_h ?? []) as number[];
    earnings.forEach((time, index) => {
      marks.push({
        id: `${currIndex + index}`,
        time: time,
        color: "black",
        shape: "earning",
        label: "E",
      });
    });
    currIndex = earnings.length;
    if (earnings_release_next_date) {
      const time =
        new Date(earnings_release_next_date).setUTCHours(0, 0, 0, 0) / 1000;
      marks.push({
        id: `${currIndex + 1}`,
        time,
        color: "blue",
        shape: "earning",
        label: "E",
      });
      currIndex += 1;
    }
    onDataCallback(marks);
  }
}
