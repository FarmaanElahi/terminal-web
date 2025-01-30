"use client";
import { ChartManager } from "@/components/chart/chart_manager";
import { supabase } from "@/utils/client";

const manager = new ChartManager(
  supabase,
  process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
);

export function useChartManager() {
  return manager;
}
