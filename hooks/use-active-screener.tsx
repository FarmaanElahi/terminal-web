import { createContext, ReactNode, useContext, useState } from "react";

interface ScreenerContextType {
  activeScreenId?: string | null;
  setActiveScreenId: (activeScreen: string | null) => void;
}

const ScreenerContext = createContext<ScreenerContextType | null>(null);

export function ScreenerProvider({ children }: { children: ReactNode }) {
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  return (
    <ScreenerContext.Provider value={{ activeScreenId, setActiveScreenId }}>
      {children}
    </ScreenerContext.Provider>
  );
}

export function useActiveScreener() {
  const value = useContext(ScreenerContext);
  if (!value) {
    throw new Error("ScreenerContext not configured");
  }
  return value;
}
