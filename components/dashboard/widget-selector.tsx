import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { widgets, WidgetType } from "./widget-registry";

interface WidgetSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: WidgetType) => void;
}

export function WidgetSelector({
  open,
  onClose,
  onSelect,
}: WidgetSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {widgets.map((widget) => (
            <Button
              key={widget.type}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => onSelect(widget.type)}
            >
              <div className="font-semibold">{widget.name}</div>
              <div className="text-sm text-muted-foreground">
                {widget.description}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
