"use client";
import React, { HTMLAttributes, RefObject, useEffect, useRef } from "react";
import type { TradingView } from "@/components/chart/charting";
import { useChartManager } from "@/lib/state/charts";
import { useGroupSymbol } from "@/lib/state/grouper";
import { useTheme } from "next-themes";

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  layoutId?: string;
  onLayoutChange?: (id: string) => void;
}

export function Chart({ layoutId, onLayoutChange, ...props }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>;
  const widgetRef = useRef<TradingView.widget>(null);

  const manager = useChartManager();
  const symbol = useGroupSymbol();
  const theme = useTheme();
  const chartTheme =
    theme.theme === "dark"
      ? "dark"
      : theme.theme === "light"
        ? "light"
        : (theme.systemTheme ?? "light");

  // Only create a widget when the widget is loaded for the first time
  useEffect(() => {
    const widget = manager.create(
      chartContainerRef.current,
      symbol,
      chartTheme,
      layoutId,
      {
        onReady: () => (widgetRef.current = widget),
        onLayoutChange,
      },
    );
    return () => widget.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;
    // Change the symbol
    for (let i = 0; i < widget.chartsCount(); i++) {
      const resolution = widget.chart(i).resolution();
      widget.chart(i).setSymbol(symbol, resolution);
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
