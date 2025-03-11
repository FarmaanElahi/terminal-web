import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { widgets, WidgetType } from "./widget-registry";
import { GripVertical } from "lucide-react";

interface WidgetSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: WidgetType) => void;
  setActiveDragWidget: (widgetType: WidgetType) => void;
}

export function WidgetSelector({
  open,
  onClose,
  onSelect,
  setActiveDragWidget,
}: WidgetSelectorProps) {
  // Handle drag start event
  const handleDragStart = (e: React.DragEvent, widgetType: WidgetType) => {
    setActiveDragWidget(widgetType);
    // Set data transfer properties
    e.dataTransfer.setData("text/plain", widgetType);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <Sheet open={open} onOpenChange={onClose} modal={false}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Add Widget</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Drag a widget to add it to your dashboard or click to select
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <div
                id={"widget-draggable-${widget.type}"}
                key={widget.type}
                data-widget-type={widget.type}
                draggable
                unselectable="on"
                onDragStart={(e) => handleDragStart(e, widget.type)}
                className={`
                  relative border rounded-md cursor-grab droppable-element}
                `}
              >
                <Button
                  variant="ghost"
                  className="h-auto w-full p-4 flex flex-col items-start justify-start text-left"
                  onClick={() => onSelect(widget.type)}
                >
                  <div className="absolute top-2 right-2 drag-handle">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="font-semibold">{widget.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {widget.description}
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
