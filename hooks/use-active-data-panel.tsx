import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface DataPanelContextType {
  activeDataPanelId: string | null;
  setActiveDataPanelId: (activeDataPanel: string | null) => void;
}

interface DataPanelProviderProps {
  children: ReactNode;
  defaultActiveDataPanelId?: string | null;
  onActiveDataPanelIdChange?: (DataPanelId: string | null) => void;
}

const DataPanelContext = createContext<DataPanelContextType | null>(null);

export function DataPanelProvider({
  children,
  defaultActiveDataPanelId = null,
  onActiveDataPanelIdChange,
}: DataPanelProviderProps) {
  const [activeDataPanelId, setActiveDataPanelIdState] = useState<
    string | null
  >(defaultActiveDataPanelId);

  // Custom setter that also calls the callback if provided
  const setActiveDataPanelId = (DataPanelId: string | null) => {
    setActiveDataPanelIdState(DataPanelId);
    if (onActiveDataPanelIdChange) {
      onActiveDataPanelIdChange(DataPanelId);
    }
  };

  // Update state if defaultActiveDataPanelId changes (e.g., when dashboard settings are loaded)
  useEffect(() => {
    if (
      defaultActiveDataPanelId !== undefined &&
      defaultActiveDataPanelId !== activeDataPanelId
    ) {
      setActiveDataPanelIdState(defaultActiveDataPanelId);
    }
  }, [defaultActiveDataPanelId]);

  return (
    <DataPanelContext.Provider
      value={{ activeDataPanelId, setActiveDataPanelId }}
    >
      {children}
    </DataPanelContext.Provider>
  );
}

export function useActiveDataPanelId() {
  const value = useContext(DataPanelContext);
  if (!value) {
    throw new Error("DataPanelContext not configured");
  }
  return value;
}
