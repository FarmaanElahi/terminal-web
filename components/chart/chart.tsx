"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { getTradingView } from "@/components/chart/loader";
import { useChartManager } from "@/components/chart/chart_context";

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
  const manager = useChartManager();

  useEffect(() => {
    void manager.create(props.chartId, chartContainerRef.current!);
    return () => {
      manager.close(props.chartId);
    };
  }, [manager, props.chartId]);

  return <div ref={chartContainerRef} className={"h-full overflow-auto"} />;
}
