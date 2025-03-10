import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface WatchlistContextType {
  activeWatchlistId: string | null;
  setActiveWatchlistId: (activeWatchlist: string | null) => void;
}

interface WatchlistProviderProps {
  children: ReactNode;
  defaultActiveWatchlistId?: string | null;
  onActiveWatchlistIdChange?: (watchlistId: string | null) => void;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({
  children,
  defaultActiveWatchlistId = null,
  onActiveWatchlistIdChange,
}: WatchlistProviderProps) {
  const [activeWatchlistId, setActiveWatchlistIdState] = useState<
    string | null
  >(defaultActiveWatchlistId);

  // Custom setter that also calls the callback if provided
  const setActiveWatchlistId = (watchlistId: string | null) => {
    setActiveWatchlistIdState(watchlistId);
    if (onActiveWatchlistIdChange) {
      onActiveWatchlistIdChange(watchlistId);
    }
  };

  // Update state if defaultActiveWatchlistId changes (e.g., when dashboard settings are loaded)
  useEffect(() => {
    if (
      defaultActiveWatchlistId !== undefined &&
      defaultActiveWatchlistId !== activeWatchlistId
    ) {
      setActiveWatchlistIdState(defaultActiveWatchlistId);
    }
  }, [defaultActiveWatchlistId]);

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
