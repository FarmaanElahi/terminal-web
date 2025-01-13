import React, { HTMLAttributes } from "react";
import { useScreener } from "@/lib/state/screener";
import { SymbolTable } from "@/components/symbols/symbol_table";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function Screener({ className, ...props }: ScreenerProps) {
  const { isLoading, error, data } = useScreener();
  if (isLoading) return "Loading...";
  if (error) return `Error: ${error}`;
  return (
    <SymbolTable
      data={data ?? []}
      columns={["day_close", "dcr", "wcr", "mcr"]}
      className={className}
      {...props}
    />
  );
}
