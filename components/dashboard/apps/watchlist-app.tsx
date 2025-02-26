import { Screener } from "@/components/screener/screener";
import { WatchlistProvider } from "@/hooks/use-active-watchlist";
import { Watchlist } from "@/components/watchlist/watchlist";

export function WatchlistApp() {
  return (
    <WatchlistProvider>
      <Watchlist />
      <Screener />
    </WatchlistProvider>
  );
}
