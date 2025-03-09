import { useCallback, useMemo } from "react";
import { Layout } from "react-grid-layout";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { WIDGET_SIZES, WidgetType } from "./widget-registry";
import { useDashboardData, useUpdatedDashboard } from "@/lib/state/symbol";
import { Json } from "@/types/generated/supabase";
import { Dashboard } from "@/types/supabase";

export type WidgetSettings = Record<string, unknown>;

export interface LayoutItem extends Layout {
  type: WidgetType;
  settings?: WidgetSettings;
}

export function useDashboard(id: string, initialLayout: LayoutItem[]) {
  const { data: dashboardData, isLoading } = useDashboardData(id);
  const { mutate: updateDashboard } = useUpdatedDashboard();
  const queryClient = useQueryClient();

  // Get the stored layout or fall back to initial layout
  const layouts = useMemo(() => {
    if (dashboardData?.layout) {
      try {
        return (dashboardData.layout ?? []) as unknown as LayoutItem[];
      } catch (err) {
        console.error("Error parsing dashboard layout:", err);
        toast.error("Failed to parse dashboard layout");
        return initialLayout;
      }
    }
    return initialLayout;
  }, [dashboardData, initialLayout]);

  const saveDashboard = useCallback(
    async (newLayouts: LayoutItem[]) => {
      try {
        updateDashboard({
          id,
          payload: { layout: newLayouts as unknown as Json },
        });
      } catch (error) {
        console.error("Error saving dashboard layout:", error);
        toast.error("Failed to save dashboard layout");
      }
    },
    [id, updateDashboard],
  );

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedLayouts = newLayout.map((item) => {
        const existingWidget = layouts.find((w) => w.i === item.i);
        return {
          ...item,
          type: existingWidget?.type || "screener",
          settings: existingWidget?.settings || {},
        };
      });

      // Update the cached data optimistically
      queryClient.setQueryData(["dashboard", id], (old: Dashboard) => {
        if (!old) return old;
        return { ...old, layout: updatedLayouts as Json };
      });

      // Save to the database
      saveDashboard(updatedLayouts);
    },
    [layouts, saveDashboard, queryClient, id],
  );

  const updateWidgetSettings = useCallback(
    (widgetId: string, settings: WidgetSettings) => {
      const updatedLayouts = layouts.map((item) => {
        if (item.i === widgetId) {
          return {
            ...item,
            settings: {
              ...item.settings,
              ...settings,
            },
          };
        }
        return item;
      });

      // Update the cached data optimistically
      queryClient.setQueryData(["dashboard", id], (old: Dashboard) => {
        if (!old) return old;
        return { ...old, layout: updatedLayouts };
      });

      // Save to the database
      void saveDashboard(updatedLayouts);
    },
    [layouts, saveDashboard, queryClient, id],
  );

  const hasAvailableSpace = useCallback(
    (type: WidgetType) => {
      console.log(typeof layouts, "type");
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

      // Update the cached data optimistically
      queryClient.setQueryData(["dashboard", id], (old: Dashboard) => {
        if (!old) return old;
        return { ...old, layout: updatedLayouts };
      });

      saveDashboard(updatedLayouts);
      return true;
    },
    [
      layouts,
      hasAvailableSpace,
      findWidgetPosition,
      saveDashboard,
      queryClient,
      id,
    ],
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      const updatedLayouts = layouts.filter((item) => item.i !== widgetId);

      // Update the cached data optimistically
      queryClient.setQueryData(["dashboard", id], (old: Dashboard) => {
        if (!old) return old;
        return { ...old, layout: updatedLayouts as unknown as Json };
      });

      void saveDashboard(updatedLayouts);
    },
    [layouts, saveDashboard, queryClient, id],
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
    removeWidget,
    updateWidgetSettings,
  };
}
