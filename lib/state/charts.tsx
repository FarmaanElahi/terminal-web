"use client";
import { ChartManager } from "@/components/chart/chart_manager";
import { supabase } from "@/utils/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppInfo } from "@/hooks/use-app-info";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";

interface Charts {
  manager: ChartManager;
}

const ChartContext = createContext<Charts | null>(null);

export function ChartProvider({ children }: { children: ReactNode }) {
  const appInfo = useAppInfo();
  const [manager] = useState(
    () =>
      new ChartManager(
        supabase,
        process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
        appInfo.tradingAccounts,
      ),
  );

  // Just globally initialize market data streamer
  // Best place to initialize now before the chart is even ready
  useEffect(() => {
    const upstoxToken = appInfo.tradingAccounts.find(
      (value) => value.type === "upstox",
    )?.token;

    if (!upstoxToken) return;
    void MarketDataStreamer.getInstance().connectNow(upstoxToken);
  }, [appInfo.tradingAccounts]);

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
