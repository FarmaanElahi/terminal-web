import { HTMLAttributes, ReactNode } from "react";
import { GripVertical, X } from "lucide-react";
import { Button } from "../ui/button";
import type { LayoutItem } from "./use-dashboard";
import { GroupSelector } from "@/components/dashboard/widget-grouper";
import { Group, GrouperProvider } from "@/lib/state/grouper";

interface WidgetContainerProps extends HTMLAttributes<HTMLDivElement> {
  layout: LayoutItem;
  onRemove: (id: string) => void;
  children: ReactNode;
  group: Group;
}

export function WidgetContainer({
  layout,
  onRemove,
  group,
  children,
  ...props
}: WidgetContainerProps) {
  return (
    <GrouperProvider group={group}>
      <div {...props} className="relative h-full w-full group">
        <div className="h-full w-full overflow-hidden border bg-card">
          {/* Drag handle button - positioned absolutely on the left */}
          <Button
            variant="secondary"
            className="absolute top-2 left-2 h-5 w-5 drag-handle bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 z-50 hover:z-50"
          >
            <GripVertical className="h-4 w-4" />
          </Button>

          {/* Remove button - positioned absolutely on the right */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-5 w-5 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 z-50 hover:z-50"
            onClick={() => onRemove(layout.i)}
          >
            <X className="h-4 w-4" />
          </Button>

          <GroupSelector className="absolute top-2 right-8" />

          <div className="h-full w-full react-grid-item">{children}</div>
        </div>
      </div>
    </GrouperProvider>
  );
}
