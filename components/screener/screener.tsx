"use client";

import React, { HTMLAttributes, useEffect, useMemo } from "react";
import { SymbolTable } from "@/components/symbols/symbol_table";
import { useDuckDB } from "@/utils/duckdb";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Screener({ className, ...props }: ScreenerProps) {
  const conn = useDuckDB();

  useEffect(() => {
    if (conn.status === "loaded") {
      console.log("DB loaded");
      conn
        .runQuery("symbols", {
          columns: [
            "price_earnings_ttm",
            "ticker",
            "name",
            "market_cap_basic",
            "close",
            "sector",
            "industry",
            "relative_volume_10d_calc",
            "gap_up",
          ],
          limit: 10,
          order: [
            {
              field: "market_cap_basic",
              sort: "DESC",
              nullLast: true,
            },
          ],
        })
        .then((tbl) => {
          console.log(tbl.toArray().map((r) => r.toJSON()));
        });
    }
    if (conn.status === "loading") {
      console.log("DB loading");
    }
    if (conn.status === "error") {
      console.error("DB loaded");
    }
  }, [conn]);
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
    <SymbolTable
      columns={columns}
      sort={sort}
      className={className}
      {...props}
    />
  );
}
