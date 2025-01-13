import React, { HTMLAttributes } from "react";
import { useScreener } from "@/hooks/state";
import { SymbolTable } from "@/components/symbols/symbol_table";

type ScreenerProps = HTMLAttributes<HTMLDivElement>;

export function Screener({ className, ...props }: ScreenerProps) {
  const { isLoading, error, data } = useScreener();
  if (isLoading) return "Loading...";
  if (error) return `Error: ${error}`;
  return (
    <SymbolTable
      id={"main"}
      data={data ?? []}
      columns={["day_close", "dcr", "wcr", "mcr"]}
      className={className}
      {...props}
    />
  );
}
