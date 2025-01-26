"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryClient, supabase, upstox } from "@/lib/state/supabase";
import { DateTime, FixedOffsetZone } from "luxon";
import {
  GetHistoricalCandleResponse,
  GetIntraDayCandleResponse,
  HistoryApi,
} from "upstox-js-sdk";
import { LibrarySymbolInfo } from "@/components/chart/types";
import type { Symbol } from "@/types/symbol";

//##################### SYMBOL QUOTE #####################
async function symbolQuoteQueryFn(ticker: string) {
  const { data, error } = await supabase
    .from("symbols")
    .select()
    .eq("ticker", ticker)
    .maybeSingle();

  if (error || !data) throw new Error("Unable to resolve symbol");
  return data;
}

export function symbolQuote(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_quote", symbol],
    queryFn: async () => symbolQuoteQueryFn(symbol),
  });
}

export function useSymbolQuote(symbolName?: string) {
  return useQuery({
    enabled: !!symbolName,
    queryKey: ["symbol_quote", symbolName],
    queryFn: async () => symbolQuoteQueryFn(symbolName!),
  });
}

//##################### SYMBOL QUOTE #####################

//##################### SYMBOL RESOLVE #####################
async function symbolResolveFn(ticker: string) {
  const { data, error } = await supabase
    .from("symbols")
    .select(
      `ticker,name,description,type,logo,exchange,exchange_logo,subsessions,timezone,currency,industry,sector,session_holidays,isin`,
    )
    .eq("ticker", ticker)
    .maybeSingle();

  if (error || !data) throw new Error("Unable to resolve symbol");
  return data;
}

export function symbolResolve(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_resolve", symbol],
    staleTime: 100,
    queryFn: async () => symbolResolveFn(symbol),
  });
}

//##################### SYMBOL QUOTE #####################

//##################### SYMBOL SEARCH #####################

interface SymbolSearchOptions {
  exchange?: string;
  type?: string;
  signal?: AbortSignal;
  limit?: number;
}

async function symbolSearchQueryFn(q: string, option?: SymbolSearchOptions) {
  let query = supabase
    .from("symbols")
    .select("ticker,name,description,type,logo,exchange,exchange_logo")
    .ilike("name", `%${q}%`)
    .limit(option?.limit ?? 50);

  if (option?.exchange) query = query.eq("exchange", option.exchange);
  if (option?.type) query = query = query.eq("type", option.type);
  if (option?.signal) query = query.abortSignal(option.signal);

  const { data, error } = await query;
  if (error || !data) throw new Error("Error");
  return data;
}

export function symbolSearch(
  q: string,
  options?: Omit<SymbolSearchOptions, "signal">,
) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_search", q, options],
    queryFn: async ({ signal }) =>
      symbolSearchQueryFn(q, { ...options, signal }),
  });
}

export function useSymbolSearch(
  q: string,
  options?: Omit<SymbolSearchOptions, "signal">,
) {
  return useQuery({
    queryKey: ["symbol_search", q, options],
    enabled: !!q,
    queryFn: async ({ signal }) =>
      symbolSearchQueryFn(q, { ...options, signal }),
  });
}

//##################### SYMBOL SEARCH #####################

//##################### SYMBOL CANDLE #####################

const upstoxHistory = new HistoryApi(upstox);

