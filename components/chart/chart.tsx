"use client";
import { RefObject, useEffect, useRef } from "react";
import { ChartManager } from "@/components/chart/chart_manager";
import axios from "axios";

const manager = new ChartManager(
  axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
  process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
);

export function Chart(props: { chartId: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>;

  useEffect(() => {
    void manager.create(props.chartId, chartContainerRef.current!);
    return () => {
      manager.close(props.chartId);
    };
  }, [props.chartId]);

  return (
    <div
      id={`tradingview-widget-container__widget`}
      ref={chartContainerRef}
      className={"h-full overflow-auto"}
    />
  );
}
