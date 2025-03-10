import React from "react";
import { GrouperProvider } from "@/lib/state/grouper";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WidgetControl } from "@/components/dashboard/widget-control";
import { Ideas } from "@/components/symbols/ideas";

export function IdeasApp({ group, onRemoveWidget, layout }: WidgetProps) {
  return (
    <GrouperProvider group={group}>
      <div className={"h-full flex flex-col"}>
        <WidgetControl layout={layout} onRemove={onRemoveWidget}  className="mt-2"/>
        <div className="flex-1 overflow-hidden">
          <Ideas />
        </div>
      </div>
    </GrouperProvider>
  );
}
