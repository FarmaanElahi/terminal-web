"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryClient, supabase } from "@/utils/client";
import type { Symbol } from "@/types/symbol";
import { fetchStockTwit } from "@/server/stocktwits";
import type { StockTwitFeed } from "@/types/stocktwits";
import { queryDuckDB } from "@/utils/duckdb";
import {
  Alert,
  Dashboard,
  DataPanel,
  InsertAlert,
  InsertDashboard,
  InsertDataPanel,
  InsertScanner,
  InsertScreen,
  Scanner,
  Screen,
  UpdateAlert,
  UpdateDashboard,
  UpdateDataPanel,
  UpdateScanner,
  UpdateScreen,
} from "@/types/supabase";

//##################### SYMBOL QUOTE #####################
async function symbolQuoteQueryFn(ticker: string) {
  const d = await queryDuckDB<Symbol>("symbols", {
    where: `ticker = '${ticker}'`,
    limit: 1,
  });
  if (d.length === 0) throw new Error("Cannot find quote");
  return d[0];
}

export function symbolQuote(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_quote", symbol],
    queryFn: async () => symbolQuoteQueryFn(symbol),
  });
}

export function useSymbolQuote(symbolName?: string) {
  return useQuery({
    enabled: !!symbolName,
    queryKey: ["symbol_quote", symbolName],
    queryFn: async () => symbolQuoteQueryFn(symbolName!),
  });
}

//##################### SYMBOL QUOTE #####################

//##################### SYMBOL RESOLVE #####################
async function symbolResolveFn(ticker: string) {
  const d = await queryDuckDB<Symbol>("symbols", {
    columns: [
      "ticker",
      "name",
      "description",
      "pricescale",
      "minmov",
      "type",
      "logo",
      "exchange",
      "exchange_logo",
      "currency",
      "industry",
      "sector",
      "isin",
    ],
    where: `ticker = '${ticker}'`,
    limit: 1,
  });

  if (d.length === 0) throw new Error("Cannot find quote");
  return d[0];
}

export function symbolResolve(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_resolve", symbol],
    queryFn: async () => symbolResolveFn(symbol),
  });
}

//##################### SYMBOL QUOTE #####################

//##################### SYMBOL SEARCH #####################

interface SymbolSearchOptions {
  exchange?: string;
  type?: string;
  signal?: AbortSignal;
  limit?: number;
}

async function symbolSearchQueryFn(q: string, option?: SymbolSearchOptions) {
  const where = [
    `"name" ILIKE '%${q}%'`,
    option?.exchange ? `"exchange" = '${option.exchange}'` : undefined,
    option?.type ? `"type" = '${option.type}'` : undefined,
  ]
    .filter((q) => q)
    .join(" &");

  return await queryDuckDB<Symbol>("symbols", {
    columns: [
      "ticker",
      "name",
      "description",
      "type",
      "logo",
      "exchange",
      "exchange_logo",
    ],
    where,
    limit: option?.limit ?? 50,
  });
}

export function symbolSearch(
  q: string,
  options?: Omit<SymbolSearchOptions, "signal">,
) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_search", q, options],
    queryFn: async ({ signal }) =>
      symbolSearchQueryFn(q, { ...options, signal }),
  });
}

export function useSymbolSearch(
  q: string,
  options?: Omit<SymbolSearchOptions, "signal">,
) {
  return useQuery({
    queryKey: ["symbol_search", q, options],
    enabled: !!q,
    queryFn: async ({ signal }) =>
      symbolSearchQueryFn(q, { ...options, signal }),
  });
}

//##################### SYMBOL SEARCH #####################

//##################### SCREENER_SCAN #####################

export function useScreener() {
  return useQuery({
    queryKey: ["symbols2"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const result = await queryDuckDB("symbols", {
        columns: [], // Will load all columns
        order: [{ field: "mcap", sort: "DESC" }],
      });
      return result as Symbol[];
    },
  });
}

//##################### SCREENER_SCAN #####################

