import axios from "axios";
import { useQuery } from "react-query";
import type { Symbol } from "@/types/symbol";

const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export function useScreener() {
  return useQuery<Symbol[]>("screener", async () => {
    const response = await webClient.post("/api/v1/screener/scan", {});
    return response.data;
  });
}
