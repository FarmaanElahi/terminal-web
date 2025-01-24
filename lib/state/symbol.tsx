import type { Symbol } from "@/types/symbol";
import { useQuery } from "@tanstack/react-query";
import { queryClient, webClient } from "@/lib/state/client";

//##################### SYMBOL RESOLVE #####################
async function symbolResolveQueryFn(symbol: string) {
  const path = `/api/v1/symbols/${symbol}/resolve`;
  const response = await webClient.get<Symbol>(path);
  return response.data;
}

export function symbolResolve(symbolName: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol", symbolName],
    queryFn: async () => symbolResolveQueryFn(symbolName),
  });
}

export function useSymbolResolve(symbolName: string) {
  return useQuery({
    queryKey: ["symbol", symbolName],
    queryFn: async () => symbolResolveQueryFn(symbolName),
  });
}

//##################### SYMBOL RESOLVE #####################

//##################### SYMBOL QUOTE #####################
async function symbolQuoteQueryFn(symbol: string) {
  const path = `/api/v1/symbols/${symbol}/quote`;
  const response = await webClient.get<Symbol>(path);
  return response.data;
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
type SymbolSearchResult = {
  data: (Pick<
    Symbol,
    "name" | "description" | "type" | "logo" | "exchange" | "exchange_logo"
  > & { ticker: string })[];
  meta: { total: number };
};

export function useSymbolSearch(q: string) {
  return useQuery({
    queryKey: ["symbol_search", q],
    enabled: !!q,
    queryFn: async () => {
      const path = "/api/v1/symbols/search";
      const response = await webClient.get<SymbolSearchResult>(path, {
        params: { q },
      });
      return response.data?.data;
    },
  });
}

//##################### SYMBOL SEARCH #####################
