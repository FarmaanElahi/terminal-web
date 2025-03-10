import React, { useCallback } from "react";
import { WatchlistProvider } from "@/hooks/use-active-watchlist";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WatchlistSelector } from "@/components/watchlist/watchlist-selector";
import { Watchlist } from "@/components/watchlist/watchlist";
import { Group, GrouperProvider } from "@/lib/state/grouper";
import { WidgetControl } from "@/components/dashboard/widget-control";

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
      <WatchlistProvider
        defaultActiveWatchlistId={defaultActiveWatchlistId}
        onActiveWatchlistIdChange={watchlistChanged}
      >
        <div className={"h-full flex flex-col"}>
          <WidgetControl
            layout={layout}
            onRemove={onRemoveWidget}
            className={"m-2"}
          >
            <WatchlistSelector />
          </WidgetControl>
          <Watchlist className="flex-1" />
        </div>
      </WatchlistProvider>
    </GrouperProvider>
  );
}
