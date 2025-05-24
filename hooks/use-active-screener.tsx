import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ScreenerContextType {
  activeScreenId: string | null;
  setActiveScreenId: (activeScreen: string | null) => void;
}

interface ScreenerProviderProps {
  children: ReactNode;
  defaultActiveScreenId?: string | null;
  onActiveScreenIdChange?: (screenerId: string | null) => void;
}

const ScreenerContext = createContext<ScreenerContextType | null>(null);

export function ScreenerProvider({
  children,
  defaultActiveScreenId = null,
  onActiveScreenIdChange,
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
