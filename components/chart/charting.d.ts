import { TradingViewWidgetOptions, WidgetbarOptions } from "./types";

type EmptyCallback = () => void;

interface SubscribeEventsMap {
  activeChartChanged: (chartIndex: number) => void;
  add_compare: EmptyCallback;
  chart_load_requested: (savedData: object) => void;
  chart_loaded: EmptyCallback;
  compare_add: EmptyCallback;
  drawing: (params: StudyOrDrawingAddedToChartEventParams) => void;
  drawing_event: (
    sourceId: EntityId,
    drawingEventType: DrawingEventType,
  ) => void;
  edit_object_dialog: (params: EditObjectDialogEventParams) => void;
  indicators_dialog: EmptyCallback;
  layout_about_to_be_changed: (newLayoutType: LayoutType) => void;
  layout_changed: EmptyCallback;
  load_study_template: EmptyCallback;
  mouse_down: (params: MouseEventParams) => void;
  mouse_up: (params: MouseEventParams) => void;
  onAutoSaveNeeded: EmptyCallback;
  onMarkClick: (markId: string | number) => void;
  onPlusClick: (params: PlusClickParams) => void;
  onScreenshotReady: (url: string) => void;
  onSelectedLineToolChanged: EmptyCallback;
  onTick: (tick: Bar) => void;
  onTimescaleMarkClick: (markId: string | number) => void;
  panes_height_changed: EmptyCallback;
  panes_order_changed: EmptyCallback;
  redo: EmptyCallback;
  reset_scales: EmptyCallback;
  series_event: (seriesEventType: "price_scale_changed") => void;
  series_properties_changed: (id: EntityId) => void;
  study: (params: StudyOrDrawingAddedToChartEventParams) => void;
  study_dialog_save_defaults: (id: EntityId) => void;
  study_event: (entityId: EntityId, studyEventType: StudyEventType) => void;
  study_properties_changed: (id: EntityId) => void;
  timeframe_interval: (range: RangeOptions) => void;
  toggle_header: (isHidden: boolean) => void;
  toggle_sidebar: (isHidden: boolean) => void;
  undo: EmptyCallback;
  undo_redo_state_changed: (state: UndoRedoState) => void;
  widgetbar_visibility_changed: (isVisible: boolean) => void;
}

// Supporting TypeScript types
type EntityId = string | number;
type DrawingEventType =
  | "hidden"
  | "shown"
  | "moved"
  | "removed"
  | "clicked"
  | "created";
type LayoutType = "single" | "multi";
type Bar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
type StudyOrDrawingAddedToChartEventParams = {
  value: string;
  [key: string]: unknown;
};
type EditObjectDialogEventParams = {
  title: string;
  type: string;
  [key: string]: unknown;
};
type MouseEventParams = { x: number; y: number; [key: string]: unknown };
type PlusClickParams = { x: number; y: number; price: number; symbol: string };
type RangeOptions = { from: number; to: number; resolution: string };
type UndoRedoState = { canUndo: boolean; canRedo: boolean };

declare namespace TradingView {
  interface IChartWidgetApi {
    resolution: () => string;
  }

  class widget {
    constructor(options: TradingViewWidgetOptions);

    onChartReady: (cb: () => void) => void;
    headerReady: () => Promise<void>;
    chart: (index?: number) => unknown;
    chartsCount: () => number;
    activeChart: () => IChartWidgetApi;
    activeChartIndex: () => number;
    subscribe: <T = keyof SubscribeEventsMap>(
      scope: T,
      cb: (ev: SubscribeEventsMap[T]) => void,
    ) => void;
    onShortcut: (shortcut: string, cb: () => void) => void;
    applyOverrides: (overrides: Record<string, unknown>) => void;
    applyStudiesOverrides: (overrides: Record<string, unknown>) => void;
    setSymbol: (symbol: string, tf?: string) => void;
    changeTheme: (theme: string) => void;
    createButton: () => HTMLButtonElement;
    takeClientScreenshot: () => void;
    widgetbar: () => Promise<WidgetbarOptions>;
    watchList: () => unknown;
    getActiveListId: () => unknown;
    getList: (listId: string) => unknown;
    news: () => Promise<void>;
    showNoticeDialog: (prop: {
      title: string;
      body: string;
      callback: () => void;
    }) => void;

    saveChartToServer: (
      onComplete?: () => void,
      onFail?: (error: Error) => void,
    ) => void;

    remove: () => void;
  }
}

declare namespace Datafeeds {
  class UDFCompatibleDatafeed {
    constructor(op: string);
  }
}

declare global {
  interface Window {
    TradingView: typeof TradingView;
    Datafeeds: typeof Datafeeds;
  }
}

export type TradingView = TradingView;
