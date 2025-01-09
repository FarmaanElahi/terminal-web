import { RefObject, useEffect, useRef } from "react";
import { ChartManager } from "@/components/chart/chart_manager";

const manager = new ChartManager();

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
      id="tradingview-widget-container"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div
        id={`tradingview-widget-container__widget`}
        ref={chartContainerRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
