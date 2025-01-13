"use client";
import { HTMLAttributes, RefObject, useEffect, useRef } from "react";
import type { TradingView } from "@/components/chart/charting";
import { useChartManager } from "@/lib/state/charts";
import { useGroupSymbol } from "@/lib/state/grouper";

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

  useEffect(() => {
    if (chartContainerRef.current && !widgetRef.current) {
      widgetRef.current = manager.create(chartContainerRef.current, symbol);
    } else if (widgetRef.current) {
      const resolution = widgetRef.current.activeChart().resolution();
      widgetRef.current?.setSymbol(symbol, resolution);
    }
  }, [manager, symbol, widgetRef, chartContainerRef]);

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
