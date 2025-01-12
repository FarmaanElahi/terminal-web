"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Screener } from "@/components/screener/table";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Chart } from "@/components/chart/chart";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-2 bg-gradient-to-r from-secondary to-[#E7DCFA]">
        <Tag placeholder={"Search Symbol"} name={"JINDRILL"} />
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30}>
          <Screener />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <Chart chartId={"daff"} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function Tag({ name, placeholder }: { name?: string; placeholder: string }) {
  const value = name || placeholder;
  return (
    <div
      className={cn(
        "inline-flex items-center bg-[#E7E9FB] justify-between text-primary gap-4 rounded px-2 py-1 font-bold text-sm w-32",
        {
          "justify-center": placeholder,
          "justify-between": name,
        },
      )}
    >
      <span>{value}</span>
      {name && (
        <X className="size-4 cursor-pointer hover:rounded" onClick={() => {}} />
      )}
    </div>
  );
}
