/**
 * ===============================================================
 * DataFeed
 * ===============================================================
 */
import type { CustomIndicator, PineJS } from "@/components/chart/pinejs";

export interface LibrarySymbolInfo {
  /**
   * Array of base symbols.
   */
  base_name?: [string];

  /**
   * Indicates whether seconds bars for this symbol can be built from ticks.
   */
  build_seconds_from_ticks?: boolean;

  /**
   * List of corrections for a symbol.
   */
  corrections?: string;

  /**
   * Currency in which the instrument is traded.
   */
  currency_code?: string;

  /**
   * Array of supported daily resolutions.
   */
  daily_multipliers?: string[];

  /**
   * Status code of the series.
   */
  data_status?: "streaming" | "endofday" | "delayed_streaming";

  /**
   * Delay type or real-time delay in seconds.
   */
  delay?: number;

  /**
   * Description of the symbol.
   */
  description: string;

  /**
   * Traded exchange name.
   */
  exchange: string;

  /**
   * URL of the exchange logo.
   */
  exchange_logo?: string;

  /**
   * Expiration date for expired symbols.
   */
  expiration_date?: number;

  /**
   * Indicates whether the symbol is expired.
   */
  expired?: boolean;

  /**
   * Format for displaying labels on the price scale.
   */
  format?: "price" | "volume";

  /**
   * Indicates whether fractional prices are supported.
   */
  fractional?: boolean;

  /**
   * Indicates whether daily data is supported.
   */
  has_daily?: boolean;

  /**
   * Indicates whether empty bars should be generated for missing data.
   */
  has_empty_bars?: boolean;

  /**
   * Indicates whether intraday data is supported.
   */
  has_intraday?: boolean;

  /**
   * Indicates whether seconds data is supported.
   */
  has_seconds?: boolean;

  /**
   * Indicates whether tick data is supported.
   */
  has_ticks?: boolean;

  /**
   * Indicates whether weekly and monthly resolutions are provided by the datafeed.
   */
  has_weekly_and_monthly?: boolean;

  /**
   * Industry of the symbol.
   */
  industry?: string;

  /**
   * Supported intraday resolutions.
   */
  intraday_multipliers?: string[];

  /**
   * Additional custom fields.
   */
  library_custom_fields?: Record<string, unknown>;

  /**
   * Name of the exchange where the symbol is listed.
   */
  listed_exchange: string;

  /**
   * URLs for symbol logos.
   */
  logo_urls?: [string] | [string, string] | string[];

  /**
   * Long description of the symbol.
   */
  long_description?: string;

  /**
   * Minimum price movement.
   */
  minmov: number;

  /**
   * Used for fractional price formats.
   */
  minmove2?: number;

  /**
   * Supported monthly resolutions.
   */
  monthly_multipliers?: string[];

  /**
   * Symbol name within an exchange.
   */
  name: string;

  /**
   * Currency in which the instrument is originally traded.
   */
  original_currency_code?: string;

  /**
   * Unique identifier for a trading unit.
   */
  original_unit_id?: string;

  /**
   * Optional price source ID.
   */
  price_source_id?: string;

  /**
   * Supported price sources.
   */
  price_sources?: Array<{ id: string; name: string }>;

  /**
   * Scale for price values.
   */
  pricescale: number;

  /**
   * Resolutions supported for seconds data.
   */
  seconds_multipliers?: string[];

  /**
   * Sector of the symbol.
   */
  sector?: string;

  /**
   * Trading hours for the symbol.
   */
  session: string;

  /**
   * Session value displayed in the UI.
   */
  session_display?: string;

  /**
   * List of holidays when the symbol is not traded.
   */
  session_holidays?: string;

  /**
   * ID of the current subsession.
   */
  subsession_id?: string;

  /**
   * Subsession details.
   */
  subsessions?: Array<{
    description: string;
    id: string;
    private: boolean;
    session: string;
    "session-correction": string;
    "session-display": string;
  }>;

  /**
   * Supported resolutions for the symbol.
   */
  supported_resolutions?: string[];

