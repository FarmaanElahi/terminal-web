"use client";
import { createContext, ReactNode, useContext } from "react";
import { ChartManager } from "@/components/chart/chart_manager";
import axios from "axios";

// eslint-disable-next-line
// @ts-ignore
const ChartsContext = createContext<ChartManager>();

export function ChartContextProvider(props: { children: ReactNode }) {
  const manager = new ChartManager(
    axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
    process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
  );
  return <ChartsContext value={manager}>{props.children}</ChartsContext>;
}

export function useChartManager() {
  return useContext(ChartsContext);
}
