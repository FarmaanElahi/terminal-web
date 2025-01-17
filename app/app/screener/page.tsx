"use client";

import { ChartSpline, Grid3X3, List, Waypoints, X } from "lucide-react";
import React, { useState } from "react";
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
  const period = [
    "2023 Q2",
    "2023 Q3",
    "2023 Q4",
    "2024 Q1",
    "2024 Q2",
    "2024 Q3",
    "2024 Q4",
    "2025 Q1",
    "2025 Q2",
    "2025 Q3",
  ];
  const earning = [
    "$0.08 (+121.05%)",
    "$0.06 (+113.04%)",
    "$0.26 (+174.29%)",
    "$0.57 (+1050.00%)",
    "$0.51 (+537.50%)",
    "$0.35 (+486.68%)",
    "$0.44 (+69.76%)",
    "$0.53 (+537.50%)",
    "$0.36 (+486.68%)",
    "$0.40 (+69.76%)",
  ];
  const sales = [
    "$126.84M (+43.50%)",
    "$137.62M (+43.25%)",
    "$150.99M (+45.43%)",
    "$167.55M (+44.86%)",
    "$178.33M (+40.59%)",
    "$189.19M (+37.48%)",
    "$201.27M (+33.30%)",
    "$178.31M (+40.59%)",
    "$189.20M (+37.48%)",
    "$201.28M (+33.30%)",
  ];

  return (
    <div className="overflow-auto h-full w-full">
      <div>
        <Table>
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead key={"Period"} className="sticky left-0 bg-background">
                Period
              </TableHead>
              {period.map((p) => (
                  <TableHead key={p} className="w-48">
                    {p}
                  </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            <TableRow>
              <TableCell
                  key={"Earning"}
                  className="sticky left-0  z-10 bg-background"
              >
                Earning
              </TableCell>
              {earning.map((e) => (
                  <TableCell key={e} className="w-48">
                    {e}
                  </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
