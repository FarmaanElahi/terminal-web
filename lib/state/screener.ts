import { useQuery } from "react-query";
import type { Symbol } from "@/types/symbol";
import { screenerScanAPI } from "@/lib/api";
import { useMemo } from "react";
import { defaultSymbolColumns } from "@/components/symbols/column";
import { ColumnDef } from "@tanstack/react-table";

export function useScreener() {
  return useQuery<Symbol[]>("default-screener", screenerScanAPI);
}

export function useScreenerColumnGroup() {
  return useMemo(() => {
    const columnGroups = {} as Record<string, ColumnDef<Symbol>>;
    defaultSymbolColumns.forEach((value) => {
      const category =
        (value.meta as Record<string, string>)?.category ?? "Others";
      columnGroups[category] = value;
    });
    return columnGroups;
  }, []);
}
