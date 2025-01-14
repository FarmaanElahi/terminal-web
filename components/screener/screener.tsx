import React, { HTMLAttributes, useMemo } from "react";
import { SymbolTable } from "@/components/symbols/symbol_table";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Screener({ className, ...props }: ScreenerProps) {
  const columns = useMemo(() => ["name", "day_close", "dcr", "wcr"], []);
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
