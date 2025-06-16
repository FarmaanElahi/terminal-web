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

interface ISubscription<T> {
  subscribe: (
    obj: unknown,
    member: (v: T) => void,
    singleshot?: boolean,
  ) => void;
  unsubscribe: (obj: unknown, member: (v: T) => void) => void;
  unsubscribeAll: (obj: unknown) => void;
}

interface SaveLoadChartRecord {
  id: string | number;
  image_url: string;
  interval: string;
  modified_iso: number;
  name: string;
  short_symbol: string;
}

export interface CrossHairMovedEventParams {
  price: number;
  time: number;
}

interface PricePoint {
  price: number;
  time: number;
}

interface ILineDataSourceApi {
  getPoints: () => PricePoint[];
}

type OrderLineLengthUnit = "percentage" | "pixel" | "bar";

interface IOrderLine {
  // Getters
  getBodyBackgroundColor(): string;

  getBodyBorderColor(): string;

  getBodyFont(): string;

  getBodyTextColor(): string;

  getCancelButtonBackgroundColor(): string;

  getCancelButtonBorderColor(): string;

  getCancelButtonIconColor(): string;

  getCancelTooltip(): string;

  getCancellable(): boolean;

  getEditable(): boolean;

  getExtendLeft(): boolean;

  getLineColor(): string;

  getLineLength(): number;

  getLineLengthUnit(): OrderLineLengthUnit;

  getLineStyle(): number;

  getLineWidth(): number;

  getModifyTooltip(): string;

  getPrice(): number;

  getQuantity(): string;

  getQuantityBackgroundColor(): string;

  getQuantityBorderColor(): string;

  getQuantityFont(): string;

  getQuantityTextColor(): string;

  getText(): string;

  getTooltip(): string;

  // Event handlers
  onCancel(callback: () => void): this;

  onCancel<T>(data: T, callback: (data: T) => void): this;

  onModify(callback: () => void): this;

  onModify<T>(data: T, callback: (data: T) => void): this;

  onMove(callback: () => void): this;

  onMove<T>(data: T, callback: (data: T) => void): this;

  onMoving(callback: () => void): this;

  onMoving<T>(data: T, callback: (data: T) => void): this;

  // Setters
  setBodyBackgroundColor(value: string): this;

  setBodyBorderColor(value: string): this;

  setBodyFont(value: string): this;

  setBodyTextColor(value: string): this;

  setCancelButtonBackgroundColor(value: string): this;

  setCancelButtonBorderColor(value: string): this;

  setCancelButtonIconColor(value: string): this;

  setCancelTooltip(value: string): this;

  setCancellable(value: boolean): this;

  setEditable(value: boolean): this;

  setExtendLeft(value: boolean): this;

  setLineColor(value: string): this;

  setLineLength(value: number, unit?: OrderLineLengthUnit): this;

  setLineStyle(value: number): this;

  setLineWidth(value: number): this;

  setModifyTooltip(value: string): this;

  setPrice(value: number): this;

  setQuantity(value: string): this;

  setQuantityBackgroundColor(value: string): this;

  setQuantityBorderColor(value: string): this;

  setQuantityFont(value: string): this;

  setQuantityTextColor(value: string): this;

  setText(value: string): this;

  setTooltip(value: string): this;

  // Utility
  remove(): void;
}

declare namespace TradingView {
  interface IChartWidgetApi {
    resolution: () => string;
    setSymbol: (symbol: string, tf: string) => void;
    loadChartTemplate: (template: string) => void;
    dataReady: (cb: () => void) => void;
    crossHairMoved: () => ISubscription<CrossHairMovedEventParams>;

    onSymbolChanged(): ISubscription<void>;

    symbol: () => string;
    createOrderLine: () => Promise<IOrderLine>;
    getShapeById: (id: string | number) => ILineDataSourceApi;
  }

  interface ContextMenuItem {
    click: () => void;
    position: "top" | "bottom";
    text: string;
  }

  interface IWatchListApi {
    createList: (listName: string, symbolList: string[]) => void;
    saveList: (option: {
      id: string;
      symbols: string[];
      title: string;
    }) => void;
    onListAdded: () => ISubscription<{ listId: string; symbols: string[] }>;

    onListChanged: () => ISubscription<{ listId: string }>;

    onListRemoved: () => ISubscription<{ listId: string }>;
  }

  class widget {
    constructor(options: TradingViewWidgetOptions);

    onChartReady: (cb: () => void) => void;
    onContextMenu: (
      cb: (unixtime: number, price: number) => ContextMenuItem[],
    ) => void;
    headerReady: () => Promise<void>;
    chart: (index?: number) => IChartWidgetApi;
    chartsCount: () => number;
    activeChart: () => IChartWidgetApi;
    getSavedCharts: (cb: (record: SaveLoadChartRecord[]) => void) => void;
    loadChartFromServer: (record: SaveLoadChartRecord) => void;
    activeChartIndex: () => number;
    subscribe: <T = keyof SubscribeEventsMap>(
      scope: T,
      cb: (ev: SubscribeEventsMap[T]) => void,
    ) => void;
    onShortcut: (shortcut: string, cb: () => void) => void;
    applyOverrides: (overrides: Record<string, unknown>) => void;
    applyStudiesOverrides: (overrides: Record<string, unknown>) => void;
    setSymbol: (symbol: string, tf?: string) => void;
    changeTheme: (theme: "dark" | "light") => void;
    createButton: () => HTMLButtonElement;
    takeClientScreenshot: () => void;
    widgetbar: () => Promise<WidgetbarOptions>;
    watchList: () => Promise<IWatchListApi>;
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