  /**
   * Unique identifier for the symbol in requests.
   */
  ticker?: string;

  /**
   * Timezone of the exchange.
   */
  timezone: string;

  /**
   * Type of the instrument.
   */
  type: string;

  /**
   * Allowed unit conversion group names.
   */
  unit_conversion_types?: string[];

  /**
   * Unique identifier for the trading unit.
   */
  unit_id?: string;

  /**
   * Dynamic tick size based on price range.
   */
  variable_tick_size?: string;

  /**
   * Supported plot types for the symbol.
   */
  visible_plots_set?: string;

  /**
   * Volume precision for the symbol.
   */
  volume_precision?: number;

  /**
   * Supported weekly resolutions.
   */
  weekly_multipliers?: string[];

  symKey: string;
  n?: string;
  p?: Record<string, unknown>;
}

export type ResolutionString =
  | "1"
  | "2"
  | "3"
  | "5"
  | "10"
  | "15"
  | "30"
  | "45"
  | "60"
  | "120"
  | "180"
  | "240"
  | "D"
  | "1W"
  | "1M"
  | "3M"
  | "6M"
  | "12M";

export interface PeriodParams {
  /**
   * The exact amount of bars to load.
   * Should be prioritized over `from` if your datafeed supports it.
   */
  countBack: number;

  /**
   * Indicates if this is the first call to `getBars`.
   * Useful for initial data fetch logic.
   */
  firstDataRequest: boolean;

  /**
   * Unix timestamp for the leftmost requested bar.
   */
  from: number;

  /**
   * Unix timestamp for the rightmost requested bar (not inclusive).
   */
  to: number;
}

export interface Bar {
  /**
   * Closing price of the bar.
   */
  close: number | number[];

  /**
   * Highest price of the bar.
   */
  high: number | number[];

  /**
   * Lowest price of the bar.
   */
  low: number | number[];

  /**
   * Opening price of the bar.
   */
  open: number | number[];

  /**
   * Bar time in milliseconds since Unix epoch in UTC timezone.
   * For daily, weekly, and monthly bars, this is expected to be
   * the trading day at 00:00 UTC.
   */
  time: number;

  /**
   * Trading volume of the bar (optional).
   */
  volume?: number;
}

export interface HistoryMetadata {
  /**
   * The time of the next available bar in history, represented as a Unix timestamp in milliseconds.
   * Use this when there is no data in the requested time range to notify the library about the next available data.
   */
  nextTime?: number;

  /**
   * Indicates whether there is no more data available on the server.
   */
  noData?: boolean;
}

export type HistoryCallback = (bars: Bar[], meta?: HistoryMetadata) => void;

export type DatafeedErrorCallback = (reason: string) => void;

export type MarkConstColors = "red" | "green" | "blue" | "yellow";

export type GetMarksCallback<T> = (marks: T[]) => void;

export type SearchSymbolsCallback = (items: SearchSymbolResultItem[]) => void;

export interface SearchSymbolResultItem {
  /**
   * Description of the symbol.
   */
  description: string;

  /**
   * Name of the exchange where the symbol is traded.
   */
  exchange: string;

  /**
   * Optional URL of the image to be displayed as the logo for the exchange.
   * The `show_exchange_logos` feature must be enabled for this to appear in the UI.
   */
  exchange_logo?: string;

  /**
   * Optional URLs of images to be displayed as logos for the symbol.
   * The `show_symbol_logos` feature must be enabled for this to appear in the UI.
   * If two URLs are provided, they are displayed as overlapping circles.
   */
  logo_urls?: [string, string] | [string];

  /**
   * Short symbol name.
   */
  symbol: string;

  /**
   * Optional ticker name for the symbol. Should be a unique identifier.
   */
  ticker?: string;

  /**
   * Type of the symbol.
   * Example values: 'stock', 'futures', 'forex', 'index'.
   */
  type: string;
}

export interface SymbolResolveExtension {
  /**
   * Indicates the currency for conversions if the `currency_codes` configuration field is set,
   * and `currency_code` is provided in the original symbol information (LibrarySymbolInfo).
   */
  currencyCode?: string;

