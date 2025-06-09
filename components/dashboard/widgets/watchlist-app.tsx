import React, { useCallback } from "react";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { ScannerSelector } from "@/components/scanner/scanner-selector";
import { ScannerList } from "@/components/scanner/scanner-list";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import { WidgetControl } from "@/components/dashboard/widget-control";
import { ScannerProvider } from "@/hooks/use-active-scanner";

export function WatchlistApp({
  layout,
  onRemoveWidget,
  updateSettings,
}: WidgetProps) {
  const defaultActiveWatchlistId = layout?.settings?.activeWatchlistId as
    | string
    | undefined;

  const watchlistChanged = useCallback(
    (watchlistId: string | null) => {
      updateSettings({ ...layout?.settings, activeWatchlistId: watchlistId });
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
      <ScannerProvider
        defaultScannerId={defaultActiveWatchlistId}
        onScannerIdChange={watchlistChanged}
        types={["combo", "simple"]}
        type={"Watchlist"}
      >
        <div className={"h-full flex flex-col"}>
          <WidgetControl
            layout={layout}
            onRemove={onRemoveWidget}
            className={"m-2"}
          >
            <ScannerSelector />
          </WidgetControl>
          <ScannerList className="flex-1" />
        </div>
      </ScannerProvider>
    </GrouperProvider>
  );
}
