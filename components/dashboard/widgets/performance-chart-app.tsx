import React, { useCallback, useMemo, useState } from "react";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WidgetControl } from "@/components/dashboard/widget-control";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGroupRanks } from "@/lib/state/symbol";
import chroma from "chroma-js";
import { ArrowDown, ArrowUp } from "lucide-react";

export function PerformanceChartApp({
  onRemoveWidget,
  layout,
  updateSettings,
}: WidgetProps) {
  const groupChanged = useCallback(
    (group: Group) => {
      updateSettings({ ...layout?.settings, group });
    },
    [updateSettings, layout],
  );

  return (
    <GrouperProvider
      group={(layout.settings?.group ?? 0) as Group}
      onChange={groupChanged}
    >
      <div className={"h-full flex flex-col overflow-auto"}>
        <WidgetControl
          layout={layout}
          onRemove={onRemoveWidget}
          className="mt-2"
        >
          <SymbolRankTable />
        </WidgetControl>
      </div>
    </GrouperProvider>
  );
}

const DUMMY_RANK = 9999;
const TIMEFRAMES = ["1D", "1W", "1M", "3M", "6M", "12M"];

function easedProgress(rank: number, min: number, max: number): number {
  if (max === min) return 0.5;
  const t = (rank - min) / (max - min);
  return 1 - Math.pow(1 - t, 0.7);
}

function getColorFromEffectiveRank(
  rank: number,
  min: number,
  max: number,
): string {
  const eased = easedProgress(rank, min, max);
  const scale = chroma.scale(["#2ecc71", "#e74c3c"]).domain([0, 1]);
  return scale(eased).hex();
}

export default function SymbolRankTable() {
  const [sortField, setSortField] = useState("1M");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  const timeframe = useMemo(() => TIMEFRAMES, []);
  const { data = [] } = useGroupRanks({
    group: "sector",
    periods: timeframe,
    sort: { field: sortField, direction: sortDirection },
  });

  // Precompute effective ranks for global min/max
  const maxRankPerTimeframe: Record<string, number> = {};
  const allEffectiveRanks: number[] = [];

  timeframe.forEach((tf) => {
    const validRanks = data
      .map((d) => d.ranks[tf])
      .filter((r) => r !== DUMMY_RANK);
    maxRankPerTimeframe[tf] = validRanks.length ? Math.max(...validRanks) : 0;
  });

  data.forEach(({ ranks }) => {
    timeframe.forEach((tf) => {
      const raw = ranks[tf];
      const maxForTF = maxRankPerTimeframe[tf];
      const effective = raw === DUMMY_RANK ? maxForTF + 1 : raw;
      allEffectiveRanks.push(effective);
    });
  });

  const minEffectiveRank = Math.min(...allEffectiveRanks);
  const maxEffectiveRank = Math.max(...allEffectiveRanks);

  const toggleSort = useCallback(
    (tf: string) => {
      if (sortField === tf) {
        setSortDirection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
      } else {
        setSortField(tf);
        setSortDirection("ASC");
      }
    },
    [sortField],
  );

  return (
    <div className="overflow-auto max-h-[80vh]">
      <Table className="min-w-full text-sm text-left border-collapse">
        <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
          <TableRow>
            <TableHead className="p-2 sticky left-0 bg-white z-40 font-bold">
              Group
            </TableHead>
            {timeframe.map((tf) => (
              <TableHead
                key={tf}
                className="p-2 font-semibold text-center cursor-pointer select-none hover:underline"
                onClick={() => toggleSort(tf)}
              >
                <div className="flex items-center justify-center gap-1">
                  {tf}
                  {sortField === tf &&
                    (sortDirection === "ASC" ? (
                      <ArrowUp size={14} className="inline-block" />
                    ) : (
                      <ArrowDown size={14} className="inline-block" />
                    ))}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ symbol, ranks }) => (
            <TableRow key={symbol} className="border-t">
              <TableCell className="p-2 font-bold sticky left-0 bg-white z-10">
                {symbol}
              </TableCell>
              {timeframe.map((tf) => {
                const rawRank = ranks[tf];
                const maxForTF = maxRankPerTimeframe[tf];
                const effectiveRank =
                  rawRank === DUMMY_RANK ? maxForTF + 1 : rawRank;

                const color = getColorFromEffectiveRank(
                  effectiveRank,
                  minEffectiveRank,
                  maxEffectiveRank,
                );

                return (
                  <TableCell
                    key={tf}
                    className="font-semibold"
                    style={{ backgroundColor: color }}
                    title={
                      rawRank === DUMMY_RANK
                        ? `No data — effective rank: ${effectiveRank}`
                        : `Rank: ${rawRank}`
                    }
                  >
                    {effectiveRank}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