  /**
   * Trading session type, such as "regular" or "extended", that the chart should currently display.
   */
  session?: string;

  /**
   * Indicates the unit for conversion if the `units` configuration field is set,
   * and `unit_id` is provided in the original symbol information (LibrarySymbolInfo).
   */
  unitId?: string;
}

export interface MarkCustomColor {
  /**
   * Background color for the mark.
   */
  background: string;

  /**
   * Border color for the mark.
   */
  border: string;
}

export interface Mark {
  /**
   * Optional border width for the mark.
   */
  borderWidth?: number;

  /**
   * Color of the mark.
   */
  color: MarkConstColors | MarkCustomColor;

  /**
   * Optional border width when the mark is hovered over.
   */
  hoveredBorderWidth?: number;

  /**
   * Unique identifier for the mark.
   */
  id: string | number;

  /**
   * Optional URL for an image displayed within the timescale mark.
   * Should ideally be square in dimension.
   */
  imageUrl?: string;

  /**
   * Label text for the mark.
   */
  label: string;

  /**
   * Font color for the label text.
   */
  labelFontColor: string;

  /**
   * Minimum size for the mark.
   */
  minSize: number;

  /**
   * Optional flag to show text label even when an image is loaded.
   * Defaults to `false` if undefined.
   */
  showLabelWhenImageLoaded?: boolean;

  /**
   * Text content for the mark.
   */
  text: string;

  /**
   * Time for the mark, represented as a Unix timestamp in seconds.
   */
  time: number;
}

export type ServerTimeCallback = (serverTime: number) => void;
export type TimeScaleMarkShape =
  | "circle"
  | "earningUp"
  | "earningDown"
  | "earning";

export interface TimescaleMark {
  /**
   * Color for the timescale mark.
   */
  color: string;

  /**
   * ID of the timescale mark.
   */
  id: string | number;

  /**
   * Optional URL for an image to be displayed within the timescale mark.
   * The image should ideally be square in dimension. Any image type supported by the browser is acceptable.
   */
  imageUrl?: string;

  /**
   * Label for the timescale mark.
   */
  label: string;

  /**
   * Optional color for the timescale mark text label.
   * If undefined, the value provided for `color` will be used.
   */
  labelFontColor?: string;

  /**
   * Optional shape of the timescale mark.
   */
  shape?: TimeScaleMarkShape;

  /**
   * Continue to show text label even when an image has been loaded for the timescale mark.
   * Defaults to false if undefined.
   */
  showLabelWhenImageLoaded?: boolean;

  /**
   * Time for the mark. Represented as a Unix timestamp in seconds.
   */
  time: number;

  /**
   * Tooltip content as an array of strings.
   */
  tooltip: string[];
}

export type ResolveCallback = (symbolInfo: LibrarySymbolInfo) => void;

export type SubscribeBarsCallback = (bar: Bar) => void;

export type DOMCallback = (data: DOMData) => void;

export interface DOMLevel {
  /**
   * Price for the Depth of Market (DOM) level.
   */
  price: number;

  /**
   * Volume for the Depth of Market (DOM) level.
   */
  volume: number;
}

export interface DOMData {
  /**
   * Ask order levels.
   * Must be sorted by price in ascending order.
   */
  asks: DOMLevel[];

  /**
   * Bid order levels.
   * Must be sorted by price in ascending order.
   */
  bids: DOMLevel[];

  /**
   * Indicates whether the Depth of Market data is a snapshot or contains only updated levels.
   * - If `true`, the data contains the full set of depth data.
   * - If `false`, the data only contains updated levels.
   */
  snapshot: boolean;
}

