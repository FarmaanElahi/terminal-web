"use client";
import { ChartManager } from "@/components/chart/chart_manager";
import { supabase } from "@/utils/client";
import { createContext, ReactNode, useContext, useState } from "react";
import { useAppInfo } from "@/hooks/use-app-info";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";
import { UpstoxClient } from "@/utils/upstox/client";

interface Charts {
  manager: ChartManager;
}

const ChartContext = createContext<Charts | null>(null);

export function ChartProvider({ children }: { children: ReactNode }) {
  const appInfo = useAppInfo();

  // Used to fetch market data
  const upstoxToken = appInfo.tradingAccounts.find(
    (value) => value.type === "upstox",
  )?.token;

  const [upstoxClient] = useState(() => new UpstoxClient(upstoxToken));

  const [manager] = useState(() => {
    if (upstoxToken) {
      void MarketDataStreamer.getInstance().connectNow(upstoxClient);
    }
    return new ChartManager(supabase, upstoxClient, appInfo.tradingAccounts);
  });

  return (
    <ChartContext.Provider value={{ manager }}>
      {children}
    </ChartContext.Provider>
  );
}

export function useChartManager() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartManager must be used within a ChartProvider");
  }
  return context.manager;
}
