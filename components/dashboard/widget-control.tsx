import { HTMLAttributes } from "react";
import { GripVertical, X } from "lucide-react";
import { Button } from "../ui/button";
import type { LayoutItem } from "./use-dashboard";
import { GroupSelector } from "@/components/dashboard/widget-grouper";
import { cn } from "@/lib/utils";

interface WidgetControlProps extends HTMLAttributes<HTMLDivElement> {
  layout: LayoutItem;
  onRemove: (id: string) => void;
}

export function WidgetControl({
  layout,
  onRemove,
  children,
  ...props
}: WidgetControlProps) {
  return (
    <div {...props} className={cn(props.className, "group")}>
      {/*Left Control Panel*/}
      <div className="inline-flex absolute top-3 left-0 h-5 z-50 opacity-0 group-hover:opacity-100">
        <Button variant="secondary" className="size-5 drag-handle">
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-full">{children}</div>

      <div className="inline-flex absolute top-3 right-2 z-50 opacity-0 group-hover:opacity-100 gap-2 ">
        <GroupSelector />
        <Button
          variant="destructive"
          size="icon"
          className="p-0 size-5"
          onClick={() => onRemove(layout.i)}
        >
          <X size={3} />
        </Button>
      </div>
    </div>
  );
}
