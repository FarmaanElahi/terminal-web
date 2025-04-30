"use client";

import { ChartSpline, Grid3X3, List, Table } from "lucide-react";
import React, { useRef } from "react";
import { GrouperProvider, GroupSymbolProvider } from "@/lib/state/grouper";
import { Toggle } from "@/components/ui/toggle";
import { SymbolSearch } from "@/components/search/search-command";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Chart } from "@/components/chart/chart";
import { Stats } from "@/components/symbols/stats";
import "@/components/grid/grid_init";
import { ImperativePanelHandle } from "react-resizable-panels";
import { WatchlistProvider } from "@/hooks/use-active-watchlist";
import { WatchlistSelector } from "@/components/watchlist/watchlist-selector";
import { Watchlist } from "@/components/watchlist/watchlist";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <GroupSymbolProvider>
      <GrouperProvider group={1}>
        <WatchlistProvider>
          <WatchlistContent />
        </WatchlistProvider>
      </GrouperProvider>
    </GroupSymbolProvider>
  );
}

function WatchlistContent() {
  const watchlist = useRef<ImperativePanelHandle | null>(null);
  const stats = useRef<ImperativePanelHandle | null>(null);
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2">
        <SymbolSearch />
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex gap-2">
            <SidebarTrigger className="my-auto" />
            <WatchlistSelector />
          </div>
          <div className="flex space-x-4 pr-1">
            <div className="space-x-2">
              <Toggle
                size="sm"
                aria-label={"Watchlist"}
                pressed={true}
                onPressedChange={() =>
                  watchlist.current?.isExpanded()
                    ? watchlist.current?.collapse()
                    : watchlist.current?.expand()
                }
              >
                <Table className="size-4" />
              </Toggle>

              <Toggle
                size="sm"
                aria-label={"Stats"}
                pressed={true}
                onPressedChange={() =>
                  stats.current?.isExpanded()
                    ? stats.current?.collapse()
                    : stats.current?.expand()
                }
              >
                <ChartSpline className="size-4" />
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
      <div className="flex-1 overflow-auto border">
        <ResizablePanelGroup
          autoSaveId={"watchlist-main"}
          direction={"horizontal"}
          className={"transition"}
        >
          <ResizablePanel
            ref={watchlist}
            collapsible
            collapsedSize={0}
            id={"watchlist"}
            defaultSize={20}
            minSize={5}
            className={"transition"}
          >
            <Watchlist />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel collapsible id={"watchlist-center"} defaultSize={80}>
            <ResizablePanelGroup
              direction={"vertical"}
              autoSaveId={"watchlist-center"}
            >
              <ResizablePanel collapsible id={"chart"} defaultSize={80}>
                <Chart />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                collapsible
                id={"stats"}
                defaultSize={20}
                ref={stats}
                collapsedSize={0}
                minSize={5}
              >
                <Stats />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
        </ResizablePanelGroup>
      </div>
    </>
  );
}
