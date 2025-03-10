import React from "react";
import { GrouperProvider } from "@/lib/state/grouper";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WidgetControl } from "@/components/dashboard/widget-control";
import { Stats } from "@/components/symbols/stats";

export function StatsApp({ group, onRemoveWidget, layout }: WidgetProps) {
  return (
    <GrouperProvider group={group}>
      <div className={"h-full flex flex-col"}>
        <WidgetControl layout={layout} onRemove={onRemoveWidget} />
        <div className="flex-1 overflow-hidden">
          <Stats />
        </div>
      </div>
    </GrouperProvider>
  );
}
