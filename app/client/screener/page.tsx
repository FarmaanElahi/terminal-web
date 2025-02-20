"use client";

import { ChartSpline, Grid3X3, Lightbulb, List, Table, X } from "lucide-react";
import React from "react";
import {
  GrouperProvider,
  GroupSymbolProvider,
  useGroupSymbol,
} from "@/lib/state/grouper";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { SymbolSearch } from "@/components/search/search-command";
import { ScreenSelector } from "@/components/screener/screen-selector";
import { PersistentLayout } from "@/components/ui/persistent-layout";
import { LayoutProvider, useLayout } from "@/hooks/use-layout";
import { ScreenerProvider } from "@/hooks/use-active-screener";

export default function Page() {
  return (
    <GroupSymbolProvider>
      <GrouperProvider group={1}>
        <LayoutProvider>
          <ScreenerProvider>
            <ScreenerContent />
          </ScreenerProvider>
        </LayoutProvider>
      </GrouperProvider>
    </GroupSymbolProvider>
  );
}

function ScreenerContent() {
  const { updateItemVisibility } = useLayout();

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2">
        <SymbolSearch />
        <div className="flex items-center justify-between gap-2 px-4 w-full">
          <div className="flex gap-2">
            <Tag placeholder={"Search Symbol"} name={"JINDRILL"} />
            <ScreenSelector />
          </div>
          <div className="flex space-x-4">
            <div className="space-x-2">
              <Toggle
                size="sm"
                aria-label={"Screener"}
                onPressedChange={(pressed) =>
                  updateItemVisibility("screener", pressed)
                }
                pressed={true}
              >
                <Table className="size-4" />
              </Toggle>

              <Toggle
                size="sm"
                aria-label={"Stats"}
                onPressedChange={(pressed) =>
                  updateItemVisibility("stats", pressed)
                }
                pressed={true}
              >
                <ChartSpline className="size-4" />
              </Toggle>
              <Toggle
                size="sm"
                aria-label={"Ideas"}
                pressed={true}
                onPressedChange={(pressed) =>
                  updateItemVisibility("ideas", pressed)
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
        <PersistentLayout />
      </div>
    </>
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
