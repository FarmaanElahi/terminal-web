import {
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  IExternalSaveLoadAdapter,
  LineToolsAndGroupsState,
  LineToolsGroupState,
  LineToolState,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from "@/components/chart/types";
import { AxiosInstance } from "axios";
import { DateTime } from "luxon";

export class ChartStorage implements IExternalSaveLoadAdapter {
  constructor(private readonly axios: AxiosInstance) {}

  /**
   * ===============================================================
   * Chart Layout
   * ===============================================================
   */
  async getAllCharts(): Promise<ChartMetaInfo[]> {
    const response =
      await this.axios.get<Record<string, unknown>[]>("/api/v1/charts");
    if (response.status >= 400) {
      return [];
    }

    return response.data.map(
      (r) =>
        ({
          id: r.id,
          symbol: r.symbol,
          resolution: r.resolution,
          name: r.name,
          timestamp: DateTime.fromISO(r.timestamp as string).toMillis(),
        }) as ChartMetaInfo,
    );
  }

  async saveChart(chart: ChartData): Promise<string | number> {
    console.log("Saving a new chart", chart);
    const payload = {
      id: chart.id,
      symbol: chart.symbol,
      resolution: chart.resolution,
      name: chart.name,
      content: chart.content,
    };
    const response = await this.axios.put<Record<string, unknown>>(
      `/api/v1/charts`,
      payload,
    );
    if (response.status >= 400) {
      throw new Error("Failed to save chart");
    }
    return response.data.id as string;
  }

  async getChartContent(chartId: string | number): Promise<string> {
    const path = `/api/v1/charts/${chartId}`;
    const response = await this.axios.get<Record<string, unknown>>(path);
    if (response.status >= 400) {
      throw new Error("Failed to get chart content");
    }
    return response.data.content as string;
  }

  async removeChart(id: string | number) {
    const path = `/api/v1/charts/${id}`;
    await this.axios.delete(path);
  }

  /**
   * ===============================================================
   * Chart Template
   * ===============================================================
   */

  async getAllChartTemplates(): Promise<string[]> {
    const path = "/api/v1/chart_templates";
    const response = await this.axios.get<Record<string, unknown>[]>(path);
    if (response.status >= 400) {
      return [];
    }
    return response.data.map((t) => t.name as string);
  }

  async saveChartTemplate(
    newName: string,
    templateContent: ChartTemplateContent,
  ) {
    const response = await this.axios.put<Record<string, unknown>>(
      `/api/v1/chart_templates/${newName}`,
      { content: JSON.stringify(templateContent) },
    );

    if (response.status >= 400) {
      throw new Error("Failed to save chart template");
    }
  }

  async getChartTemplateContent(name: string): Promise<ChartTemplate> {
    const path = `/api/v1/chart_templates/${name}`;
    const response = await this.axios.get<Record<string, unknown>>(path);
    if (response.status >= 400) {
      throw new Error("Failed to get chart template content");
    }
    const content = response.data.content as string;
    if (!content) {
      return {};
    }
    return JSON.parse(content) as ChartTemplate;
  }

  async removeChartTemplate(name: string) {
    const path = `/api/v1/chart_templates/${name}`;
    await this.axios.delete(path);
  }

  /**
   * ===============================================================
   * Study Template
   * ===============================================================
   */

  async getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]> {
    const path = "/api/v1/study_templates";
    const response = await this.axios.get<Record<string, unknown>[]>(path);
    if (response.status >= 400) {
      return [];
    }
    return response.data.map((t) => ({ name: t.name as string }));
  }

  async saveStudyTemplate(data: StudyTemplateData): Promise<void> {
    const response = await this.axios.put(
      `/api/v1/study_templates/${data.name}`,
      { content: JSON.stringify(data.content) },
    );

    if (response.status >= 400) {
      throw new Error("Failed to save study template");
    }
  }

  async getStudyTemplateContent(data: StudyTemplateMetaInfo): Promise<string> {
    const path = `/api/v1/study_templates/${data.name}`;
    const response = await this.axios.get<Record<string, unknown>>(path);
    if (response.status >= 400) {
      throw new Error("Failed to get study template content");
    }
    return response.data.content as string;
  }

  async removeStudyTemplate(data: StudyTemplateMetaInfo): Promise<void> {
    const path = `/api/v1/study_templates/${data.name}`;
    await this.axios.delete(path);
  }

  /**
   * ===============================================================
   * Chart Layout Drawing
   * ===============================================================
   */
  async loadLineToolsAndGroups(
    layoutId: string,
    chartId: string | number,
  ): Promise<Partial<LineToolsAndGroupsState> | null> {
    if (!layoutId || !chartId) return null;

    const path = `/api/v1/charts/${chartId}/layout/${layoutId}/drawing`;
    const response = await this.axios.get<Record<string, unknown>>(path);
    if (response.status >= 400) {
      throw new Error("Failed to get chart drawing");
    }
    const state = response.data.state;
    if (!state) return null;

    const data = JSON.parse(state as string) as Record<string, unknown>;
    if (!data?.sources) return null;

    const sources = new Map<string, LineToolState>();
    for (const [key, state] of Object.entries(data.sources)) {
      sources.set(key, state);
    }

    const groups = new Map<string, LineToolsGroupState>();
    for (const [key, state] of Object.entries(
      data.groups as unknown as object,
    )) {
      groups.set(key, state);
    }
    return {
      ...data,
      sources,
      groups,
    } satisfies LineToolsAndGroupsState;
  }

  async saveLineToolsAndGroups(
    layoutId: string,
    chartId: string | number,
    state: LineToolsAndGroupsState,
  ): Promise<void> {
    const ss = { ...state } as Record<string, unknown>;
    ss.groups = Object.fromEntries(state.groups);
    ss.sources = Object.fromEntries(state.sources);

    const path = `/api/v1/charts/${chartId}/layout/${layoutId}/drawing`;
    const response = await this.axios.put(path, {
      state: JSON.stringify(ss),
    });

    if (response.status >= 400) {
      throw new Error("Failed to save");
    }
  }

  /**
   * ===============================================================
   * Chart Layout Drawing
   * ===============================================================
   */
  async getDrawingTemplates(toolName: string): Promise<string[]> {
    return [];
  }

  loadDrawingTemplate(toolName: string, templateName: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  removeDrawingTemplate?(
    toolName: string,
    templateName: string,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  saveDrawingTemplate(
    toolName: string,
    templateName: string,
    content: string,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
