import type { Symbol } from "@/types/symbol";
import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

type ScreenerResponse = {
  data: Symbol[];
  meta: { total: number };
  nextOffset: number;
};

type ScreenerRequest = {
  columns: string[];
  sort: { field: string; asc: boolean }[];
};

export function useScreener({ columns, sort }: ScreenerRequest) {
  return useInfiniteQuery<ScreenerResponse>({
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    queryKey: ["symbols", columns, sort],
    queryFn: async (context) => {
      const defCols = ["name", "exchange", "logo", "country_code", "currency"];
      const page = context.pageParam as number;
      const limit = 50;
      const offset = page * limit;
      const data = { sort, columns: [...columns, ...defCols], limit, offset };
      const result = await webClient.post<Omit<ScreenerResponse, "nextOffset">>(
        "/api/v1/screener/scan",
        data,
      );
      return { ...result.data, nextOffset: page + 1 };
    },
  });
}

type SymbolSearchResult = {
  data: Pick<
    Symbol,
    "name" | "description" | "type" | "logo" | "exchange" | "exchange_logo"
  > &
    { ticker: string }[];
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
