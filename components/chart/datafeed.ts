import {
  Bar,
  DatafeedConfiguration,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  StreamingDataFeed,
} from "@/components/chart/types";
import { AxiosInstance } from "axios";
import { LogoProvider } from "@/components/chart/logo_provider";
import { symbolResolveAPI } from "@/lib/query";

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
    } satisfies DatafeedConfiguration;
    setTimeout(() => callback(config));
  }

  async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ) {
    const path = "/api/v1/symbols/search";
    const response = await this.axios.get<{ data: Record<string, unknown>[] }>(
      path,
      {
        params: { q: userInput, exchange, symbol_type: symbolType },
      },
    );
    if (response.status >= 400) {
      onResult([]);
      return;
    }

    const result = response.data.data.map(
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
    const data = await symbolResolveAPI(symbolName).catch(() => null);
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
    } as LibrarySymbolInfo;
    onResolve(symbol);
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) {
    const path = `/api/v1/symbols/${symbolInfo.ticker}/candles/${resolution}/${periodParams.to}`;
    const response = await this.axios.get<Record<string, unknown>>(path);
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
}
