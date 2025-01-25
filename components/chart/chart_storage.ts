import {
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  IExternalSaveLoadAdapter,
  LineToolsAndGroupsLoadRequestContext,
  LineToolsAndGroupsState,
  LineToolState,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from "@/components/chart/types";
import { DateTime } from "luxon";
import { Client } from "@/utils/supabase/client";
import { Json } from "@/types/generated/supabase";

export class ChartStorage implements IExternalSaveLoadAdapter {
  constructor(private readonly client: Client) {}

  /**
   * ===============================================================
   * Chart Layout
   * ===============================================================
   */
  async getAllCharts(): Promise<ChartMetaInfo[]> {
    const { data, error } = await this.client
      .from("chart_layouts")
      .select(`id,symbol,resolution,name,created_at`);
    if (error || !data) throw new Error("Cannot fetch charts");

    return data.map((d) => {
      return {
        id: d.id,
        symbol: d.symbol,
        resolution: d.resolution,
        name: d.name,
        timestamp: DateTime.fromISO(d.created_at as string).toMillis(),
      } as ChartMetaInfo;
    });
  }

  async saveChart(chart: ChartData): Promise<string | number> {
    const chartId =
      typeof chart.id === "number"
        ? "" + chart.id
        : typeof chart.id === "string"
          ? chart.id
          : undefined;

    const { data, error } = await this.client
      .from("chart_layouts")
      .upsert({
        id: chartId,
        symbol: chart.symbol,
        resolution: chart.resolution,
        name: chart.name,
        content: chart.content,
      })
      .select("id");

    if (error || !data?.[0]) throw new Error("Cannot save chart");
    return data[0].id;
  }

  async getChartContent(chartId: number | string): Promise<string> {
    chartId = typeof chartId === "number" ? "" + chartId : chartId;

    const { data, error } = await this.client
      .from("chart_layouts")
      .select(`content`)
      .eq("id", chartId)
      .maybeSingle();

    if (error || !data) throw new Error("Cannot fetch chart content");
    return data.content as string;
  }

  async removeChart(id: number | string) {
    id = typeof id === "number" ? "" + id : id;
    const { error } = await this.client
      .from("chart_layouts")
      .delete()
      .eq("id", "" + id);
    if (error) throw new Error("Cannot remove the chart");
  }

  /**
   * ===============================================================
   * Chart Template
   * ===============================================================
   */

  async getAllChartTemplates(): Promise<string[]> {
    const { data, error } = await this.client
      .from("chart_templates")
      .select(`name`);
    if (error || !data) throw new Error("Cannot fetch chart templates");
    return data.map((d) => d.name);
  }

  async saveChartTemplate(
    newName: string,
    templateContent: ChartTemplateContent,
  ) {
    const { error } = await this.client
      .from("chart_templates")
      .upsert({ name: newName, content: templateContent as Json });

    if (error) throw new Error("Failed to save chart template");
  }

  async getChartTemplateContent(name: string): Promise<ChartTemplate> {
    const { data, error } = await this.client
      .from("chart_templates")
      .select(`content`)
      .eq("name", name)
      .maybeSingle();

    if (error || !data) throw new Error("Cannot fetch chart template content");
    return data as ChartTemplate;
  }

  async removeChartTemplate(name: string) {
    const { error } = await this.client
      .from("chart_templates")
      .delete()
      .eq("name", name);
    if (error) throw new Error("Cannot remove chart template");
  }

  /**
   * ===============================================================
   * Study Template
   * ===============================================================
   */

  async getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]> {
    const { data, error } = await this.client
      .from("study_templates")
      .select(`name`);
    if (error || !data) throw new Error("Cannot fetch study template");

    return data;
  }

  async saveStudyTemplate(data: StudyTemplateData): Promise<void> {
    const { error } = await this.client.from("study_templates").upsert(data);

    if (error) throw new Error("Failed to save study template");
  }

  async getStudyTemplateContent(d: StudyTemplateMetaInfo): Promise<string> {
    const { data, error } = await this.client
      .from("study_templates")
      .select(`content`)
      .eq("name", d.name)
      .maybeSingle();

    if (error || !data) throw new Error("Cannot fetch study template content");
    return data.content as string;
  }

  async removeStudyTemplate(data: StudyTemplateMetaInfo): Promise<void> {
    const { error } = await this.client
      .from("study_templates")
      .delete()
      .eq("name", data.name);

    if (error) throw new Error("Cannot remove study template");
  }

  /**
   * ===============================================================
   * Chart Layout Drawing
   * ===============================================================
   */
  private seenKeys = new Set<string>();

  async loadLineToolsAndGroups(
    layoutId: string,
    chartId: number | string,
    _: unknown,
    requestContext: LineToolsAndGroupsLoadRequestContext,
  ): Promise<Partial<LineToolsAndGroupsState> | null> {
    if (!layoutId || !chartId || !requestContext) {
      return null;
    }
    const { symbol } = requestContext;
    if (!symbol) {
      return null;
    }

    const { data, error } = await this.client
      .from("chart_drawings")
      .select("state")
      .eq("layout_id", layoutId)
      .eq("symbol", symbol)
      .maybeSingle();

    if (error || !data) return null;

    const sources = new Map<string, LineToolState>();
    for (const entry of data.state as unknown as LineToolState[]) {
      sources.set(entry.id, entry);
    }
    return { sources };
  }

  async saveLineToolsAndGroups(
    layoutId: string,
    chartId: number | string,
    state: LineToolsAndGroupsState,
  ): Promise<void> {
    console.log(layoutId, chartId, state);

    // Group all drawing into 1
    const sources = Array.from(state.sources.values());
    const sourceGroup = {} as Record<string, LineToolState[]>;
    for (const source of sources) {
      if (!source.symbol) continue;
      if (!sourceGroup[source.symbol]) sourceGroup[source.symbol] = [];
      sourceGroup[source.symbol].push(source);
    }

    for (const [symbol, sources] of Object.entries(sourceGroup)) {
      const { data, error } = await this.client.from("chart_drawings").upsert({
        layout_id: layoutId,
        symbol: symbol,
        chart_id: "" + chartId,
        state: sources as unknown as Json,
      });
      if (error || !data) throw new Error("Failed to save drawing");
    }
  }

  /**
   * ===============================================================
   * Chart Layout Drawing
   * ===============================================================
   */
  async getDrawingTemplates(): Promise<string[]> {
    return [];
  }

  loadDrawingTemplate(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  removeDrawingTemplate?(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  saveDrawingTemplate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
