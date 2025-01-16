"use client";

import { ChartLine, Grid3X3, List, Waypoints, X } from "lucide-react";
import React from "react";
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

export default function Page() {
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
                <Toggle size="sm">
                  <ChartLine className="size-4" />
                </Toggle>
                <Toggle size="sm">
                  <Waypoints className="size-4" />
                </Toggle>
              </div>
              <div className="space-x-2">
                <Toggle size="sm">
                  <List className="size-4" />
                </Toggle>
                <Toggle size="sm">
                  <Grid3X3 className="size-4" />
                </Toggle>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1  overflow-auto">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} className={"h-full"}>
              <Screener id={"main"} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70}>
              <Chart id={"main"} />
            </ResizablePanel>
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