export interface IDatafeedChartApi {
  /**
   * Fetch historical bar data for a specific symbol and resolution.
   */
  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ): void;

  /**
   * Fetch marks for the visible bars in a specified range.
   */
  getMarks?(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString,
  ): void;

  /**
   * Retrieve the current server time in UNIX format.
   */
  getServerTime?(callback: ServerTimeCallback): void;

  /**
   * Fetch timescale marks for the visible range of bars.
   */
  getTimescaleMarks?(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
    resolution: ResolutionString,
  ): void;

  /**
   * Get the resolution used for the Volume Profile Visible Range indicator.
   */
  getVolumeProfileResolutionForPeriod?(
    currentResolution: ResolutionString,
    from: number,
    to: number,
    symbolInfo: LibrarySymbolInfo,
  ): ResolutionString;

  /**
   * Resolve symbol information for a specific symbol name.
   */
  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback,
    extension?: SymbolResolveExtension,
  ): void;

  /**
   * Search for symbols based on user input, exchange, and symbol type.
   */
  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ): void;

  /**
   * Subscribe to real-time updates for a specific symbol.
   */
  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ): void;

  /**
   * Subscribe to Depth of Market (DOM) data for a symbol.
   */
  subscribeDepth?(symbol: string, callback: DOMCallback): string;

  /**
   * Unsubscribe from real-time bar updates.
   */
  unsubscribeBars(listenerGuid: string): void;

  /**
   * Unsubscribe from Depth of Market (DOM) updates.
   */
  unsubscribeDepth?(subscriberUID: string): void;
}

/**
 export interface defines the structure of an external datafeed object used by the library.
 */
export interface IExternalDatafeed {
  /**
   * This method provides the object filled with configuration data.
   * The library assumes that the callback function will be called to return
   * the datafeed configuration.
   *
   * @param callback - A function to return your datafeed configuration to the library.
   */
  onReady(callback: OnReadyCallback): void;
}

/**
 * Type definition for the callback function used in the `onReady` method.
 * The callback expects a `DatafeedConfiguration` object as an argument.
 */
export type OnReadyCallback = (configuration: DatafeedConfiguration) => void;

/**
 * Represents a currency item used for currency conversion.
 */
export interface CurrencyItem {
  /**
   * Unique ID for the currency.
   */
  id: string;

  /**
   * Currency code (e.g., "USD").
   */
  code: string;

  /**
   * Optional description for the currency.
   */
  description?: string;

  /**
   * Optional URL to an image of the currency.
   * - SVG logos are preferred.
   * - For raster images, the expected size is 24x24px.
   */
  logoUrl?: string;
}

/**
 * Represents a unit object used for grouping and describing units in the datafeed.
 */
export interface Unit {
  /**
   * Unique ID for the unit.
   */
  id: string;

  /**
   * Short name of the unit.
   */
  name: string;

  /**
   * Description of the unit.
   */
  description: string;
}

/**
 * Represents the description of an exchange.
 */
export interface Exchange {
  /**
   * The name of the exchange.
   */
  name: string;

  /**
   * The description of the exchange.
   */
  desc: string;

  /**
   * The value to be passed as the `exchange` argument to `searchSymbols`.
   */
  value: string;
}

/**
 * Represents a symbol type descriptor used by the datafeed.
 */
export interface DatafeedSymbolType {
  /**
   * The name of the symbol type.
   */
  name: string;

  /**
   * The value to be passed as the `symbolType` argument to `searchSymbols`.
   */
  value: string;
}

/**
 * Represents the datafeed configuration data used by the library.
 * This configuration is passed to the `OnReadyCallback` of the `onReady` method.
 */
export interface DatafeedConfiguration {
  /**
   * Supported currencies for currency conversion.
   * When a currency code is supplied as a string, it will be converted automatically
   * to an object with `id` and `code` properties.
   */
  currency_codes?: (string | CurrencyItem)[];

  /**
   * List of exchange descriptors.
   * An empty array removes the exchanges filter in the Symbol Search list.
   * Use `value=''` to include all exchanges.
   */
  exchanges?: Exchange[];

  /**
   * List of resolutions that the chart should support.
   * If undefined or empty, the Resolution drop-down menu displays the default
   * resolutions available for the current symbol.
   * Example: `["1", "15", "240", "D", "6M"]`.
   */
  supported_resolutions?: ResolutionString[];

