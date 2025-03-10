import { HTMLAttributes } from "react";
import type {
  LayoutItem,
  WidgetSettings,
} from "@/components/dashboard/use-dashboard";
import type { Group } from "@/lib/state/grouper";

export interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  layout: LayoutItem;
  updateSettings: (settings: WidgetSettings) => void;
  group: Group;
  onRemoveWidget: (widgetId: string) => void;
}
