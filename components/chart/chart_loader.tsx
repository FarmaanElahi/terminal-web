"use client";
import { ReactNode, useEffect, useState } from "react";
import { getTradingView } from "@/components/chart/loader";

export function ChartLoader(props: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    getTradingView().then((r) => setIsLoaded(!!r));
  }, []);
  if (!isLoaded) {
    return <></>;
  }
  return props.children;
}
