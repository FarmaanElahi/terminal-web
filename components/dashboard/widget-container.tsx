import { HTMLAttributes, ReactNode } from "react";
import { GripVertical, X } from "lucide-react";
import { Button } from "../ui/button";
import type { LayoutItem } from "./use-dashboard";

interface WidgetContainerProps extends HTMLAttributes<HTMLDivElement> {
  layout: LayoutItem;
  onRemove: (id: string) => void;
  children: ReactNode;
}

export function WidgetContainer({
  layout,
  onRemove,
  children,
  ...props
}: WidgetContainerProps) {
  return (
    <div {...props} className="relative h-full w-full group">
      <div className="h-full w-full overflow-hidden border bg-card">
        <div className="absolute hover:z-50 top-2 left-2 right-2 flex justify-between transition-opacity duration-200">
          <Button
            variant="secondary"
            className="h-5 w-5 drag-handle bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-5 w-5 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onRemove(layout.i)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-full w-full react-grid-item">{children}</div>
      </div>
    </div>
  );
}
