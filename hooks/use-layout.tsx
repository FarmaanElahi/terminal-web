import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<LayoutConfig>(defaultLayout);

  useEffect(() => {
    // Load initial layout from localStorage
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!stored) return;

    try {
      const savedLayout = JSON.parse(stored) as LayoutConfig;
      setLayout(savedLayout);
    } catch {
      console.error("Failed to parse saved layout");
    }
  }, []);

  const saveLayout = useCallback((newLayout: LayoutConfig) => {
    setLayout(newLayout);
    if (typeof window !== "undefined") {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newLayout));
    }
  }, []);

  const updateItemVisibility = useCallback(
    (itemId: string, visible: boolean) => {
      const updateVisibility = (layout: LayoutItem): boolean => {
        if (layout.id === itemId) {
          layout.visible = visible;
          return true;
        }
        if (layout.children) {
          return layout.children.some((child) =>
            updateVisibility(child as LayoutItem),
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
      const updateSize = (layout: LayoutItem): boolean => {
        if (layout.id === itemId) {
          layout.size = size;
          return true;
        }
        if (layout.children) {
          return layout.children.some((child) =>
            updateSize(child as LayoutItem),
          );
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

  return (
    <LayoutContext.Provider
      value={{ layout, updateItemVisibility, updateItemSize }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
