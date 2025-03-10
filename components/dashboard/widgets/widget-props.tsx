import { HTMLAttributes } from "react";
import type {
  LayoutItem,
  WidgetSettings,
} from "@/components/dashboard/use-dashboard";

export interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  layout: LayoutItem;
  updateSettings: (settings: WidgetSettings) => void;
  onRemoveWidget: (widgetId: string) => void;
}
