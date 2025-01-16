"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GrouperProvider, GroupSymbolProvider } from "@/lib/state/grouper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Screener } from "@/components/screener/screener";
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/chart/chart";

export default function Page() {
  return (
    <SidebarProvider className="h-full">
      <AppSidebar />
      <SidebarInset className="border-2 overflow-auto">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <Tag placeholder={"Search Symbol"} name={"JINDRILL"} />
            </div>
          </div>
        </header>
        <div className="flex-1  overflow-auto">
          <GroupSymbolProvider>
            <GrouperProvider group={1}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                  defaultSize={30}
                  className={"border border-green-400 h-full"}
                >
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
      </SidebarInset>
    </SidebarProvider>
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
