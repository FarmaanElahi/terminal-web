import React, { useCallback, useMemo, useState } from "react";
import {
  Group,
  GrouperProvider,
  useGroupFilterSwitcher,
} from "@/lib/state/grouper";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

export function GroupRankingApp({
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
const TIMEFRAMES = ["1D", "1W", "2W", "1M", "3M", "6M", "12M"];

function getColorFromEffectiveRank(
  rank: number,
  min: number,
  max: number,
): string {
  const scale = chroma
    .scale(["#2196F3", "#6677F6", "#B056F9", "#ec4899"])
    .domain([min, min + (max - min) * 0.25, min + (max - min) * 0.5, max]);
  return scale(rank).hex();
}

type IndustryGroup = "sector" | "industry" | "sub_industry" | "industry_2";
export default function SymbolRankTable() {
  const switchFilter = useGroupFilterSwitcher();
  const [sortField, setSortField] = useState("1M");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [group, setGroup] = useState<IndustryGroup>("industry");

  const timeframe = useMemo(() => TIMEFRAMES, []);
  const { data = [] } = useGroupRanks({
    group,
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
      allEffectiveRanks.push(raw);
    });
  });

  const minRank = Math.min(...allEffectiveRanks);
  const maxRank = Math.max(...allEffectiveRanks);

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
        <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
          <TableRow>
            <TableHead className="p-2 sticky left-0 bg-background z-40 font-bold">
              <Select
                value={group}
                onValueChange={(s) => setGroup(s as IndustryGroup)}
              >
                <SelectTrigger className="w-[180px] ring-0 outline-0">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sector">Sector</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                  <SelectItem value="industry_2">Niche</SelectItem>
                  <SelectItem value="sub_industry">Sub Industry</SelectItem>
                </SelectContent>
              </Select>
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
              <TableCell
                className="p-2 font-bold sticky left-0 cursor-pointer hover:underline"
                onClick={() => {
                  switchFilter({
                    name: symbol,
                    state: {
                      advancedFilterModel: {
                        filterType: "join",
                        type: "AND",
                        conditions: [
                          {
                            colId: group,
                            filterType: "text",
                            filter: symbol,
                            type: "equals",
                          },
                        ],
                      },
                    },
                  });
                }}
              >
                {symbol}
              </TableCell>
              {timeframe.map((tf) => {
                const rawRank = ranks[tf];

                const color = getColorFromEffectiveRank(
                  rawRank,
                  minRank,
                  maxRank,
                );

                return (
                  <TableCell
                    key={tf}
                    className="font-semibold"
                    style={{ backgroundColor: color }}
                    title={
                      rawRank === DUMMY_RANK
                        ? `No data — effective rank: ${rawRank}`
                        : `Rank: ${rawRank}`
                    }
                  >
                    {rawRank}
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
