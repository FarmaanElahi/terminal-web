import React, { useCallback } from "react";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WidgetControl } from "@/components/dashboard/widget-control";
import { Ideas } from "@/components/symbols/ideas";

export function IdeasApp({
  onRemoveWidget,
  layout,
  updateSettings,
}: WidgetProps) {
  const groupChanged = useCallback(
    (group: Group) => {
      updateSettings({ ...layout?.settings, group });
    },
    [updateSettings, layout],
  );

  return (
    <GrouperProvider
      group={(layout.settings?.group ?? 0) as Group}
      onChange={groupChanged}
    >
      <div className={"h-full flex flex-col"}>
        <WidgetControl
          layout={layout}
          onRemove={onRemoveWidget}
          className="mt-2"
        />
        <div className="flex-1 overflow-hidden">
          <Ideas />
        </div>
      </div>
    </GrouperProvider>
  );
}
