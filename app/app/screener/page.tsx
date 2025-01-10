"use client";

import { Chart } from "@/components/chart/chart";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="h-full m-1 rounded overflow-hidden">
      <div className="bg-gradient-to-r from-primary/40 to-[#E6DBFC] px-2 py-2">
        <Tag placeholder={"Search Symbol"} name={"JINDRILL"} />
      </div>
      <Chart chartId={"12rwe"} />
    </div>
  );
}

function Tag({ name, placeholder }: { name?: string; placeholder: string }) {
  const value = name || placeholder;
  return (
    <div
      className={cn(
        "inline-flex items-center bg-secondary justify-between text-secondary-foreground gap-4 rounded px-2 py-1 font-bold text-sm w-32",
        {
          "justify-center": placeholder,
          "justify-between": name,
        },
      )}
    >
      <span>{value}</span>
      {name && <X className="size-4 cursor-pointer hover:rounded" onClick={() => {}} />}
    </div>
  );
}
