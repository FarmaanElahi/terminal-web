export * from "./generated/supabase";

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
