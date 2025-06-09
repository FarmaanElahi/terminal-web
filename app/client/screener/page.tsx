"use client";

import { ChartSpline, Grid3X3, Lightbulb, List, Table } from "lucide-react";
import React, { useRef } from "react";
import { GrouperProvider, GroupSymbolProvider } from "@/lib/state/grouper";
import { Toggle } from "@/components/ui/toggle";
import { SymbolSearch } from "@/components/search/search-command";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Chart } from "@/components/chart/chart";
import { Stats } from "@/components/symbols/stats";
import { Ideas } from "@/components/symbols/ideas";
import "@/components/grid/grid_init";
import { ImperativePanelHandle } from "react-resizable-panels";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GroupInfo } from "@/components/symbols/group";
import { ScannerProvider } from "@/hooks/use-active-scanner";
import { ScannerSelector } from "@/components/scanner/scanner-selector";
import { ScannerList } from "@/components/scanner/scanner-list";

export default function Page() {
  return (
    <GroupSymbolProvider>
      <GrouperProvider group={1}>
        <ScannerProvider type={"Screener"} types={["screener"]}>
          <ScreenerContent />
        </ScannerProvider>
      </GrouperProvider>
    </GroupSymbolProvider>
  );
}

function ScreenerContent() {
  const screener = useRef<ImperativePanelHandle | null>(null);
  const ideas = useRef<ImperativePanelHandle | null>(null);
  const stats = useRef<ImperativePanelHandle | null>(null);
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2">
        <SymbolSearch />
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex gap-2">
            <SidebarTrigger className="my-auto" />
            <GroupInfo placeholder={"Search Symbol"} name={"NIFTY"} />
            <ScannerSelector />
          </div>
          <div className="flex space-x-4 pr-2">
            <div className="space-x-2">
              <Toggle
                size="sm"
                aria-label={"Screener"}
                pressed={true}
                onPressedChange={() =>
                  screener.current?.isExpanded()
                    ? screener.current?.collapse()
                    : screener.current?.expand()
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
              <Toggle
                size="sm"
                aria-label={"Ideas"}
                pressed={true}
                onPressedChange={() =>
                  ideas.current?.isExpanded()
                    ? ideas.current?.collapse()
                    : ideas.current?.expand()
                }
              >
                <Lightbulb className="size-4" />
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
      <div className="flex-1 overflow-auto">
        <ResizablePanelGroup
          autoSaveId={"screener-main"}
          direction={"horizontal"}
          className={"transition"}
        >
          <ResizablePanel
            ref={screener}
            collapsible
            collapsedSize={0}
            id={"screener"}
            defaultSize={20}
            minSize={5}
            className={"transition"}
          >
            <ScannerList />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel collapsible id={"screener-center"}>
            <ResizablePanelGroup
              direction={"vertical"}
              autoSaveId={"screener-center"}
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
          <ResizablePanel
            collapsible
            id={"ideas"}
            defaultSize={20}
            ref={ideas}
            collapsedSize={0}
            minSize={5}
          >
            <Ideas />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
