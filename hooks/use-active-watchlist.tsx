import { createContext, ReactNode, useContext, useState } from "react";

interface WatchlistContextType {
  activeWatchlistId?: string | null;
  setActiveWatchlistId: (activeScreen: string | null) => void;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | null>(
    null,
  );
  return (
    <WatchlistContext.Provider
      value={{ activeWatchlistId, setActiveWatchlistId }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useActiveWatchlistId() {
  const value = useContext(WatchlistContext);
  if (!value) {
    throw new Error("WatchlistContext not configured");
  }
  return value;
}
