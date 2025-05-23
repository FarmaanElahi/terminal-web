import { Chart } from "@/components/chart/chart";
import { SymbolSearch } from "@/components/search/search-command";
import React, { useCallback } from "react";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WidgetControl } from "@/components/dashboard/widget-control";

export function ChartApp({
  updateSettings,
  onRemoveWidget,
  layout,
}: WidgetProps) {
  const defaultLayoutId = layout?.settings?.activeLayoutId as
    | string
    | undefined;

  const groupChanged = useCallback(
    (group: Group) => {
      updateSettings({ ...layout?.settings, group });
    },
    [updateSettings, layout],
  );

  const onLayoutChange = useCallback(
    (id: string) => {
      updateSettings({ ...layout?.settings, activeLayoutId: id });
    },
    [updateSettings, layout],
  );

  return (
    <GrouperProvider
      group={(layout.settings?.group ?? 0) as Group}
      onChange={groupChanged}
    >
      <div className={"h-full flex flex-col"}>
        <WidgetControl layout={layout} onRemove={onRemoveWidget} />
        <div className="flex-1 overflow-hidden">
          <SymbolSearch />
          <Chart layoutId={defaultLayoutId} onLayoutChange={onLayoutChange} />
        </div>
      </div>
    </GrouperProvider>
  );
}
