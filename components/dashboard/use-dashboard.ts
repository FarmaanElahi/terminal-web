import { useCallback, useMemo } from "react";
import { Layout } from "react-grid-layout";
import { toast } from "sonner";
import { WIDGET_SIZES, WidgetType } from "./widget-registry";
import { useDashboardData, useUpdatedDashboard } from "@/lib/state/symbol";
import { Json } from "@/types/generated/supabase";

export type WidgetSettings = Record<string, unknown>;

export interface LayoutItem extends Layout {
  type: WidgetType;
  settings?: WidgetSettings;
}

export function useDashboard(id: string) {
  const { data: dashboardData, isLoading } = useDashboardData(id);
  const { mutate: updateDashboard } = useUpdatedDashboard();

  // Get the stored layout or handle loading state
  const layouts = useMemo(
    () => (dashboardData?.layout as unknown as LayoutItem[]) ?? [],
    [dashboardData?.layout],
  );

  const saveDashboard = useCallback(
    async (newLayouts: LayoutItem[]) => {
      updateDashboard({
        id,
        payload: { layout: newLayouts as unknown as Json },
      });
    },
    [id, updateDashboard],
  );

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedLayouts = newLayout
        .map((item) => {
          const existingWidget = layouts.find((w) => w.i === item.i);
          if (!existingWidget?.type) return null;
          return {
            ...item,
            type: existingWidget?.type || "screener",
            settings: existingWidget?.settings || {},
          };
        })
        .filter((value) => value)
        .map((value) => value!);

      // Save to the database
      console.log("Handle layout", updatedLayouts, newLayout);
      void saveDashboard(updatedLayouts);
    },
    [layouts, saveDashboard],
  );

  const updateWidgetSettings = useCallback(
    (widgetId: string, settings: WidgetSettings) => {
      const updatedLayouts = layouts.map((item) => {
        if (item.i === widgetId) {
          return { ...item, settings: { ...item.settings, ...settings } };
        }
        return item;
      });

      // Save to the database
      void saveDashboard(updatedLayouts);
    },
    [layouts, saveDashboard],
  );

  const hasAvailableSpace = useCallback(
    (type: WidgetType) => {
      const { w, h } = WIDGET_SIZES[type];
      const cols = 12;
      const maxHeight = Math.max(...layouts.map((item) => item.y + item.h), 0);

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
      const maxHeight = Math.max(...layouts.map((item) => item.y + item.h), 0);

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
    (type: WidgetType, initialSettings?: WidgetSettings) => {
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
        settings: initialSettings || {},
      };

      const updatedLayouts = [...layouts, newWidget];

      void saveDashboard(updatedLayouts);
      return true;
    },
    [layouts, hasAvailableSpace, findWidgetPosition, saveDashboard],
  );

  const addWidgetWithPlaceholderItem = useCallback(
    (type: WidgetType, item: LayoutItem, initialSettings?: WidgetSettings) => {
      const newWidget: LayoutItem = {
        ...item,
        i: `widget-${Date.now()}`,
        type,
        settings: initialSettings || {},
      };
      const updatedLayouts = [...layouts, newWidget];
      void saveDashboard(updatedLayouts);
      return true;
    },
    [layouts, saveDashboard],
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      const updatedLayouts = layouts.filter((item) => item.i !== widgetId);
      void saveDashboard(updatedLayouts);
    },
    [layouts, saveDashboard],
  );

  const availableWidgets = useMemo(() => {
    return Object.keys(WIDGET_SIZES).filter((type) =>
      hasAvailableSpace(type as WidgetType),
    ) as WidgetType[];
  }, [hasAvailableSpace]);

  return {
    layouts,
    availableWidgets,
    isLoading,
    handleLayoutChange,
    addWidget,
    addWidgetWithPlaceholderItem,
    removeWidget,
    updateWidgetSettings,
  };
}
