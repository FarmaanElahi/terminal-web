"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { ChartManager } from "@/components/chart/chart_manager";
import axios from "axios";

// eslint-disable-next-line
// @ts-ignore
const ChartManagerContext = createContext<ChartManager>();

export function ChartManagerContextProvider(props: { children: ReactNode }) {
  const [manager] = useState(
    () =>
      new ChartManager(
        axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
        process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
      ),
  );

  return (
    <ChartManagerContext.Provider value={manager}>
      {props.children}
    </ChartManagerContext.Provider>
  );
}

export function useChartManager() {
  return useContext(ChartManagerContext);
}
