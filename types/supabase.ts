export * from "./generated/supabase";
import type { Database } from "@/types/generated/supabase";

export interface Subsession {
  description?: string;
  id?: string;
  private?: boolean;
  session?: string;
  "session-correction"?: string;
  "session-display"?: string;
}

export interface ActionH {
  Actual?: number;
  Estimate?: number;
  FiscalPeriod: string;
  IsReported?: boolean;
  Surprise?: number;
  Type?: number;
}

export type Screen = Database["public"]["Tables"]["screens"]["Row"];
export type InsertScreen = Database["public"]["Tables"]["screens"]["Insert"];
export type UpdateScreen = Database["public"]["Tables"]["screens"]["Update"];

export type Watchlist = Database["public"]["Tables"]["watchlists"]["Row"];
export type InsertWatchlist =
  Database["public"]["Tables"]["watchlists"]["Insert"];
export type UpdateWatchlist =
  Database["public"]["Tables"]["watchlists"]["Update"];

export type Dashboard = Database["public"]["Tables"]["dashboards"]["Row"];
export type InsertDashboard =
  Database["public"]["Tables"]["dashboards"]["Insert"];
export type UpdateDashboard =
  Database["public"]["Tables"]["dashboards"]["Update"];

export type DataPanel = Database["public"]["Tables"]["data_panels"]["Row"];
export type InsertDataPanel =
  Database["public"]["Tables"]["data_panels"]["Insert"];
export type UpdateDataPanel =
  Database["public"]["Tables"]["data_panels"]["Update"];