  /**
   * Indicates if the datafeed supports marks on bars.
   */
  supports_marks?: boolean;

  /**
   * Indicates if the datafeed provides server time (unix time).
   * This is used to adjust the countdown on the Price scale.
   */
  supports_time?: boolean;

  /**
   * Indicates if the datafeed supports marks on the timescale.
   */
  supports_timescale_marks?: boolean;

  /**
   * Groups symbols in the Symbol Search by their types.
   * Each key represents a symbol type, and the value is a regular expression
   * that divides an instrument name into a root and expiration.
   * Example:
   * ```json
   * {
   *   "futures": "/^(.+)([12]!|[FGHJKMNQUVXZ]\\d{1,2})$/",
   *   "stock": "/^(.+)([12]!|[FGHJKMNQUVXZ]\\d{1,2})$/"
   * }
   * ```
   */
  symbols_grouping?: Record<string, string>;

  /**
   * List of filter descriptors for symbol types.
   * Undefined or empty array removes filter types in the Symbol Search list.
   * Use `value=''` to include all filter types.
   */
  symbols_types?: DatafeedSymbolType[];

  /**
   * Supported unit groups.
   * Each group contains several unit objects.
   * Example:
   * ```json
   * {
   *   weight: [
   *     { id: "kg", name: "kg", description: "Kilograms" },
   *     { id: "lb", name: "lb", description: "Pounds" }
   *   ]
   * }
   * ```
   */
  units?: Record<string, Unit[]>;
}

/**
 * Interface for the Quotes datafeed API used by the library.
 export interface defines methods to handle quotes data for symbols,
 * including fetching quotes, subscribing for real-time updates, and unsubscribing.
 */
export interface IDatafeedQuotesApi {
  /**
   * Fetches quote data for the given symbols.
   * The library assumes that `onDataCallback` is called once with the requested data.
   *
   * @param symbols - Array of symbol names to fetch quote data for.
   * @param onDataCallback - Callback to return the requested data.
   * @param onErrorCallback - Callback to handle errors during the request.
   */
  getQuotes(
    symbols: string[],
    onDataCallback: QuotesCallback,
    onErrorCallback: QuotesErrorCallback,
  ): void;

  /**
   * Subscribes to real-time quote updates for the given symbols.
   * The library assumes that `onRealtimeCallback` is called every time the quotes are updated.
   *
   * @param symbols - List of symbols that should be updated rarely (once per minute).
   * @param fastSymbols - List of symbols that should be updated frequently (at least once every 10 seconds).
   * @param onRealtimeCallback - Callback to send real-time quote data updates.
   * @param listenerGUID - Unique identifier of the listener.
   */
  subscribeQuotes(
    symbols: string[],
    fastSymbols: string[],
    onRealtimeCallback: QuotesCallback,
    listenerGUID: string,
  ): void;

  /**
   * Unsubscribes from real-time quote updates for the given listener.
   *
   * @param listenerGUID - Unique identifier of the listener to unsubscribe.
   */
  unsubscribeQuotes(listenerGUID: string): void;
}

/**
 * Callback type for returning quote data.
 *
 * @param quotes - Array of quote data.
 */
export type QuotesCallback = (quotes: QuoteData[]) => void;

/**
 * Callback type for handling errors during a quotes request.
 *
 * @param error - Error message or object describing the issue.
 */
export type QuotesErrorCallback = (error: Error) => void;

/**
 * Represents a successful quote data response for a symbol.
 */
export interface QuoteData {
  /**
   * The symbol name.
   * This value must match exactly the name used in the request.
   */
  n: string;

  /**
   * The status code for the symbol.
   * Expected value: "ok" or "error.
   */
  s: string;

  /**
   * The quote values associated with the symbol.
   */
  v: Record<string, unknown>;
}

export type StreamingDataFeed = (IDatafeedChartApi & IExternalDatafeed) &
  IDatafeedQuotesApi;

/**
 * ===============================================================
 * Chart
 * ===============================================================
 */

// IExternalSaveLoadAdapter.ts

/**
 * Interface for external save/load adapter used by the charting library.
 */
