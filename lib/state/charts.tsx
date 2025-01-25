"use client";
import { ChartManager } from "@/components/chart/chart_manager";
import axios from "axios";
import { supabase } from "@/lib/state/supabase";

const manager = new ChartManager(
  supabase,
  axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
  process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
);

export function useChartManager() {
  return manager;
}
