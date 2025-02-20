import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const LAYOUT_STORAGE_KEY = "screener-layout-config";

export type ComponentType = "screener" | "chart" | "stats" | "ideas";

export interface LayoutItem {
  id: string;
  type: ComponentType;
  size: number;
  visible?: boolean;
  children?: (LayoutItem | LayoutGroup)[];
}

export interface LayoutGroup {
  id: string;
  direction: "horizontal" | "vertical";
  children: (LayoutItem | LayoutGroup)[];
}

export type LayoutConfig = LayoutGroup;
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const defaultLayout: LayoutConfig = {
  id: "root",
  direction: "horizontal",
  children: [
    { id: "screener-list", type: "screener", size: 20 },
    {
      id: "center-group",
      direction: "vertical",
      children: [
        { id: "chart", type: "chart", size: 70 },
        { id: "stats", type: "stats", size: 30 },
      ],
    },
    { id: "ideas-panel", type: "ideas", size: 20 },
  ],
};

interface LayoutContextType {
  layout: LayoutConfig;
  updateItemVisibility: (itemId: string, visible: boolean) => void;
  updateItemSize: (itemId: string, size: number) => void;
}

function getInitialLayout(): LayoutConfig {
  if (typeof window === "undefined") return defaultLayout;

  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!stored) return defaultLayout;

    const savedLayout = JSON.parse(stored) as LayoutConfig;
    return savedLayout;
  } catch (error) {
    console.error("Failed to parse saved layout:", error);
    return defaultLayout;
  }
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<LayoutConfig>(getInitialLayout);

  const saveLayout = useCallback((newLayout: LayoutConfig) => {
    setLayout(newLayout);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newLayout));
      } catch (error) {
        console.error("Failed to save layout:", error);
      }
    }
  }, []);

  const updateItemVisibility = useCallback(
    (itemId: string, visible: boolean) => {
      const updateVisibility = (item: LayoutItem | LayoutGroup): boolean => {
        if ("type" in item) {
          if (item.id === itemId) {
            item.visible = visible;
            return true;
          }
        }

        if ("children" in item) {
          return (
            item.children?.some((child) => updateVisibility(child)) ?? false
          );
        }
        return false;
      };

      const newLayout = JSON.parse(JSON.stringify(layout));
      if (updateVisibility(newLayout)) {
        saveLayout(newLayout);
      }
    },
    [layout, saveLayout],
  );

  const updateItemSize = useCallback(
    (itemId: string, size: number) => {
      const updateSize = (item: LayoutItem | LayoutGroup): boolean => {
        if ("type" in item) {
          if (item.id === itemId) {
            item.size = size;
            return true;
          }
        }

        if ("children" in item) {
          return item.children?.some((child) => updateSize(child)) ?? false;
        }
        return false;
      };

      const newLayout = JSON.parse(JSON.stringify(layout));
      if (updateSize(newLayout)) {
        saveLayout(newLayout);
      }
    },
    [layout, saveLayout],
  );

  const value = useMemo(
    () => ({
      layout,
      updateItemVisibility,
      updateItemSize,
    }),
    [layout, updateItemVisibility, updateItemSize],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
