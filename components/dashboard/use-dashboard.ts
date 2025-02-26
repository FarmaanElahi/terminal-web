import { useCallback, useMemo } from "react";
import { Layout } from "react-grid-layout";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { WIDGET_SIZES, WidgetType } from "./widget-registry";

export interface LayoutItem extends Layout {
  type: WidgetType;
}

export function useDashboard(id: string, initialLayout: LayoutItem[]) {
  const [layouts, setLayouts] = useLocalStorage<LayoutItem[]>(
    `dashboard-${id}`,
    initialLayout,
  );

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedLayouts = newLayout.map((item) => {
        const existingWidget = layouts.find((w) => w.i === item.i);
        return {
          ...item,
          type: existingWidget?.type || "screener",
        };
      });
      setLayouts(updatedLayouts);
    },
    [layouts, setLayouts],
  );

  const hasAvailableSpace = useCallback(
    (type: WidgetType) => {
      const { w, h } = WIDGET_SIZES[type];
      const cols = 12;
      const maxHeight = Math.max(...layouts.map((item) => item.y + item.h));

      const occupiedSpaces = new Set<string>();

      layouts.forEach((item) => {
        for (let x = item.x; x < item.x + item.w; x++) {
          for (let y = item.y; y < item.y + item.h; y++) {
            occupiedSpaces.add(`${x},${y}`);
          }
        }
      });

      for (let y = 0; y <= maxHeight + 1; y++) {
        for (let x = 0; x <= cols - w; x++) {
          let canFit = true;
          for (let dx = 0; dx < w; dx++) {
            for (let dy = 0; dy < h; dy++) {
              if (occupiedSpaces.has(`${x + dx},${y + dy}`)) {
                canFit = false;
                break;
              }
            }
            if (!canFit) break;
          }
          if (canFit) return true;
        }
      }

      return false;
    },
    [layouts],
  );

  const findWidgetPosition = useCallback(
    (type: WidgetType) => {
      const { w, h } = WIDGET_SIZES[type];
      const cols = 12;
      const maxHeight = Math.max(...layouts.map((item) => item.y + item.h));

      for (let y = 0; y <= maxHeight + 1; y++) {
        for (let x = 0; x <= cols - w; x++) {
          let canFit = true;
          for (const layout of layouts) {
            if (
              x < layout.x + layout.w &&
              layout.x < x + w &&
              y < layout.y + layout.h &&
              layout.y < y + h
            ) {
              canFit = false;
              break;
            }
          }
          if (canFit) return { x, y };
        }
      }
      return null;
    },
    [layouts],
  );

  const addWidget = useCallback(
    (type: WidgetType) => {
      if (!hasAvailableSpace(type)) {
        toast.error("Not enough space for this widget");
        return false;
      }

      const position = findWidgetPosition(type);
      if (!position) {
        toast.error("Could not find suitable position for widget");
        return false;
      }

      const { w, h } = WIDGET_SIZES[type];
      const newWidget: LayoutItem = {
        i: `widget-${Date.now()}`,
        x: position.x,
        y: position.y,
        w,
        h,
        type,
      };

      setLayouts([...layouts, newWidget]);
      return true;
    },
    [layouts, setLayouts, hasAvailableSpace, findWidgetPosition],
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      setLayouts(layouts.filter((item) => item.i !== widgetId));
    },
    [layouts, setLayouts],
  );

  const availableWidgets = useMemo(() => {
    return Object.keys(WIDGET_SIZES).filter((type) =>
      hasAvailableSpace(type as WidgetType),
    ) as WidgetType[];
  }, [hasAvailableSpace]);

  return {
    layouts,
    availableWidgets,
    handleLayoutChange,
    addWidget,
    removeWidget,
  };
}
