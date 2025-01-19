import type { Symbol } from "@/types/symbol";
import { useInfiniteQuery } from "@tanstack/react-query";
import { webClient } from "@/lib/state/client";

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
