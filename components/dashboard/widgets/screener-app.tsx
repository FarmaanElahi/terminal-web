import { ScreenerProvider } from "@/hooks/use-active-screener";
import { Screener } from "@/components/screener/screener";
import { ScreenSelector } from "@/components/screener/screen-selector";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { Group, GrouperProvider, useGroupFilter } from "@/lib/state/grouper";
import { useCallback } from "react";
import { WidgetControl } from "@/components/dashboard/widget-control";
import { GroupInfo } from "@/components/symbols/group";

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
      <AppChild
        layout={layout}
        updateSettings={updateSettings}
        onRemoveWidget={onRemoveWidget}
        defaultActiveScreenId={defaultActiveScreenId}
        screenChanged={screenChanged}
      />
    </GrouperProvider>
  );
}

function AppChild({
  layout,
  onRemoveWidget,
  defaultActiveScreenId,
  screenChanged,
}: WidgetProps & {
  defaultActiveScreenId?: string;
  screenChanged: (id: string | null) => void;
}) {
  const filter = useGroupFilter();

  return (
    <ScreenerProvider
      defaultActiveScreenId={filter ? undefined : defaultActiveScreenId}
      onActiveScreenIdChange={screenChanged}
    >
      <div className={"h-full flex flex-col"}>
        <WidgetControl
          layout={layout}
          onRemove={onRemoveWidget}
          className={"m-2"}
        >
          <div className="flex gap-2">
            {filter && <GroupInfo />}
            {!filter && <ScreenSelector />}
          </div>
        </WidgetControl>
        <Screener className="flex-1" />
      </div>
    </ScreenerProvider>
  );
}
