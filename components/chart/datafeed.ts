import {
  DatafeedConfiguration,
  DatafeedErrorCallback,
  GetMarksCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  TimescaleMark,
} from "@/components/chart/types";
import { LogoProvider } from "@/components/chart/logo_provider";
import { symbolQuote, symbolResolve, symbolSearch } from "@/lib/state/symbol";
import type { Symbol } from "@/types/symbol";

export abstract class Datafeed {
  protected symbolCache = new Map<string, Symbol>();

  protected constructor(private readonly logoProvider: LogoProvider) {}

  onReady(callback: OnReadyCallback) {
    const config = {
      supported_resolutions: [
        "1",
        "2",
        "3",
        "5",
        "10",
        "15",
        "30",
        "45",
        "65",
        "D",
        "1W",
        "1M",
        "3M",
        "6M",
        "12M",
      ],
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
    if (!data) {
      onError("Failed");
      return;
    }

    // Cache the symbol
    this.symbolCache.set(data.ticker as string, data);

    // Map it
    const subsession_id = "regular";
    const minmov = data.minmov ?? 5;
    const pricescale = data.pricescale ?? 100;
    // TODO:
    // const sessionDetails = (data.subsessions as Subsession[]).find(
    //   (s) => s.id === subsession_id,
    // );
    // const session = sessionDetails?.session;
    // const session_display = sessionDetails?.["session-display"];
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
      // hardcode for now
      timezone: "Asia/Kolkata",
      subsessions: data.subsessions,
      subsession_id: subsession_id,
      minmov: minmov,
      pricescale: pricescale,
      currency_code: data.currency,
      // hardcode for now
      session: "0900-1535",
      industry: data.industry,
      sector: data.sector,
      has_intraday: true,
      has_seconds: false,
      intraday_multipliers: ["1", "2", "3", "5", "10", "15", "30", "45"],
      // session_display: session_display,
      has_weekly_and_monthly: false,
      data_status: "streaming",
      has_daily: true,
      isin: data.isin,
    } as LibrarySymbolInfo;
    onResolve(symbol);
  }

  async getTimescaleMarks(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
  ) {
    if (!symbolInfo.ticker) return onDataCallback([]);

    const quote = await symbolQuote(symbolInfo.ticker);
    if (!quote) return onDataCallback([]);

    const { earnings_release_date_fq_h, earnings_release_next_date } = quote;
    const marks = [] as TimescaleMark[];
    let currIndex = 0;

    // Earning Marks
    const earnings = (earnings_release_date_fq_h ?? []) as number[];
    earnings.forEach((time, index) => {
      marks.push({
        id: `${currIndex + index}`,
        time: new Date(time).setUTCHours(0, 0, 0, 0) / 1000,
        color: "green",
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
        color: "purple",
        shape: "earning",
        label: "E",
      });
      currIndex += 1;
    }
    onDataCallback(marks);
  }
}