export interface IExternalSaveLoadAdapter {
  /**
   * Get names of all saved chart templates.
   */
  getAllChartTemplates(): Promise<string[]>;

  /**
   * Get all saved charts with their metadata.
   */
  getAllCharts(): Promise<ChartMetaInfo[]>;

  /**
   * Get all saved study templates.
   */
  getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]>;

  /**
   * Load a chart from the server by its unique ID.
   * @param chartId - The unique ID of the chart.
   */
  getChartContent(chartId: string | number): Promise<string>;

  /**
   * Load a chart template from the server by its name.
   * @param templateName - The name of the chart template.
   */
  getChartTemplateContent(templateName: string): Promise<ChartTemplate>;

  /**
   * Get names of all saved drawing templates for a specific tool.
   * @param toolName - The name of the drawing tool.
   */
  getDrawingTemplates(toolName: string): Promise<string[]>;

  /**
   * Load a study template from the server.
   * @param studyTemplateInfo - Metadata of the study template.
   */
  getStudyTemplateContent(
    studyTemplateInfo: StudyTemplateMetaInfo,
  ): Promise<string>;

  /**
   * Load a drawing template from the server.
   * @param toolName - The name of the drawing tool.
   * @param templateName - The name of the drawing template.
   */
  loadDrawingTemplate(toolName: string, templateName: string): Promise<string>;

  /**
   * Load drawings and drawing groups associated with a chart layout.
   * @param layoutId - The chart layout ID.
   * @param chartId - The chart ID.
   * @param requestType - Type of load request.
   * @param requestContext - Additional context for the request.
   */
  loadLineToolsAndGroups(
    layoutId: string,
    chartId: string | number,
    requestType: unknown,
    requestContext: LineToolsAndGroupsLoadRequestContext,
  ): Promise<Partial<LineToolsAndGroupsState> | null>;

  /**
   * Remove a chart by its unique ID.
   * @param id - The unique ID of the chart.
   */
  removeChart(id: string | number): Promise<void>;

  /**
   * Remove a chart template by its name.
   * @param templateName - The name of the template.
   */
  removeChartTemplate(templateName: string): Promise<void>;

  /**
   * Remove a drawing template for a specific tool.
   * @param toolName - The name of the drawing tool.
   * @param templateName - The name of the drawing template.
   */
  removeDrawingTemplate?(toolName: string, templateName: string): Promise<void>;

  /**
   * Remove a study template.
   * @param studyTemplateInfo - Metadata of the study template.
   */
  removeStudyTemplate(studyTemplateInfo: StudyTemplateMetaInfo): Promise<void>;

  /**
   * Save a chart.
   * @param chartData - The data of the chart to save.
   */
  saveChart(chartData: ChartData): Promise<string | number>;

  /**
   * Save a chart template.
   * @param newName - The name of the new template.
   * @param theme - The content of the chart template.
   */
  saveChartTemplate(
    newName: string,
    theme: ChartTemplateContent,
  ): Promise<void>;

  /**
   * Save a drawing template for a specific tool.
   * @param toolName - The name of the drawing tool.
   * @param templateName - The name of the drawing template.
   * @param content - The content of the drawing template.
   */
  saveDrawingTemplate(
    toolName: string,
    templateName: string,
    content: string,
  ): Promise<void>;

  /**
   * Save drawings and drawing groups associated with a chart layout.
   * @param layoutId - The chart layout ID.
   * @param chartId - The chart ID.
   * @param state - The state of drawings and drawing groups.
   */
  saveLineToolsAndGroups(
    layoutId: string,
    chartId: string | number,
    state: LineToolsAndGroupsState,
  ): Promise<void>;

  /**
   * Save a study template.
   * @param studyTemplateData - The data of the study template to save.
   */
  saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void>;
}

/**
 * Interface for providing additional context when loading line tools and groups.
 */
export interface LineToolsAndGroupsLoadRequestContext {
  /**
   * Optional name or identifier of the symbol displayed as the main series on the chart.
   */
  symbol?: string;
}

