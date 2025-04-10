import { ScreenerProvider } from "@/hooks/use-active-screener";
import { Screener } from "@/components/screener/screener";
import { ScreenSelector } from "@/components/screener/screen-selector";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import { useCallback } from "react";
import { WidgetControl } from "@/components/dashboard/widget-control";

export function ScreenerApp({
  updateSettings,
  layout,
  onRemoveWidget,
}: WidgetProps) {
  const defaultActiveScreenId = layout?.settings?.activeScreenId as
    | string
    | undefined;

  const screenChanged = useCallback(
    (screenerId: string | null) => {
      updateSettings({ ...layout?.settings, activeScreenId: screenerId });
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
      <ScreenerProvider
        defaultActiveScreenId={defaultActiveScreenId}
        onActiveScreenIdChange={screenChanged}
      >
        <div className={"h-full flex flex-col"}>
          <WidgetControl
            layout={layout}
            onRemove={onRemoveWidget}
            className={"m-2"}
          >
            <ScreenSelector />
          </WidgetControl>
          <Screener className="flex-1" />
        </div>
      </ScreenerProvider>
    </GrouperProvider>
  );
}
