import React from "react";
import { WatchlistProvider } from "@/hooks/use-active-watchlist";
import type { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { WatchlistSelector } from "@/components/watchlist/watchlist-selector";
import { Watchlist } from "@/components/watchlist/watchlist";

// Define the shape of the settings we'll store in the dashboard
interface WatchlistSettings {
  activeWatchlistId: string | null;
}

export function WatchlistApp(props: WidgetProps) {
  // Get settings from dashboard or use default
  const settings = props.layout?.settings as WatchlistSettings | undefined;
  const defaultActiveWatchlistId = settings?.activeWatchlistId || null;

  // Handle when the active watchlist changes
  const handleActiveWatchlistChange = (watchlistId: string | null) => {
    props.updateSettings({ activeWatchlistId: watchlistId });
  };

  return (
    <WatchlistProvider
      defaultActiveWatchlistId={defaultActiveWatchlistId}
      onActiveWatchlistIdChange={handleActiveWatchlistChange}
    >
      <WatchlistSelector />
      <Watchlist />
    </WatchlistProvider>
  );
}
