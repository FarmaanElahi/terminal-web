import { ChartApp } from "@/components/dashboard/widgets/chart-app";
import { WatchlistApp } from "@/components/dashboard/widgets/watchlist-app";
import { ScreenerApp } from "@/components/dashboard/widgets/screener-app";
import { ComponentType } from "react";
import { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { IdeasApp } from "@/components/dashboard/widgets/ideas-app";
import { StatsApp } from "@/components/dashboard/widgets/stats-app";
import { DataPanelApp } from "@/components/dashboard/widgets/data-panel-app";
import { PerformanceChartApp } from "@/components/dashboard/widgets/performance-chart-app";

export type WidgetType =
  | "screener"
  | "watchlist"
  | "stats"
  | "ideas"
  | "chart"
  | "panel"
  | "performance_chart";

export const widgetComponents: Record<
  WidgetType,
  ComponentType<WidgetProps>
> = {
  screener: ScreenerApp,
  watchlist: WatchlistApp,
  stats: StatsApp,
  ideas: IdeasApp,
  chart: ChartApp,
  panel: DataPanelApp,
  performance_chart: PerformanceChartApp,
};

export const widgets: Array<{
  type: WidgetType;
  name: string;
  description: string;
}> = [
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
  {
    type: "panel",
    name: "Data Panel",
    description: "Data Panel",
  },
  {
    type: "performance_chart",
    name: "Performance Chart",
    description: "Track performance easily",
  },
];

export const WIDGET_SIZES: Record<
  WidgetType,
  { w: number; h: number; minW: number; minH: number }
> = {
  chart: { w: 6, h: 4, minW: 1, minH: 1 },
  performance_chart: { w: 6, h: 4, minW: 1, minH: 1 },
  watchlist: { w: 6, h: 4, minW: 1, minH: 1 },
  screener: { w: 6, h: 4, minW: 1, minH: 1 },
  stats: { w: 6, h: 2, minW: 1, minH: 1 },
  ideas: { w: 6, h: 4, minW: 1, minH: 1 },
  panel: { w: 6, h: 4, minW: 1, minH: 1 },
};
