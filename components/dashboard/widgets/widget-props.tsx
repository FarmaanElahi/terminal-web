import type {
  LayoutItem,
  WidgetSettings,
} from "@/components/dashboard/use-dashboard";

export type WidgetProps = {
  layout?: LayoutItem;
  updateSettings: (settings: WidgetSettings) => void;
};
