import React, {
  HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { WidgetSelector } from "./widget-selector";
import { LayoutItem, useDashboard } from "./use-dashboard";
import { WIDGET_SIZES, widgetComponents, WidgetType } from "./widget-registry";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./dashboard-module.css";
import { cn } from "@/lib/utils";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  name: string;
  isAddingWidget: boolean;
  onAddingWidgetChange: (isAdding: boolean) => void;
}

const TOTAL_ROWS = 10; // Number of rows in the grid
export function Dashboard({
  id,
  isAddingWidget,
  onAddingWidgetChange,
  ...props
}: DashboardProps) {
  const {
    layouts,
    isLoading,
    handleLayoutChange,
    addWidget,
    addWidgetWithPlaceholderItem,
    removeWidget,
    updateWidgetSettings,
  } = useDashboard(id);

  const containerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(75); // Default row height for 10
  const [activeDragWidget, setActiveDragWidget] = useState<WidgetType | null>(
    null,
  );

  const onResize = useCallback(() => {
    if (!containerRef.current) return;
    setRowHeight(containerRef.current.clientHeight / TOTAL_ROWS);
  }, [containerRef]);

  useLayoutEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  const handleAddWidget = (type: WidgetType) => {
    if (addWidget(type)) {
      onAddingWidgetChange(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={containerRef} {...props} className={cn("flex-1 relative")}>
      <ResponsiveGridLayout
        style={{ height: "100%" }}
        className="layout hide-all-resize-handles border"
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}
        onLayoutChange={handleLayoutChange}
        isDroppable
        onDrop={(layout, item: LayoutItem) => {
          if (!activeDragWidget) return;
          const relevantWidget = WIDGET_SIZES[activeDragWidget];
          if (!relevantWidget) return;
          addWidgetWithPlaceholderItem(activeDragWidget,item)
          setActiveDragWidget(null);
        }}
        onDropDragOver={() => {
          if (!activeDragWidget) return false;
          const relevantWidget = WIDGET_SIZES[activeDragWidget];
          if (!relevantWidget) return false;
          return { w: relevantWidget.w, h: relevantWidget.h };
        }}
        compactType={null}
        isDraggable
        isResizable
        preventCollision
        allowOverlap
        draggableHandle=".drag-handle"
        margin={[0, 0]}
        resizeHandles={["sw", "nw", "se", "ne"]}
        maxRows={TOTAL_ROWS}
        rowHeight={rowHeight}
      >
        {layouts.map((item) => {
          const Widget = widgetComponents[item.type];
          const { minW, minH } = WIDGET_SIZES[item.type];

          return (
            <div
              key={item.i}
              data-grid={{ ...item, minW, minH }}
              className="border select-none"
            >
              <Widget
                layout={item}
                updateSettings={(s) => updateWidgetSettings(item.i, s)}
                onRemoveWidget={removeWidget}
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>

      <WidgetSelector
        open={isAddingWidget}
        onClose={() => onAddingWidgetChange(false)}
        onSelect={handleAddWidget}
        setActiveDragWidget={setActiveDragWidget}
      />
    </div>
  );
}
