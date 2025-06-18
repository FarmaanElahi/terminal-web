"use client";

import { GrouperProvider, GroupSymbolProvider } from "@/lib/state/grouper";
import { Chart } from "@/components/chart/chart";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const q = useSearchParams();

  return (
    <GroupSymbolProvider def={{ 0: q.get("symbol") ?? "NSE:NIFTY" }}>
      <GrouperProvider group={0}>
        <Chart features={{ enableSearch: true, enableWatchlist: true }} />
      </GrouperProvider>
    </GroupSymbolProvider>
  );
}