export async function symbolCandle(
  symbolInfo: LibrarySymbolInfo,
  interval: "day",
  to: DateTime,
  from: DateTime,
  firstRequest: boolean,
) {
  const instrumentKey = toUpstoxInstrumentKey(symbolInfo);
  const timeIndex = 0;
  const openIndex = 1;
  const highIndex = 2;
  const lowIndex = 3;
  const closeIndex = 4;
  const volumeIndex = 5;

  const historyPromise = new Promise<GetHistoricalCandleResponse>(
    (resolve, reject) => {
      upstoxHistory.getHistoricalCandleData1(
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
  if (firstRequest) {
    const intraday = await new Promise<GetIntraDayCandleResponse>(
      (resolve, reject) => {
        upstoxHistory.getIntraDayCandleData(
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

    const { candles } = intraday.data;
    if (candles.length > 0) {
      const time = candles[0][timeIndex];
      const open = candles[0][openIndex];
      const high = Math.max(...candles.map((c) => c[highIndex]));
      const low = Math.min(...candles.map((c) => c[lowIndex]));
      const close = candles[candles.length - 1][closeIndex];
      const volume = candles
        .map((c) => c[volumeIndex])
        .reduce((a, b) => a + b, 0);
      intradayCandle.push([time, open, high, low, close, volume, 0]);
    }
  }

  const candles = await historyPromise.then((h) => h.data.candles);
  candles.push(...intradayCandle);

  return candles
    .map(([ts, open, high, low, close, volume]) => {
      const utc = FixedOffsetZone.utcInstance;
      const time = DateTime.fromISO(ts.split("+")[0], { zone: utc })
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toMillis();
      return { time, open, high, low, close, volume };
    })
    .reverse();
}

function toUpstoxInstrumentKey(symbol: LibrarySymbolInfo) {
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

//##################### SYMBOL CANDLE #####################

//##################### SCREENER_SCAN #####################
type ScreenerResponse = {
  data: Symbol[];
  meta: { total: number };
  nextOffset: number;
};

type ScreenerRequest = {
  columns: string[];
  sort: { field: string; asc: boolean }[];
  type?: "stock" | "fund" | "index";
};

export function useScreener({ columns, sort, type }: ScreenerRequest) {
  return useInfiniteQuery<ScreenerResponse>({
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    queryKey: ["symbols", columns, sort],
    queryFn: async (context) => {
      const defCols = ["name", "exchange", "logo", "country_code", "currency"];

      const page = context.pageParam as number;
      const limit = 50;
      const offset = page * limit;
      const colKeys = [...defCols, columns].join(",");
      let query = supabase
        .from("symbols")
        .select(colKeys)
        .range(offset, offset + limit - 1);

      if (type) query = query.eq("type", type);

      for (const sorting of sort) {
        query = query.order(sorting.field, {
          ascending: false,
          nullsFirst: false,
        });
      }

      const { data, error } = await query;
      if (error || !data) throw new Error("Unable to generate screener result");
      return {
        data: data as unknown as Symbol[],
        meta: { total: 5000 },
        nextOffset: page + 1,
      };
    },
  });
}

//##################### SCREENER_SCAN #####################

//##################### CHART #####################

export function allCharts() {
  return queryClient.fetchQuery({
    queryKey: ["chart_layouts"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_layouts")
        .select(`id,symbol,resolution,name,created_at`)
        .abortSignal(signal);

      if (error || !data) throw new Error("Cannot fetch charts");
      return data;
    },
  });
}

export function chartContent(chartId: number | string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_layouts_content", chartId],
    queryFn: async ({ signal }) => {
      chartId = typeof chartId === "number" ? "" + chartId : chartId;
      const { data, error } = await supabase
        .from("chart_layouts")
        .select(`content`)
        .eq("id", chartId)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data) throw new Error("Cannot fetch chart content");
      return data.content;
    },
  });
}

export function allChartTemplates() {
  return queryClient.fetchQuery({
    queryKey: ["chart_templates"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_templates")
        .select(`name`)
        .abortSignal(signal);
      if (error || !data) throw new Error("Cannot fetch chart templates");
      return data.map((d) => d.name);
    },
  });
}

export function chartTemplateContent(name: string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_templates_content", name],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_templates")
        .select(`content`)
        .eq("name", name)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data) {
        throw new Error("Cannot fetch chart template content");
      }
      return data;
    },
  });
}

export function allStudyTemplates() {
  return queryClient.fetchQuery({
    queryKey: ["study_templates"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("study_templates")
        .select(`name`)
        .abortSignal(signal);

      if (error || !data) throw new Error("Cannot fetch study template");
      return data;
    },
  });
}

export function studyTemplateContent(name: string) {
  return queryClient.fetchQuery({
    queryKey: ["study_templates_content", name],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("study_templates")
        .select(`content`)
        .eq("name", name)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data)
        throw new Error("Cannot fetch study template content");
      return data.content as string;
    },
  });
}

export function chartDrawings(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_drawings", symbol],
    staleTime: 300,
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_drawings")
        .select()
        .eq("symbol", symbol)
        .abortSignal(signal);

      if (error) throw new Error("Cannot fetch chart layout drawing");
      return data;
    },
  });
}
