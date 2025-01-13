import React, { HTMLAttributes, useMemo } from "react";
import { useScreener } from "@/lib/state/screener";
import { SymbolTable } from "@/components/symbols/symbol_table";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Screener({ className, ...props }: ScreenerProps) {
  const columns = useMemo(
    () => [
      "day_close",
      "dcr",
      "wcr",
    ],
    [],
  );
  const sort = useMemo(() => [{ field: "mcap", asc: false }], []);
  const { isLoading, error, data } = useScreener({ columns, sort });
  if (isLoading) return "Loading...";
  if (error) return `Error: ${error}`;
  return (
    <SymbolTable
      data={data ?? []}
      columns={columns}
      className={className}
      {...props}
    />
  );
}
