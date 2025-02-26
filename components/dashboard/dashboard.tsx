// components/dashboard/dashboard.tsx
import React, { useCallback, useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Stats } from "../symbols/stats";
import { Ideas } from "../symbols/ideas";
import { Button } from "../ui/button";
import { Grip, Plus, X } from "lucide-react";
import { WidgetSelector } from "./widget-selector";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScreenerApp } from "@/components/dashboard/apps/screener-app";
import { WatchlistApp } from "@/components/dashboard/apps/watchlist-app";
import { ChartApp } from "@/components/dashboard/apps/chart-app";

const ResponsiveGridLayout = WidthProvider(Responsive);

export type WidgetType = 'screener' | 'watchlist' | 'stats' | 'ideas' | 'chart';

interface LayoutItem extends Layout {
  type: WidgetType;
}

interface DashboardProps {
  id: string;
  name: string;
}

const widgetComponents: Record<WidgetType, React.ComponentType> = {
  screener: ScreenerApp,
  watchlist: WatchlistApp,
  stats: Stats,
  ideas: Ideas,
  chart: ChartApp,
};

// Add some CSS for the widget controls
const widgetStyles = `
  .widget-controls {
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .react-grid-item:hover .widget-controls {
    opacity: 1;
  }
  
  .drag-handle {
    cursor: move;
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 10;
    padding: 4px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
  }
  
  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    padding: 4px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
  }
  
  .close-button:hover, .drag-handle:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export function Dashboard({ id, name }: DashboardProps) {
  const [layouts, setLayouts] = useLocalStorage<LayoutItem[]>(`dashboard-${id}`, []);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  // Add the styles to the document
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = widgetStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    const updatedLayouts = newLayout.map(item => {
      const existingWidget = layouts.find(w => w.i === item.i);
      return {
        ...item,
        type: existingWidget?.type || 'screener',
      };
    });
    setLayouts(updatedLayouts);
  }, [layouts, setLayouts]);

  const handleAddWidget = useCallback((type: WidgetType) => {
    const defaultSizes = {
      chart: { w: 8, h: 6 },
      watchlist: { w: 4, h: 6 },
      screener: { w: 6, h: 6 },
      stats: { w: 6, h: 4 },
      ideas: { w: 6, h: 4 },
    };

    const { w, h } = defaultSizes[type];

    const newWidget: LayoutItem = {
      i: `widget-${Date.now()}`,
      x: (layouts.length * 2) % 12,
      y: Infinity,
      w,
      h,
      type,
    };

    setLayouts([...layouts, newWidget]);
    setIsAddingWidget(false);
  }, [layouts, setLayouts]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setLayouts(layouts.filter(item => item.i !== widgetId));
  }, [layouts, setLayouts]);

  return (
    <div className="h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        <Button onClick={() => setIsAddingWidget(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        draggableHandle=".drag-handle"
      >
        {layouts.map((item) => {
          const Widget = widgetComponents[item.type];
          return (
            <div key={item.i} className="relative">
              <div className="h-full w-full overflow-hidden rounded-lg border bg-card">
                {/* Widget Controls */}
                <div className="widget-controls">
                  <div className="drag-handle">
                    <Grip className="h-4 w-4" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="close-button"
                    onClick={() => handleRemoveWidget(item.i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Widget Content */}
                <div className="h-full w-full">
                  <Widget />
                </div>
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>

      <WidgetSelector
        open={isAddingWidget}
        onClose={() => setIsAddingWidget(false)}
        onSelect={handleAddWidget}
      />
    </div>
  );
}