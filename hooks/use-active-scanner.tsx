import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Scanner } from "@/types/supabase";

interface ScannerContextType {
  type: "Watchlist" | "Screener";
  types: Scanner["type"][];
  scannerId: string | null;
  setScannerId: (activeScannerId: string | null) => void;
}

interface ScannerProviderProps {
  type: "Watchlist" | "Screener";
  types: Scanner["type"][];
  children: ReactNode;
  defaultScannerId?: string | null;
  onScannerIdChange?: (scannerId: string | null) => void;
}

const ScannerContext = createContext<ScannerContextType | null>(null);

export function ScannerProvider({
  children,
  defaultScannerId = null,
  onScannerIdChange,
  types,
  type,
}: ScannerProviderProps) {
  const [scannerId, setScannerIdState] = useState<string | null>(
    defaultScannerId,
  );

  // Custom setter that also calls the callback if provided
  const setScannerId = (watchlistId: string | null) => {
    setScannerIdState(watchlistId);
    if (onScannerIdChange) {
      onScannerIdChange(watchlistId);
    }
  };

  // Update state if defaultActiveWatchlistId changes (e.g., when dashboard settings are loaded)
  useEffect(() => {
    if (defaultScannerId !== undefined && defaultScannerId !== scannerId) {
      setScannerId(defaultScannerId);
    }
  }, [defaultScannerId]);

  return (
    <ScannerContext.Provider value={{ scannerId, setScannerId, types, type }}>
      {children}
    </ScannerContext.Provider>
  );
}

export function useCurrentScanner() {
  const value = useContext(ScannerContext);
  if (!value) {
    throw new Error("WatchlistContext not configured");
  }
  return value;
}
