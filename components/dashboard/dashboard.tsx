import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { WidgetSelector } from "./widget-selector";
import { useDashboard } from "./use-dashboard";
import { WIDGET_SIZES, widgetComponents, WidgetType } from "./widget-registry";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./dashboard-module.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  id: string;
  name: string;
  isAddingWidget: boolean;
  onAddingWidgetChange: (isAdding: boolean) => void;
}

export function Dashboard({
  id,
  isAddingWidget,
  onAddingWidgetChange,
}: DashboardProps) {
  const {
    layouts,
    isLoading,
    handleLayoutChange,
    addWidget,
    removeWidget,
    updateWidgetSettings,
  } = useDashboard(id);

  const handleAddWidget = (type: WidgetType) => {
    if (addWidget(type)) {
      onAddingWidgetChange(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(layouts);

  return (
    <div className="h-full w-full">
      <ResponsiveGridLayout
        className="layout hide-all-resize-handles"
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={50}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        draggableHandle=".drag-handle"
        margin={[0, 0]}
        resizeHandles={["sw", "nw", "se", "ne"]}
      >
        {layouts.map((item) => {
          const Widget = widgetComponents[item.type];
          const { minW, minH } = WIDGET_SIZES[item.type];

          return (
            <div
              key={item.i}
              data-grid={{ ...item, minW, minH }}
              className="border"
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
      />
    </div>
  );
}
