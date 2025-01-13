import { useQuery } from "react-query";
import type { Symbol } from "@/types/symbol";
import axios from "axios";

const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export function useScreener(payload: {
  columns: string[];
  sort: { field: string; asc: boolean }[];
}) {
  return useQuery<Symbol[]>("default-screener", async () => {
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

    const data = { ...payload, columns: [...missingCols, ...columns] };
    const result = await webClient.post("/api/v1/screener/scan", data);
    return result.data;
  });
}
