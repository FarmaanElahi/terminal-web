import type { Symbol } from "@/types/symbol";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export function useScreener(payload: {
  columns: string[];
  sort: { field: string; asc: boolean }[];
}) {
  const result = useInfiniteQuery<{ rows: Symbol[]; nextOffset: number }>({
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
      const columns = new Set<string>(payload.columns ?? []);
      const missingCols = mandatoryColumns.filter((c) => !columns.has(c));

      const data = {
        ...payload,
        columns: [...missingCols, ...columns],
        limit,
        offset,
      };

      const result = await webClient.post("/api/v1/screener/scan", data);
      return {
        rows: result.data as Symbol[],
        nextOffset: offset + 1,
      };
    },
  });

  const data = useMemo(
    () => result?.data?.pages?.flatMap((p) => p.rows) ?? ([] as Symbol[]),
    [result],
  );

  return { ...result, data };
}
