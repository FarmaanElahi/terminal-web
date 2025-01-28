"use client";

import { ChartSpline, Grid3X3, List, Table, Waypoints, X } from "lucide-react";
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
import { Stats } from "@/components/symbols/symbol_stats";

export default function Page() {
  const [showStats, setShowStats] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [showSymbols, setShowSymbols] = useState(true);
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
                  onPressedChange={setShowSymbols}
                  pressed={showSymbols}
                >
                  <Table className="size-4" />
                </Toggle>

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
            {showSymbols && (
              <ResizablePanel
                id={"screener-list"}
                defaultSize={20}
                className={"h-full"}
              >
                <Screener id={"main"} />
              </ResizablePanel>
            )}
            <ResizableHandle />
            <ResizablePanel id={"screener-center"} defaultSize={80}>
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
                    <Stats />
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
