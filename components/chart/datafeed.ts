import {
  Bar,
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
import { symbolQuote, symbolResolve } from "@/lib/state/symbol";
import type { Symbol } from "@/types/symbol";
import { Client } from "@/utils/supabase/client";

interface LibrarySymbolInfoExtended extends LibrarySymbolInfo {
  quote: Symbol;
}

export class Datafeed implements StreamingDataFeed {
  constructor(
    private readonly client: Client,
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
    let query = this.client
      .from("symbols")
      .select("ticker,name,description,type,logo,exchange,exchange_logo")
      .ilike("name", `%${userInput}%`)
      .limit(50);

    if (exchange) query = query.eq("exchange", exchange);
    if (symbolType) query = query.eq("type", symbolType);

    const { data, error } = await query;
    if (error || !data) {
      return onResult([]);
    }

    const result = data.map(
      (d) =>
        ({
          symbol: d.name,
          ticker: d.ticker,
          description: d.description,
          type: d.type,
          logo_urls: this.logoProvider.forLogo(d.logo, []),
          exchange: d.exchange,
          exchange_logo: this.logoProvider.forLogo(d.exchange_logo),
        }) as SearchSymbolResultItem,
    );
    onResult(result);
  }

  async resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback,
  ) {
    const [data, quote] = await Promise.all([
      symbolResolve(symbolName).catch(() => null),
      symbolQuote(symbolName).catch(() => null),
    ]);
    if (!data) {
      onError("Unable to resolve symbol");
      return;
    }

    const symbol = {
      name: data.name,
      ticker: data.ticker,
      description: data.description,
      type: data.type,
      logo_urls: this.logoProvider.forLogo(data.logo, []),
      exchange: data.exchange,
      exchange_logo: data.exchange_logo,
      timezone: data.timezone,
      subsessions: data.subsessions,
      subsession_id: data.subsession_id,
      corrections: data.corrections,
      minmov: data.minmov,
      pricescale: data.pricescale,
      currency_code: data.currency_code,
      session: data.session,
      industry: data.industry,
      sector: data.sector,
      has_intraday: false,
      session_display: data.session_display,
      data_status: "endofday",
      has_daily: true,
      session_holidays: data.session_holidays,
      quote,
    } as LibrarySymbolInfoExtended;
    onResolve(symbol);
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) {
    const path = `/api/v1/symbols/upstox/${symbolInfo.ticker}/candles/${resolution}/${periodParams.to}/${periodParams.countBack}`;
    const response = await this.axios.get<Record<string, unknown>>(path, {
      params: { first_request: periodParams.firstDataRequest },
    });
    if (response.status >= 400) {
      onError("Unable to resolve symbol");
      return;
    }
    const data = response.data;
    if (!data) {
      onError("Unable to resolve symbol");
      return;
    }
    const values = data.v as number[][];
    if (!values || values.length === 0) {
      onResult([], { noData: true });
      return;
    }
    const bars = values.map(
      (v) =>
        ({
          time: v[0],
          open: v[1],
          high: v[2],
          low: v[3],
          close: v[4],
          volume: v[5],
        }) satisfies Bar,
    );
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
    const earnings = earnings_release_date_fq_h ?? [];
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
