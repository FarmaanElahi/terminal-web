"use client";

import { ChartSpline, Grid3X3, List, Waypoints, X } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { Screener } from "@/components/screener/screener";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Chart } from "@/components/chart/chart";
import {
  GrouperProvider,
  GroupSymbolProvider,
  useGroupSymbol,
} from "@/lib/state/grouper";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { SymbolSearch } from "@/components/search/search-command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSymbolQuote } from "@/lib/query";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Page() {
  const [showStats, setShowStats] = useState(true);
  const [showDataPanel, setShowDataPanel] = useState(false);
  return (
    <GroupSymbolProvider>
      <GrouperProvider group={1}>
        <header className="flex h-12 shrink-0 items-center gap-2">
          <SymbolSearch />
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <div>
              <Tag placeholder={"Search Symbol"} name={"JINDRILL"} />
            </div>
            <div className="flex space-x-4">
              <div className="space-x-2">
                <Toggle
                  size="sm"
                  aria-label={"Stats"}
                  onPressedChange={setShowStats}
                  pressed={showStats}
                >
                  <ChartSpline className="size-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  aria-label={"Data Table"}
                  pressed={showDataPanel}
                  onPressedChange={setShowDataPanel}
                >
                  <Waypoints className="size-4" />
                </Toggle>
              </div>
              <div className="space-x-2" aria-label={"List View"}>
                <Toggle size="sm">
                  <List className="size-4" />
                </Toggle>
                <Toggle size="sm">
                  <Grid3X3 className="size-4" aria-label={"Chart View"} />
                </Toggle>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1  overflow-auto">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              id={"screener-list"}
              defaultSize={20}
              className={"h-full"}
            >
              <Screener id={"main"} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id={"screener-center"} defaultSize={60}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel id={"screener-chart"} order={1}>
                  <Chart id={"main"} />
                </ResizablePanel>
                {showStats && (
                  <ResizablePanel
                    id={"screener-stats"}
                    defaultSize={20}
                    order={2}
                  >
                    <StatsTable />
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
            {showDataPanel && (
              <ResizablePanel id={"screener-data-panel"} defaultSize={25}>
                <div className="bg-blue-500 h-full">fdsfs</div>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>
      </GrouperProvider>
    </GroupSymbolProvider>
  );
}

function Tag({ name, placeholder }: { name?: string; placeholder: string }) {
  const symbol = useGroupSymbol()?.split(":")?.[1];
  const value = name || placeholder;
  return (
    <Button
      variant="outline"
      size="sm"
      className="font-bold justify-between w-32"
    >
      {symbol ?? value}
      <X className="size-4" />
    </Button>
  );
}

const StatsTable = () => {
  const [freq] = useState<"fq" | "fy">("fq");
  const symbol = useGroupSymbol();
  const { data: quote } = useSymbolQuote(symbol);
  const moneyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      compactDisplay: "short",
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    });
  }, []);

  const percentFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      notation: "compact",
      compactDisplay: "short",
      style: "percent",
      maximumFractionDigits: 2,
    });
  }, []);

  const data = useMemo(() => {
    if (!quote) return { noData: true } as const;

    const sales =
      (freq === "fq" ? quote.revenue_action_fq_h : quote.revenue_action_fy_h) ??
      [];
    const earnings =
      (freq === "fq" ? quote.earning_action_fq_h : quote.earning_action_fy_h) ??
      [];

    const tableData = earnings.map((e, index) => ({
      period: e.FiscalPeriod,
      salesActual: sales[index]?.Actual,
      salesEstimate: sales[index]?.Estimate,
      salesSurprise: sales[index]?.Surprise,
      salesReported: sales[index]?.IsReported,
      earningActual: e.Actual,
      earningEstimate: e.Estimate,
      earningSurprise: e.Surprise,
      earningReported: e.IsReported,
    }));
    const firstEstimateIndex = tableData.findIndex((r) => !r.salesReported);

    return {
      noData: false,
      tableData,
      firstEstimateIndex,
    } as const;
  }, [quote, freq]);

  const tableRef = useRef<HTMLTableElement>(null);

  if (data.noData) {
    return null;
  }

  const { tableData, firstEstimateIndex } = data;
  return (
    <div className="w-full overflow-auto h-full transition-colors cursor-default border ms-2 ">
      <Table ref={tableRef} className="w-full table-auto h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead
              key={"Period"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10"
            >
              Period
            </TableHead>

            {tableData.map((c, index) => (
              <TableHead
                key={c.period}
                className={cn("text-left px-6 text-nowrap", {
                  "border-l-2 border-muted": firstEstimateIndex === index,
                })}
              >
                {c.period}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              key={"Sales"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10 border-r"
            >
              Sales
            </TableCell>
            {tableData.map((c, index) => {
              const value =
                firstEstimateIndex >= index ? c.salesEstimate : c.salesActual;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
              const formattedActual = c.salesActual
                ? moneyFormatter.format(c.salesActual)
                : "-";
              const formattedEstimate = c.salesEstimate
                ? moneyFormatter.format(c.salesEstimate)
                : "-";
              const formattedSurpriseAbs =
                c.salesActual && c.salesEstimate
                  ? moneyFormatter.format(c.salesActual - c.salesEstimate)
                  : "-";
              const formattedSurprise = c.salesSurprise
                ? percentFormatter.format(c.salesSurprise / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish": c.salesSurprise && c.salesSurprise > 0,
                      "text-bearish": c.salesSurprise && c.salesSurprise < 0,
                    })}
                  >
                    {formattedSurprise}
                  </div>
                </>
              );

              const detail = (
                <div>
                  <div className="bg-muted p-2">Sales</div>
                  <div className="p-2 space-y-2">
                    <div className="space-x-2">
                      <span className="font-bold">Actual:</span>
                      <span>{formattedActual}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Estimate:</span>
                      <span>{formattedEstimate}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise:</span>
                      <span className="font-bold">{formattedSurpriseAbs}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise%:</span>
                      <span className="font-bold">{formattedSurprise}</span>
                    </div>
                  </div>
                </div>
              );

              return (
                <TableCell
                  key={index}
                  className={cn("text-left px-6 text-nowrap", {
                    "border-l-2 border-muted": firstEstimateIndex === index,
                  })}
                >
                  <HoverCard openDelay={50} closeDelay={50}>
                    <HoverCardTrigger>{overview}</HoverCardTrigger>
                    <HoverCardContent className="p-0">
                      {detail}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow>
            <TableCell
              key={"Earning"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10 border-r"
            >
              Earning
            </TableCell>
            {tableData.map((c, index) => {
              const value =
                firstEstimateIndex >= index
                  ? c.earningEstimate
                  : c.earningActual;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
              const formattedActual = c.earningActual
                ? moneyFormatter.format(c.earningActual)
                : "-";
              const formattedEstimate = c.earningEstimate
                ? moneyFormatter.format(c.earningEstimate)
                : "-";
              const formattedSurpriseAbs =
                c.earningActual && c.earningEstimate
                  ? moneyFormatter.format(c.earningActual - c.earningEstimate)
                  : "-";
              const formattedSurprise = c.earningSurprise
                ? percentFormatter.format(c.earningSurprise / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish":
                        c.earningSurprise && c.earningSurprise > 0,
                      "text-bearish":
                        c.earningSurprise && c.earningSurprise < 0,
                    })}
                  >
                    {formattedSurprise}
                  </div>
                </>
              );

              const detail = (
                <div>
                  <div className="bg-muted p-2">Earning</div>
                  <div className="p-2 space-y-2">
                    <div className="space-x-2">
                      <span className="font-bold">Actual:</span>
                      <span>{formattedActual}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Estimate:</span>
                      <span>{formattedEstimate}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise:</span>
                      <span className="font-bold">{formattedSurpriseAbs}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise%:</span>
                      <span className="font-bold">{formattedSurprise}</span>
                    </div>
                  </div>
                </div>
              );

              return (
                <TableCell
                  key={index}
                  className={cn("text-left px-6 text-nowrap", {
                    "border-l-2 border-muted": firstEstimateIndex === index,
                  })}
                >
                  <HoverCard openDelay={50} closeDelay={50}>
                    <HoverCardTrigger>{overview}</HoverCardTrigger>
                    <HoverCardContent className="p-0">
                      {detail}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
