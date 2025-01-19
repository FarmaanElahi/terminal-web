import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Symbol } from "@/types/symbol";

export const queryClient = new QueryClient();
const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

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

//##################### SYMBOL RESOLVE #####################

export function useSymbolQuote(symbolName: string) {
  return useQuery({
    enabled: !!symbolName,
    queryKey: ["symbol_quote", symbolName],
    queryFn: async () => {
      const path = `/api/v1/symbols/${symbolName}/quote`;
      const response = await webClient.get<Symbol>(path);
      return response.data;
    },
  });
}
