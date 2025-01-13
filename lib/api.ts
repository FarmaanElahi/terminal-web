import axios from "axios";

const webClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export async function screenerScanAPI() {
  const response = await webClient.post("/api/v1/screener/scan", {});
  return response.data;
}
