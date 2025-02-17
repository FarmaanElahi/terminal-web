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
  chartDrawings,
  chartTemplateContent,
  studyTemplateContent,
} from "@/lib/state/symbol";
import { isEqual } from "es-toolkit";

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
        content: JSON.parse(chart.content),
      })
      .select("id");

    if (error || !data?.[0]) throw new Error("Cannot save chart");
    return data[0].id;
  }

  async getChartContent(chartId: number | string): Promise<string> {
    return chartContent(chartId).then((r) => (r ? JSON.stringify(r) : ""));
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
    const { error } = await this.client.from("study_templates").upsert({
      content: data.content ? JSON.parse(data.content) : undefined,
      name: data.name,
    });
    if (error) throw new Error("Failed to save study template");
  }

  async getStudyTemplateContent(d: StudyTemplateMetaInfo): Promise<string> {
    const content = await studyTemplateContent(d.name);
    console.log(content);
    return content ? JSON.stringify(content) : "";
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

  // Key is the symbol check key
  private readonly _drawingSourceSymbols = {} as Record<string, string>;
  private readonly _drawings = {} as Record<
    string,
    Record<string, LineToolState>
  >;

  async loadLineToolsAndGroups(
    _: string,
    __: number | string,
    ___: unknown,
    requestContext: LineToolsAndGroupsLoadRequestContext,
  ): Promise<Partial<LineToolsAndGroupsState> | null> {
    // We only care about the symbol of the chart
    const symbol = requestContext.symbol;
    if (!symbol) return null;

    // Loading chart for the given symbol
    const data = await chartDrawings(symbol);
    if (!data) return null;

    const sources = new Map<string, LineToolState>();
    for (const entry of data) {
      const source = entry.state as unknown as LineToolState;
      sources.set(source.id, source);

      // Update symbol check key
      const symbolCheckKey = `${entry.layout_id ?? undefined}/${entry.chart_id ?? undefined}/${entry.id}`;
      this._drawingSourceSymbols[symbolCheckKey] = entry.symbol;

      // Cache the drawing data
      if (!this._drawings[symbol]) this._drawings[symbol] = {};
      this._drawings[symbol][source.id] = source;
    }
    return { sources };
  }

  async saveLineToolsAndGroups(
    layoutId: string,
    chartId: number | string,
    state: LineToolsAndGroupsState,
  ): Promise<void> {
    const drawings = state.sources;
    if (!drawings) return;

    const deleteKeys = [] as { symbol: string; id: string }[];
    const upsert = [] as LineToolState[];
    for (const [key, drawing] of drawings) {
      // Layout can be undefined when we are using unsaved chart layout
      const symbolCheckKey = `${layoutId}/${chartId}/${key}`;
      const symbol =
        drawing?.symbol ?? this._drawingSourceSymbols[symbolCheckKey];
      if (!this._drawings[symbol]) this._drawings[symbol] = {};
      if (drawing === null) {
        if (this._drawings[symbol][key]) {
          delete this._drawings[symbol][key];
          deleteKeys.push({ symbol, id: key as string });
        }
        delete this._drawingSourceSymbols[symbolCheckKey];
      } else {
        const cached = this._drawings[symbol][key];
        console.log(
          "Current",
          drawing.state,
          "Cached",
          isEqual(drawing.state, cached.state),
        );
        if (!isEqual(drawing.state, cached.state)) {
          this._drawings[symbol][key] = drawing;
          this._drawingSourceSymbols[symbolCheckKey] = symbol;
          upsert.push(drawing);
        }
      }
    }

    const upsertPromises = upsert.map((source) =>
      this.client.from("chart_drawings").upsert({
        id: source.id,
        layout_id: layoutId as string,
        chart_id: "" + chartId,
        symbol: source.symbol as string,
        ownerSource: source.ownerSource,
        state: source as unknown as Json,
      }),
    );

    const deletePromises = deleteKeys.map((source) =>
      this.client
        .from("chart_drawings")
        .delete()
        .match({ id: source.id, symbol: source.symbol }),
    );
    await Promise.all([...upsertPromises, ...deletePromises]);
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
