"use client";

import React, { HTMLAttributes, useMemo } from "react";
import { SymbolTable2 } from "@/components/symbols/symbol_table2";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Screener({ className, ...props }: ScreenerProps) {
  const columns = useMemo(
    () => [
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
    ],
    [],
  );
  const sort = useMemo(() => [{ field: "mcap", asc: false }], []);
  return (
    <SymbolTable2
      columns={columns}
      sort={sort}
      className={className}
      {...props}
    />
  );
}
