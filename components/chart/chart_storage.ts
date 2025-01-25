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
import {
  allCharts,
  allChartTemplates,
  allStudyTemplates,
  chartContent,
  chartLayoutDrawings,
  chartTemplateContent,
  studyTemplateContent,
} from "@/lib/state/symbol";

export class ChartStorage implements IExternalSaveLoadAdapter {
  constructor(private readonly client: Client) {}

  /**
   * ===============================================================
   * Chart Layout
   * ===============================================================
   */
  async getAllCharts(): Promise<ChartMetaInfo[]> {
    const data = await allCharts();
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
    return chartContent(chartId);
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
    return allChartTemplates();
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
    return (await chartTemplateContent(name)) as ChartTemplate;
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
    return allStudyTemplates();
  }

  async saveStudyTemplate(data: StudyTemplateData): Promise<void> {
    const { error } = await this.client.from("study_templates").upsert(data);
    if (error) throw new Error("Failed to save study template");
  }

  async getStudyTemplateContent(d: StudyTemplateMetaInfo): Promise<string> {
    return studyTemplateContent(d.name);
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

    const data = await chartLayoutDrawings(layoutId, symbol);
    if (!data) return null;

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
