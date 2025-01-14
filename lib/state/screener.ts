import type { Symbol } from "@/types/symbol";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

type ScreenerResponse = {
  data: Symbol[];
  meta: { total: number };
  nextOffset: number;
};

export function useScreener(payload?: {
  columns?: string[];
  sort?: { field: string; asc: boolean }[];
}) {
  return useInfiniteQuery<ScreenerResponse>({
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    queryKey: ["default-screener"],
    queryFn: async (context) => {
      const offset = (context.pageParam as number) ?? 0;
      const limit = 50;
      const mandatoryColumns = [
        "name",
        "exchange",
        "logo",
        "earnings_release_next_date",
        "country_code",
        "currency",
        "day_open",
        "day_high",
        "day_low",
        "day_close",
      ];
      const columns = new Set<string>(payload?.columns ?? []);
      const missingCols = mandatoryColumns.filter((c) => !columns.has(c));

      // Sort in case field is missing
      const sort =
        payload?.sort && payload.sort.length > 0
          ? payload.sort
          : [{ field: "mcap", asc: false }];

      const data = {
        sort,
        columns: [...missingCols, ...columns],
        limit,
        offset,
      };

      const result = await webClient.post<{
        meta: { total: number };
        data: Symbol[];
      }>("/api/v1/screener/scan", data);
      return { ...result.data, nextOffset: offset + 1 };
    },
  });
}
