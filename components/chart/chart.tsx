"use client";
import { HTMLAttributes, RefObject, useEffect, useMemo, useRef } from "react";
import type { TradingView } from "@/components/chart/charting";
import { useChartManager } from "@/lib/state/charts";
import { useGroupSymbol } from "@/lib/state/grouper";
import { useTheme } from "next-themes";

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Chart(props: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>;
  const widgetRef = useRef<TradingView.widget>(null);

  const manager = useChartManager();
  const symbol = useGroupSymbol();
  const theme = useTheme();
  const initializing = useRef(false);
  const chartTheme = useMemo(() => {
    if (theme.theme === "dark") {
      return "dark";
    }
    if (theme.theme === "light") {
      return "light";
    }
    return theme.systemTheme ?? "light";
  }, [theme]);

  useEffect(() => {
    console.log(chartTheme, manager, symbol, widgetRef, chartContainerRef);
    if (chartContainerRef.current && !widgetRef.current) {
      // If it is initializing, then we have to wait
      if (initializing.current) return;

      console.log("Initializing");
      // Create new
      initializing.current = true;
      widgetRef.current = manager.create(
        chartContainerRef.current,
        symbol,
        chartTheme,
      );

      // Mark as initializing
      initializing.current = false;
    } else if (widgetRef.current) {
      for (let i = 0; i < widgetRef.current.chartsCount(); i++) {
        const resolution = widgetRef.current.chart(i).resolution();
        widgetRef.current.chart(i).setSymbol(symbol, resolution);
      }

      widgetRef?.current?.changeTheme(chartTheme);
    }
  }, [chartTheme, manager, symbol, widgetRef, chartContainerRef]);

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove(); // Ensure proper cleanup
        widgetRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className={"h-full overflow-auto"}
      {...props}
    />
  );
}
