"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { ChartManager } from "@/components/chart/chart_manager";
import axios from "axios";
import { getTradingView } from "@/components/chart/loader";

const manager = new ChartManager(
  axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }),
  process.env.NEXT_PUBLIC_LOGO_BASE_URL as string,
);

export function Chart(props: { chartId: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    getTradingView().then((r) => setIsLoaded(!!r));
  }, []);

  if (!isLoaded) {
    return <></>;
  }
  return <ChartInternal {...props} />;
}

export function ChartInternal(props: { chartId: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>;

  useEffect(() => {
    void manager.create(props.chartId, chartContainerRef.current!);
    return () => {
      manager.close(props.chartId);
    };
  }, [props.chartId]);

  return <div ref={chartContainerRef} className={"h-full overflow-auto"} />;
}
