import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { GridState } from "ag-grid-community";
import { type Symbol } from "@/types/symbol";

const defaultVisible = new Set<keyof Symbol>([
  "name",
  "mcap",
  "day_close",
  "price_change_today_pct",
]);

interface ScreenerContextType {
  activeScreenId: string | null;
  setActiveScreenId: (activeScreen: string | null) => void;
  enableFilter?: boolean;
  defaultColumns: Set<keyof Symbol>;
  defaultSort?: GridState["sort"];
}

interface ScreenerProviderProps {
  children: ReactNode;
  defaultActiveScreenId?: string | null;
  onActiveScreenIdChange?: (screenerId: string | null) => void;
  enableFilter?: boolean;
  defaultColumns?: Set<keyof Symbol>;
  defaultSort?: GridState["sort"];
}

const ScreenerContext = createContext<ScreenerContextType | null>(null);

export function ScreenerProvider({
  children,
  defaultActiveScreenId = null,
  onActiveScreenIdChange,
  enableFilter,
  defaultSort,
  defaultColumns,
}: ScreenerProviderProps) {
  const [activeScreenId, setActiveScreenIdState] = useState<string | null>(
    defaultActiveScreenId,
  );

  // Custom setter that also calls the callback if provided
  const setActiveScreenId = (screenerId: string | null) => {
    setActiveScreenIdState(screenerId);
    if (onActiveScreenIdChange) {
      onActiveScreenIdChange(screenerId);
    }
  };

  // Update state if defaultActiveScreenId changes (e.g., when dashboard settings are loaded)
  useEffect(() => {
    if (
      defaultActiveScreenId !== undefined &&
      defaultActiveScreenId !== activeScreenId
    ) {
      setActiveScreenIdState(defaultActiveScreenId);
    }
  }, [defaultActiveScreenId, activeScreenId]);

  return (
    <ScreenerContext.Provider
      value={{
        activeScreenId,
        setActiveScreenId,
        enableFilter,
        defaultColumns: defaultColumns ?? defaultVisible,
        defaultSort,
      }}
    >
      {children}
    </ScreenerContext.Provider>
  );
}

export function useActiveScreenerId() {
  const value = useContext(ScreenerContext);
  if (!value) {
    throw new Error("ScreenerContext not configured");
  }
  return value;
}
