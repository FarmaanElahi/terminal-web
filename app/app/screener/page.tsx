"use client";

import { ChartLine, Grid3X3, LayoutGrid, Waypoints, X } from "lucide-react";
import React from "react";
import { Screener } from "@/components/screener/screener";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Chart } from "@/components/chart/chart";
import { GrouperProvider, GroupSymbolProvider } from "@/lib/state/grouper";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { List } from "lucide-react";

export default function Page() {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2">
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
        <GroupSymbolProvider>
          <GrouperProvider group={1}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={30} className={"h-full"}>
                <Screener id={"main"} />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={70}>
                <Chart id={"main"} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </GrouperProvider>
        </GroupSymbolProvider>
      </div>
    </>
  );
}

function Tag({ name, placeholder }: { name?: string; placeholder: string }) {
  const value = name || placeholder;
  return (
    <Button
      variant="outline"
      size="sm"
      className="font-bold justify-between w-32"
    >
      {value}
      <X className="size-4" />
    </Button>
  );
}