/**
 * Interface representing the data for a study template.
 */
export interface StudyTemplateData {
  /**
   * The content of the study template, typically serialized data defining the study.
   */
  content: string;

  /**
   * The name of the study template.
   */
  name: string;
}

/**
 * Interface representing saved chart data.
 */
export interface ChartData {
  /**
   * Content of the chart.
   */
  content: string;

  /**
   * Unique ID of the chart.
   * May be undefined if the chart wasn't saved before.
   */
  id?: string | number;

  /**
   * Name of the chart.
   */
  name: string;

  /**
   * Resolution of the chart (e.g., "1D", "1H").
   */
  resolution: ResolutionString;

  /**
   * Symbol of the chart (e.g., stock ticker symbol like "AAPL").
   */
  symbol: string;

  /**
   * UNIX timestamp when the chart was last modified.
   * Used to display date and time in the Load Layout dialog.
   */
  timestamp: number;
}

/**
 * Interface representing meta information about a saved chart.
 */
export interface ChartMetaInfo {
  /**
   * Unique ID of the chart.
   */
  id: string | number;

  /**
   * Name of the chart.
   */
  name: string;

  /**
   * Resolution of the chart (e.g., "1D", "1H", "5M").
   */
  resolution: ResolutionString;

  /**
   * Symbol associated with the chart (e.g., "AAPL", "BTCUSD").
   */
  symbol: string;

  /**
   * UNIX timestamp indicating when the chart was last modified.
   */
  timestamp: number;
}

/**
 * Interface representing metadata for a study template.
 */
export interface StudyTemplateMetaInfo {
  /**
   * Name of the study template.
   */
  name: string;
}

/**
 * Interface representing a chart template.
 */
export interface ChartTemplate {
  /**
   * The optional content of the chart template.
   */
  content?: ChartTemplateContent;
}

/**
 * Interface representing the content of a chart template.
 * The properties define the settings and configurations
 * saved or loaded by the charting library.
 */
export interface ChartTemplateContent {
  /**
   * Chart properties such as colors, grid settings, etc.
   */
  chartProperties?: {
    [key: string]: unknown; // Dynamic properties for chart customization
  };

  /**
   * Main source properties, e.g., series style, indicator settings, etc.
   */
  mainSourceProperties?: unknown; // Placeholder for series or chart-specific properties

  /**
   * Version of the chart template.
   */
  version?: number; // Indicates the template version

  /**
   * Indexable properties for additional configurations.
   */
  [key: string]: unknown; // Allows the interface to hold additional properties
}

/**
 * Represents the state of drawings and groups in a chart layout.
 */
export interface LineToolsAndGroupsState {
  /**
   * A map of group IDs to their corresponding drawing group states.
   */
  groups: Map<string, LineToolsGroupState>;

  /**
   * A map of source IDs to their respective drawing states.
   */
  sources: Map<EntityId, LineToolState>;

  /**
   * (Optional) The symbol ID associated with the drawings and groups.
   */
  symbol?: string;
}

/**
 * Represents the state of a drawing group.
 * Placeholder for `LineToolsGroupState`.
 */
export interface LineToolsGroupState {
  // Add relevant properties for group state as needed.
  [key: string]: unknown; // Placeholder for flexibility.
}

/**
 * Represents the state of an individual drawing tool.
 * Placeholder for `LineToolState`.
 */
export interface LineToolState {
  // Add relevant properties for tool state as needed.
  [key: string]: unknown; // Placeholder for flexibility.
}

/**
 * Represents an entity ID.
 */
export type EntityId = string | number;

/**
 * ===============================================================
 * User
 * ===============================================================
 */

export interface ISettingsAdapter {
  /**
   * Initial settings the chart should be initiated with.
   */
  initialSettings?: InitialSettingsMap;

  /**
   * Removes a value for a setting.
   * @param key - The key of the setting to be removed.
   */
  removeValue(key: string): void;

  /**
   * Sets a value for a setting.
   * @param key - The key of the setting.
   * @param value - The value to set for the setting.
   */
  setValue(key: string, value: string): void;
}

