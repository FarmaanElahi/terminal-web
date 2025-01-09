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

export class Feed implements StreamingDataFeed {
  constructor(private readonly baseUrl: string) {}

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
    const url = new URL(`${this.baseUrl}/api/v1/symbols/search`);
    url.searchParams.set("q", userInput);
    url.searchParams.set("exchange", exchange);
    url.searchParams.set("symbol_type", symbolType);
    const response = await fetch(url);
    if (!response.ok) {
      onResult([]);
      return;
    }
    const data: Array<Record<string, unknown>> = await response.json();
    const result = data.map(
      (d) =>
        ({
          symbol: d.name,
          ticker: d.ticker,
          description: d.description,
          type: d.type,
          logo_urls: d.logo ? [d.logo] : d.logo,
          exchange: d.exchange,
          exchange_logo: d.exchange_logo ? [d.exchange_logo] : d.exchange_logo,
        }) as SearchSymbolResultItem,
    );
    onResult(result);
  }

  async resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback,
  ) {
    const url = new URL(`${this.baseUrl}/api/v1/symbols/${symbolName}/resolve`);
    const response = await fetch(url);
    if (!response.ok) {
      onError("Unable to resolve symbol");
      return;
    }
    const data: Record<string, unknown> = await response.json();
    if (!data) {
      onError("Unable to resolve symbol");
      return;
    }

    const symbol = {
      name: data.name,
      ticker: data.ticker,
      description: data.description,
      type: data.type,
      logo_urls: data.logo ? [`${data.logo}`] : [],
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
    const url = new URL(
      `${this.baseUrl}/api/v1/symbols/${symbolInfo.ticker}/candles/${resolution}/${periodParams.to}`,
    );

    const response = await fetch(url);
    if (!response.ok) {
      onError("Unable to resolve symbol");
      return;
    }
    const data: Record<string, unknown> = await response.json();
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
