"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryClient, supabase } from "@/utils/client";
import type { Symbol } from "@/types/symbol";
import { fetchStockTwit } from "@/server/stocktwits";
import type { StockTwitFeed } from "@/types/stocktwits";
import { queryDuckDB } from "@/utils/duckdb";
import {
  InsertScreen,
  InsertWatchlist,
  Screen,
  UpdateScreen,
  UpdateWatchlist,
  Watchlist,
} from "@/types/supabase";

//##################### SYMBOL QUOTE #####################
async function symbolQuoteQueryFn(ticker: string) {
  const d = await queryDuckDB<Symbol>("symbols", {
    where: `ticker = '${ticker}'`,
    limit: 1,
  });
  if (d.length === 0) throw new Error("Cannot find quote");
  return d[0];
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
  const d = await queryDuckDB<Symbol>("symbols", {
    columns: [
      "ticker",
      "name",
      "description",
      "type",
      "logo",
      "exchange",
      "exchange_logo",
      "subsessions",
      "timezone",
      "currency",
      "industry",
      "sector",
      "session_holidays",
      "isin",
      "earnings_release_date_fq_h",
      "earnings_release_date_fq_h",
      "earnings_release_next_date",
    ],
    where: `ticker = '${ticker}'`,
    limit: 1,
  });

  if (d.length === 0) throw new Error("Cannot find quote");
  return d[0];
}

export function symbolResolve(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_resolve", symbol],
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
  const where = [
    `"name" ILIKE '%${q}%'`,
    option?.exchange ? `"exchange" = '${option.exchange}'` : undefined,
    option?.type ? `"type" = '${option.type}'` : undefined,
  ]
    .filter((q) => q)
    .join(" &");

  return await queryDuckDB<Symbol>("symbols", {
    columns: [
      "ticker",
      "name",
      "description",
      "type",
      "logo",
      "exchange",
      "exchange_logo",
    ],
    where,
    limit: option?.limit ?? 50,
  });
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

export function useScreener() {
  return useQuery({
    queryKey: ["symbols2"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const result = await queryDuckDB("symbols", {
        columns: [], // Will load all columns
        where: `type = 'stock'`,
        order: [{ field: "mcap", sort: "DESC" }],
      });
      return result as Symbol[];
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
      return data.content as unknown;
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

//##################### SCREENS #####################
export function useCreateScreen(onComplete?: (screen: Screen) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (screen: Screen) => {
      void client.invalidateQueries({ queryKey: ["screens"] });
      onComplete?.(screen);
    },
    mutationFn: async (screen: InsertScreen) => {
      const { data, error } = await supabase
        .from("screens")
        .insert({
          ...screen,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteScreen(onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["screens"] });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("screens")
        .delete()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateScreen(onComplete?: (screen: Screen) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (screen: Screen) => {
      void client.invalidateQueries({ queryKey: ["screens"] });
      onComplete?.(screen);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateScreen;
    }) => {
      const { data, error } = await supabase
        .from("screens")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useScreens() {
  return useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("screens")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

//##################### WATCHLIST #####################

//##################### SCREENS #####################
export function useCreateWatchlist(onComplete?: (screen: Watchlist) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (watchlist: Watchlist) => {
      void client.invalidateQueries({ queryKey: ["watchlist"] });
      onComplete?.(watchlist);
    },
    mutationFn: async (watchlist: InsertWatchlist) => {
      const { data, error } = await supabase
        .from("watchlists")
        .insert({
          ...watchlist,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteWatchlist(onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["watchlist"] });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("watchlists")
        .delete()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateWatchlist(onComplete?: (screen: Watchlist) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: async (watchlist: Watchlist, params) => {
      await client.invalidateQueries({ queryKey: ["watchlist"] });
      if ((params.payload.symbols?.length ?? 0) > 0) {
        await client.invalidateQueries({
          queryKey: ["watchlist", watchlist.id, "symbols"],
        });
      }
      onComplete?.(watchlist);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateWatchlist;
    }) => {
      const { data, error } = await supabase
        .from("watchlists")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useWatchlistSymbols(watchlist?: Watchlist) {
  return useQuery({
    queryKey: ["watchlist", watchlist?.id, "symbols"],
    queryFn: async () => {
      const symbols = watchlist?.symbols;
      if (!symbols || (symbols?.length ?? 0) === 0) return [];

      console.log("Query wathclist symbl", watchlist?.name, symbols);
      const inQuery = symbols.map((s) => `'${s}'`).join(",");
      const result = await queryDuckDB("symbols", {
        columns: [], // Will load all columns
        where: `ticker IN (${inQuery})`,
      });
      return result as Symbol[];
    },
  });
}

//##################### SCREENS #####################
