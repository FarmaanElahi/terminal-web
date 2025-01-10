import { useScreener } from "@/lib/api";
import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/screener/table";
import { columns } from "@/components/screener/column";

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {}

export function Screener({ className, ...props }: ScreenerProps) {
  const { isLoading, error, data } = useScreener();
  if (isLoading) return "Loading...";
  if (error) return `Error: ${error}`;

  return (
    <DataTable
      className={cn(className, "h-full overflow-auto")}
      columns={columns}
      data={data!}
      {...props}
    />
  );
}
