"use client";
import { ChartManager } from "@/components/chart/chart_manager";
import axios from "axios";
import { client } from "@/lib/state/client";

const manager = new ChartManager(
  client,
  axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
  process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
);

export function useChartManager() {
  return manager;
}
