"use client";
import { HTMLAttributes, RefObject, useEffect, useRef } from "react";
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
  const chartTheme =
    theme.theme === "dark" ? "dark" : (theme.systemTheme ?? "light");

  // Only create a widget when the widget is loaded for the first time
  useEffect(() => {
    const widget = manager.create(
      chartContainerRef.current,
      symbol,
      chartTheme,
      () => (widgetRef.current = widget),
    );
    return () => widget.remove();
  });

  useEffect(() => {
    if (!widgetRef.current) return;
    // Change the symbol
    for (let i = 0; i < widgetRef.current.chartsCount(); i++) {
      const resolution = widgetRef.current.chart(i).resolution();
      widgetRef.current.chart(i).setSymbol(symbol, resolution);
    }
  }, [symbol]);

  useEffect(() => {
    widgetRef.current?.changeTheme(chartTheme);
  }, [chartTheme]);

  return (
    <div
      ref={chartContainerRef}
      className={"h-full overflow-auto"}
      {...props}
    />
  );
}
