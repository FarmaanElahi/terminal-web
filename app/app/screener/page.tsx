"use client";

import { X } from "lucide-react";
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

export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <div>
            <Tag placeholder={"Search Symbol"} name={"JINDRILL"} />
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
    <Button variant="outline" className="font-bold justify-between">
      {value}
      <X className="size-4" />
    </Button>
  );
}
