import React, { useCallback } from "react";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WidgetControl } from "@/components/dashboard/widget-control";
import { DataPanel } from "@/components/data-panel/data-panel";
import { DataPanelProvider } from "@/hooks/use-active-data-panel";
import { DataPanelSelector } from "@/components/data-panel/data-panel-selector";

export function DataPanelApp({
  onRemoveWidget,
  layout,
  updateSettings,
}: WidgetProps) {
  const defaultActiveDataPanelId = layout?.settings?.activeDataPanelId as
    | string
    | undefined;

  const dataPanelChanged = useCallback(
    (dataPanelId: string | null) => {
      updateSettings({ ...layout?.settings, activeDataPanelId: dataPanelId });
    },
    [updateSettings, layout],
  );

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
      <DataPanelProvider
        defaultActiveDataPanelId={defaultActiveDataPanelId}
        onActiveDataPanelIdChange={dataPanelChanged}
      >
        <div className={"h-full flex flex-col"}>
          <WidgetControl
            layout={layout}
            onRemove={onRemoveWidget}
            className={"m-2"}
          >
            <DataPanelSelector />
          </WidgetControl>
          <DataPanel className="flex-1" />
        </div>
      </DataPanelProvider>
    </GrouperProvider>
  );
}