// Supporting TypeScript type
type InitialSettingsMap = Record<string, string>;

/**
 * ===============================================================
 * Widget
 * ===============================================================
 */
export interface WidgetbarOptions {
  details?: boolean;
  datawindow?: boolean;
  watchlist?: true;
  watchlist_settings?: {
    default_symbols: string[];
    readonly?: true;
  };
}

export interface TradingViewWidgetOptions {
  additional_symbol_info_fields?: { propertyName: string; title: string }[];
  auto_save_delay?: number;
  autosize?: boolean;
  charts_storage_api_version?: "1.0" | "1.1";
  charts_storage_url?: string;
  client_id?: string;
  compare_symbols?: { symbol: string; title: string }[];
  container: string | HTMLElement;
  context_menu?: {
    items_processor: (
      items: unknown,
      actionsFactory: unknown,
      params: unknown,
    ) => Promise<unknown>;
    renderer_factory: (
      items: unknown[],
      params: unknown,
      onDestroy: () => void,
    ) => Promise<unknown>;
  };
  custom_chart_description_function?: (
    context: Record<string, unknown>,
  ) => Promise<string | null>;
  custom_css_url?: string;
  custom_font_family?: string;
  custom_formatters?: {
    timeFormatter?: (date: Date) => string;
    dateFormatter?: (date: Date) => string;
    tickMarkFormatter?: (
      date: Date,
      tickMarkType:
        | "Year"
        | "Month"
        | "DayOfMonth"
        | "Time"
        | "TimeWithSeconds",
    ) => string;
    priceFormatterFactory?: (
      symbolInfo: unknown,
      minTick: unknown,
    ) => {
      format: (price: number, signPositive: unknown) => string;
    } | null;
  };
  custom_indicators_getter?: (
    PineJS: PineJS,
  ) => Promise<readonly CustomIndicator[]>;
  custom_themes?: unknown;
  custom_timezones?: unknown[];
  custom_translate_function?: (
    originalText: string,
    singularOriginalText: string,
    translatedText: string,
  ) => string | null;
  datafeed: StreamingDataFeed | unknown;
  debug?: boolean;
  disabled_features?: string[];
  drawing_access?: {
    type: "white" | "black";
    tools: Array<{
      name: string;
      grayed: boolean;
    }>;
  };
  enabled_features?: string[];
  favorites?: {
    intervals: Array<string>;
    indicators: Array<string>;
    drawingTools: Array<string>;
    chartTypes: Array<string>;
  };
  fullscreen?: boolean;
  header_widget_buttons_mode?: "adaptive" | "fullsize";
  height?: number;
  interval?: string;
  library_path?: string;
  load_last_chart?: boolean;
  loading_screen?: { backgroundColor: string; foregroundColor: string };
  locale?: string;
  number_formatting?: { decimal_sign: string };
  overrides?: Record<string, string | number>;
  save_load_adapter?: unknown;
  saved_data?: object;
  saved_data_meta_info?: {
    uid?: string;
    description?: string;
    name?: string;
  };
  settings_adapter?: unknown;
  settings_overrides?: Record<string, string | number>;
  snapshot_url?: string;
  studies_access?: {
    type: "white" | "black";
    tools: Array<{
      name: string;
      grayed: boolean;
    }>;
  };
  studies_overrides?: Record<string, string | number>;
  study_count_limit?: number;
  symbol?: string;
  symbol_search_complete?: (
    symbol: string,
    searchResultItem?: {
      description: string;
      exchange: string;
      symbol: string;
      ticker: string;
      type: string;
    },
  ) => Promise<{ symbol: string; name: string }>;
  symbol_search_request_delay?: number;
  theme?: "light" | "dark";
  time_frames?: { text: string; resolution: string; description: string }[];
  time_scale?: { min_bar_spacing: number };
  timeframe?: string | { from: number; to: number };
  timezone?: "exchange" | string;
  toolbar_bg?: string;
  user_id?: string;
  width?: number;
  widgetbar?: WidgetbarOptions;
}
