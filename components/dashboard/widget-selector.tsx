import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { WidgetType } from "./dashboard";

interface WidgetSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: WidgetType) => void;
}

const widgets: Array<{ type: WidgetType; name: string; description: string }> =
  [
    {
      type: "screener",
      name: "Stock Screener",
      description: "Screen stocks based on various criteria",
    },
    {
      type: "watchlist",
      name: "Watchlist",
      description: "Track your favorite stocks",
    },
    {
      type: "stats",
      name: "Statistics",
      description: "View detailed statistics",
    },
    {
      type: "ideas",
      name: "Trading Ideas",
      description: "Get trading ideas and insights",
    },
    {
      type: "chart",
      name: "Chart",
      description: "Chart Widget",
    },
  ];

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
