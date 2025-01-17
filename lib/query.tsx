import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();
const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

//##################### SYMBOL RESOLVE #####################
async function symbolResolveQueryFn(symbol: string) {
  const path = `/api/v1/symbols/${symbol}/resolve`;
  const response = await webClient.get<Record<string, unknown>>(path);
  return response.data;
}

export function symbolResolveAPI(symbolName: string) {
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
