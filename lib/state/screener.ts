import type { Symbol } from "@/types/symbol";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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
  const columns = useMemo(() => {
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
    return [...missingCols, ...columns];
  }, [payload?.columns]);

  const sort = useMemo(() => {
    // Sort in case field is missing
    return payload?.sort && payload.sort.length > 0
      ? payload.sort
      : [{ field: "mcap", asc: false }];
  }, [payload?.sort]);

  return useInfiniteQuery<ScreenerResponse>({
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    queryKey: ["symbols", columns, sort],
    queryFn: async (context) => {
      const offset = context.pageParam as number;
      const limit = 50;
      const data = { sort, columns, limit, offset };
      const result = await webClient.post<Omit<ScreenerResponse, "nextOffset">>(
        "/api/v1/screener/scan",
        data,
      );
      return { ...result.data, nextOffset: offset + 1 };
    },
  });
}