//##################### CHART #####################

export function allCharts() {
  return queryClient.fetchQuery({
    queryKey: ["chart_layouts"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_layouts")
        .select(`id,symbol,resolution,name,created_at`)
        .abortSignal(signal);

      if (error || !data) throw new Error("Cannot fetch charts");
      return data;
    },
  });
}

export function chartContent(chartId: number | string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_layouts_content", chartId],
    queryFn: async ({ signal }) => {
      chartId = typeof chartId === "number" ? "" + chartId : chartId;
      const { data, error } = await supabase
        .from("chart_layouts")
        .select(`content`)
        .eq("id", chartId)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data) throw new Error("Cannot fetch chart content");
      return data.content;
    },
  });
}

export function chartLayout(chartId: number | string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_layouts_content", chartId],
    queryFn: async ({ signal }) => {
      chartId = typeof chartId === "number" ? "" + chartId : chartId;
      const { data, error } = await supabase
        .from("chart_layouts")
        .select()
        .eq("id", chartId as string)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data) throw new Error("Cannot fetch chart content");
      return data;
    },
  });
}

export function useChartLayout(chartId?: number | string) {
  return useQuery({
    queryKey: ["chart_layouts_content", chartId],
    enabled: !!chartId,
    queryFn: async ({ signal }) => {
      chartId = typeof chartId === "number" ? "" + chartId : chartId;
      const { data, error } = await supabase
        .from("chart_layouts")
        .select()
        .eq("id", chartId as string)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data) throw new Error("Cannot fetch chart content");
      return data;
    },
  });
}

export function allChartTemplates() {
  return queryClient.fetchQuery({
    queryKey: ["chart_templates"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_templates")
        .select(`name`)
        .abortSignal(signal);
      if (error || !data) throw new Error("Cannot fetch chart templates");
      return data.map((d) => d.name);
    },
  });
}

export function chartTemplate(name: string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_templates", name],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_templates")
        .select()
        .eq("name", name)
        .abortSignal(signal)
        .maybeSingle();
      if (error) throw new Error("Cannot fetch chart template content");
      return data;
    },
  });
}

export function allStudyTemplates() {
  return queryClient.fetchQuery({
    queryKey: ["study_templates"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("study_templates")
        .select(`name`)
        .abortSignal(signal);

      if (error || !data) throw new Error("Cannot fetch study template");
      return data;
    },
  });
}

export function studyTemplateContent(name: string) {
  return queryClient.fetchQuery({
    queryKey: ["study_templates_content", name],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("study_templates")
        .select(`content`)
        .eq("name", name)
        .abortSignal(signal)
        .maybeSingle();
      if (error || !data)
        throw new Error("Cannot fetch study template content");
      return data.content as unknown;
    },
  });
}

export function chartDrawings(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["chart_drawings", symbol],
    staleTime: 300,
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("chart_drawings")
        .select()
        .eq("symbol", symbol)
        .abortSignal(signal);

      if (error) throw new Error("Cannot fetch chart layout drawing");
      return data;
    },
  });
}

//##################### SYMBOL DISCUSSION #####################
export function useDiscussionFeed(
  params: Parameters<typeof fetchStockTwit>[0],
) {
  return useInfiniteQuery<StockTwitFeed>({
    initialPageParam: 0,
    getNextPageParam: (lastResponse) => lastResponse.cursor.since + 1,
    queryKey: ["discussion_feed", params],
    queryFn: async () => fetchStockTwit(params),
  });
}

