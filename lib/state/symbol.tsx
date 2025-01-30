"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryClient, supabase } from "@/utils/client";
import type { Symbol } from "@/types/symbol";
import { fetchStockTwit } from "@/server/actions";
import type { StockTwitFeed } from "@/types/stocktwits";

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
      `ticker,name,description,type,logo,exchange,exchange_logo,subsessions,
      timezone,currency,industry,sector,session_holidays,isin,
      earnings_release_date_fq_h,earnings_release_date_fq_h,earnings_release_next_date`,
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

      // Incase there is no data, we will use mcap as the sorting by default
      // always
      if (!sort || sort.length === 0) sort = [{ field: "mcap", asc: false }];

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

//##################### SYMBOL DISCUSSION #####################
export function useDiscussionFeed(
  params: Parameters<typeof fetchStockTwit>[0],
) {
  return useInfiniteQuery<StockTwitFeed>({
    initialPageParam: 0,
    getNextPageParam: (lastResponse) => lastResponse.cursor.since + 1,
    queryKey: ["discussion_feed", params],
    queryFn: async () => fetchStockTwit(params),
  });
}
