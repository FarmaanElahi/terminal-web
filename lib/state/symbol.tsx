import { useQuery } from "@tanstack/react-query";
import { client, queryClient } from "@/lib/state/client";

//##################### SYMBOL QUOTE #####################
async function symbolQuoteQueryFn(ticker: string) {
  const { data, error } = await client
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

//##################### SYMBOL SEARCH #####################

interface SymbolSearchOptions {
  exchange?: string;
  type?: string;
  signal?: AbortSignal;
  limit?: number;
}

async function symbolSearchQueryFn(q: string, option?: SymbolSearchOptions) {
  let query = client
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