//##################### SCREENS #####################
export function useCreateScreen(onComplete?: (screen: Screen) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (screen: Screen) => {
      void client.invalidateQueries({ queryKey: ["screens"] });
      onComplete?.(screen);
    },
    mutationFn: async (screen: InsertScreen) => {
      const { data, error } = await supabase
        .from("screens")
        .insert({
          ...screen,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteScreen(onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["screens"] });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("screens")
        .delete()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateScreen(onComplete?: (screen: Screen) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (screen: Screen) => {
      void client.invalidateQueries({ queryKey: ["screens"] });
      onComplete?.(screen);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateScreen;
    }) => {
      const { data, error } = await supabase
        .from("screens")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useScreens() {
  return useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("screens")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

//##################### WATCHLIST #####################

//##################### SCREENS #####################
export function useCreateScanner(
  type: string,
  onComplete?: (scanner: Scanner) => void,
) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (list: Scanner) => {
      void client.invalidateQueries({ queryKey: ["scanner", type] });
      onComplete?.(list);
    },
    mutationFn: async (scanner: InsertScanner) => {
      const { data, error } = await supabase
        .from("scanner")
        .insert({
          ...scanner,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteScanner(type: string, onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["scanner", type] });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("scanner")
        .delete()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateScanner(
  type: string,
  onComplete?: (scanner: Scanner) => void,
) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: async (scanner: Scanner) => {
      await client.invalidateQueries({ queryKey: ["scanner", type] });
      onComplete?.(scanner);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateScanner;
    }) => {
      const { data, error } = await supabase
        .from("scanner")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useScanners(types: Scanner["type"][]) {
  const scannerResult = useAllScanner();
  return {
    ...scannerResult,
    data: scannerResult.data?.filter((f) => types.includes(f.type)),
  };
}

export function useAllScanner() {
  return useQuery({
    queryKey: ["scanner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scanner")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export async function querySymbols(symbols: string[]) {
  if (symbols.length === 0) return [];

  const inQuery = symbols.map((s) => `'${s}'`).join(",");
  return (await queryDuckDB("symbols", {
    columns: [], // Will load all columns
    where: `ticker IN (${inQuery})`,
    limit: symbols.length,
  })) as Symbol[];
}

//##################### SCREENS #####################

//##################### DASHBOARD #####################
export function useDashboards() {
  const client = useQueryClient();
  return useQuery({
    queryKey: ["dashboards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboards")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      data?.forEach((d) => {
        client.setQueryData(["dashboards", d.id], d);
      });
      return data;
    },
  });
}

export function useCreateDashboard(
  onComplete?: (dashboard: Dashboard) => void,
) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (dashboard: Dashboard) => {
      void client.invalidateQueries({ queryKey: ["dashboards"] });
      onComplete?.(dashboard);
    },
    mutationFn: async (dashboard: InsertDashboard) => {
      const { data, error } = await supabase
        .from("dashboards")
        .upsert({
          ...dashboard,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as Dashboard;
    },
  });
}

export function useDeleteDashboard(onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["dashboards"] });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("dashboards")
        .delete()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdatedDashboard() {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (dashboard: Dashboard) => {
      client.setQueryData(["dashboards"], (dashboards: Dashboard[]) =>
        dashboards.map((d) => (d.id === dashboard.id ? dashboard : d)),
      );
      client.setQueryData(["dashboards", dashboard.id], () => dashboard);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDashboard;
    }) => {
      console.log("Updating dashboard with ID: ", id, payload);
      const { data, error } = await supabase
        .from("dashboards")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Dashboard;
    },
  });
}

export function useDashboardData(id: string) {
  return useQuery({
    queryKey: ["dashboards", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboards")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Dashboard;
    },
  });
}

//##################### DATA PANELS #####################
export function useDataPanels() {
  return useQuery({
    queryKey: ["data_panels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_panels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateDataPanel(
  onComplete?: (dataPanel: DataPanel) => void,
) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (dataPanel: DataPanel) => {
      void client.invalidateQueries({ queryKey: ["data_panels"] });
      onComplete?.(dataPanel);
    },
    mutationFn: async (dataPanel: InsertDataPanel) => {
      const { data, error } = await supabase
        .from("data_panels")
        .insert({
          ...dataPanel,
          udpated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteDataPanel(onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["data_panels"] });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("data_panels")
        .delete()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateDataPanel(
  onComplete?: (dataPanel: DataPanel) => void,
) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (dataPanel: DataPanel) => {
      void client.invalidateQueries({ queryKey: ["data_panels"] });
      onComplete?.(dataPanel);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDataPanel;
    }) => {
      const { data, error } = await supabase
        .from("data_panels")
        .update({
          ...payload,
          udpated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useDataPanelData(id: string) {
  return useQuery({
    queryKey: ["data_panels", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_panels")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as DataPanel;
    },
  });
}

//##################### ALERTS #####################

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ["alerts", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();

      if (error) throw error;
      return data as Alert;
    },
  });
}

export function useAlertsForSymbol(symbol: string) {
  return useQuery({
    queryKey: ["alerts", "symbol", symbol],
    enabled: !!symbol,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("symbol", symbol)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useCreateAlert(onComplete?: (alert: Alert) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (alert: Alert) => {
      void client.invalidateQueries({ queryKey: ["alerts"] });
      void client.invalidateQueries({
        queryKey: ["alerts", "symbol", alert.symbol],
      });
      onComplete?.(alert);
    },
    mutationFn: async (alert: InsertAlert) => {
      const { data, error } = await supabase
        .from("alerts")
        .insert({
          ...alert,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          triggered_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Alert;
    },
  });
}

export function useUpdateAlert(onComplete?: (alert: Alert) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (alert: Alert) => {
      void client.invalidateQueries({ queryKey: ["alerts"] });
      void client.invalidateQueries({ queryKey: ["alerts", alert.id] });
      void client.invalidateQueries({
        queryKey: ["alerts", "symbol", alert.symbol],
      });
      onComplete?.(alert);
    },
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAlert;
    }) => {
      const { data, error } = await supabase
        .from("alerts")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Alert;
    },
  });
}

export function useDeleteAlert(onComplete?: () => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (alert: Alert) => {
      void client.invalidateQueries({ queryKey: ["alerts"] });
      void client.invalidateQueries({ queryKey: ["alerts", alert.id] });
      void client.invalidateQueries({
        queryKey: ["alerts", "symbol", alert.symbol],
      });
      onComplete?.();
    },
    mutationFn: async (id: string) => {
      // Soft delete by setting deleted_at
      const { data, error } = await supabase
        .from("alerts")
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Alert;
    },
  });
}

export function useToggleAlertActive(onComplete?: (alert: Alert) => void) {
  const client = useQueryClient();
  return useMutation({
    onSuccess: (alert: Alert) => {
      void client.invalidateQueries({ queryKey: ["alerts"] });
      void client.invalidateQueries({ queryKey: ["alerts", alert.id] });
      void client.invalidateQueries({
        queryKey: ["alerts", "symbol", alert.symbol],
      });
      onComplete?.(alert);
    },
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("alerts")
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Alert;
    },
  });
}

type GroupRankProps = {
  group: "sector" | "industry" | "sub_industry" | "industry_2";
  periods: Array<
    "1D" | "1W" | "2W" | "1M" | "3M" | "6M" | "9M" | "12M" | string
  >;
  sort: { field: GroupRankProps["periods"][number]; direction: "ASC" | "DESC" };
};

export function useGroupRanks(props: GroupRankProps) {
  return useQuery({
    queryKey: ["ranks", JSON.stringify(props)],
    queryFn: async () => {
      const result = await queryDuckDB<Record<string, unknown>>("symbols", {
        columns: [
          { column: props.group, distinct: true, alias: "grp" },
          ...props.periods.map((period) => ({
            column: [props.group, "ranking", period].join("_"),
            alias: period,
          })),
        ],
        where: `${[props.group, "ranking", "1M"].join("_")} < 1000`,
        order: [{ field: props.sort.field, sort: props.sort.direction }],
      });

      return result.map((value) => {
        const { grp, ...ranks } = value;

        return {
          symbol: grp as string,
          ranks: ranks as Record<GroupRankProps["periods"][number], number>,
        };
      });
    },
  });
}
