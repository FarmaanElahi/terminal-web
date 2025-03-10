import { ChartApp } from "@/components/dashboard/widgets/chart-app";
import { WatchlistApp } from "@/components/dashboard/widgets/watchlist-app";
import { ScreenerApp } from "@/components/dashboard/widgets/screener-app";
import { ComponentType } from "react";
import type { LayoutItem } from "./use-dashboard";
import { WidgetProps } from "@/components/dashboard/widgets/widget-props";
import { IdeasApp } from "@/components/dashboard/widgets/ideas-app";
import { StatsApp } from "@/components/dashboard/widgets/stats-app";

export type WidgetType = "screener" | "watchlist" | "stats" | "ideas" | "chart";

export const widgetComponents: Record<
  WidgetType,
  ComponentType<WidgetProps>
> = {
  screener: ScreenerApp,
  watchlist: WatchlistApp,
  stats: StatsApp,
  ideas: IdeasApp,
  chart: ChartApp,
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
];

export const WIDGET_SIZES: Record<
  WidgetType,
  { w: number; h: number; minW: number; minH: number }
> = {
  chart: { w: 4, h: 4, minW: 1, minH: 4 },
  watchlist: { w: 3, h: 6, minW: 1, minH: 4 },
  screener: { w: 3, h: 6, minW: 1, minH: 4 },
  stats: { w: 3, h: 3, minW: 1, minH: 3 },
  ideas: { w: 3, h: 6, minW: 1, minH: 3 },
};

export const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: "default-chart", x: 0, y: 0, w: 8, h: 6, type: "chart" },
  { i: "default-watchlist", x: 8, y: 0, w: 4, h: 6, type: "watchlist" },
  { i: "default-stats", x: 0, y: 6, w: 6, h: 4, type: "stats" },
  { i: "default-ideas", x: 6, y: 6, w: 6, h: 4, type: "ideas" },
];
