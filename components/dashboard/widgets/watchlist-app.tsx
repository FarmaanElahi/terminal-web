import { WatchlistProvider } from "@/hooks/use-active-watchlist";
import { Watchlist } from "@/components/watchlist/watchlist";
import { WatchlistSelector } from "@/components/watchlist/watchlist-selector";

export function WatchlistApp() {
  return (
    <WatchlistProvider>
      <WatchlistSelector />
      <Watchlist />
    </WatchlistProvider>
  );
}
