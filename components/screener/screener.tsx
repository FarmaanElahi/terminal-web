"use client";

import React, { HTMLAttributes, useMemo } from "react";
import { SymbolTable2 } from "@/components/symbols/symbol_table2";
import { useScreens } from "@/lib/state/symbol";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  activeScreenId?: string | null;
}

export function Screener({ activeScreenId, ...props }: ScreenerProps) {
  const { data: screens } = useScreens();
  const activeScreen = screens?.find((s) => s.id && s.id === activeScreenId);

  // Use active screen's columns if available, otherwise use default columns
  const visibleColumns = useMemo(() => {
    return (
      activeScreen?.columns ?? [
        "name",
        "mcap",
        "day_close",
        "sector",
        "industry",
        "dcr",
        "wcr",
        "relative_vol_10D",
        "RS_10D_pct",
        "RS_20D_pct",
        "RSNH_1M",
        "gap_pct_D",
      ]
    );
  }, [activeScreen?.columns]);

  return (
    <SymbolTable2
      columns={visibleColumns}
      className="h-full"
      activeScreenId={activeScreenId}
      {...props}
    />
  );
}
