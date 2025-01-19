import { LibrarySymbolInfo, ResolutionString } from "@/components/chart/types";

export interface CustomIndicator<Field = Record<string, unknown>> {
  name: string;
  metainfo: StudyMetaInfo;
  constructor: (
    this: LibraryPineStudyConstructor<Array<unknown>> & Field,
  ) => void;
}

interface ISymbolInstrument {
  /**
   * Close bar value.
   */
  close: number;

  /**
   * Currency code (optional).
   */
  currencyCode?: string;

  /**
   * High bar value.
   */
  high: number;

  /**
   * Index of the symbol.
   */
  index: number;

  /**
   * Symbol information (optional).
   */
  info?: LibrarySymbolInfo;

  /**
   * Bar interval.
   */
  interval: number;

  /**
   * Indicates whether the bar is closed.
   */
  isBarClosed: boolean;

  /**
   * Indicates whether this is the first bar.
   */
  isFirstBar: boolean;

  /**
   * Indicates whether this is the last bar.
   */
  isLastBar: boolean;

  /**
   * Indicates whether this is a new bar.
   */
  isNewBar: boolean;

  /**
   * Low bar value.
   */
  low: number;

  /**
   * Minimum tick amount.
   */
  minTick: number;

  /**
   * Open bar value.
   */
  open: number;

  /**
   * Bar resolution.
   */
  period: ResolutionString;

  /**
   * Period base.
   */
  periodBase: string;

  /**
   * Resolution of the bar.
   */
  resolution: string;

  /**
   * Symbol ticker.
   */
  ticker: string;

  /**
   * Ticker ID.
   */
  tickerid: string;

  /**
   * Time of the bar.
   */
  time: number;

  /**
   * Unit ID (optional).
   */
  unitId?: string;

  /**
   * Time of the update.
   */
  updatetime: number;

  /**
   * Bar volume value.
   */
  volume: number;

  /**
   * Returns the timestamp of the bar in milliseconds.
   */
  bartime(): number;

  /**
   * Returns true if the bar resolution is day/week/month, otherwise false.
   */
  isdwm(): boolean;
}

interface IContext {
  /**
   * The current symbol instrument.
   */
  symbol: ISymbolInstrument;

  /**
   * Checks if the given symbol is the main symbol.
   *
   * @param symbol - The symbol to check.
   * @returns `true` if the symbol is the main symbol, `false` otherwise.
   */
  is_main_symbol(symbol: ISymbolInstrument): boolean;

  /**
   * Creates a new execution context.
   *
   * @returns A new `IContext` instance.
   */
  new_ctx(): IContext;

  /**
   * Loads a new symbol for a custom indicator.
   *
   * @param tickerid - The symbol identifier.
   * @param period - The period for the new symbol.
   * @param currencyCode - (Optional) The currency code.
   * @param unitId - (Optional) The unit ID.
   * @param subsessionId - (Optional) The subsession ID.
   * @returns The new symbol instrument.
   */
  new_sym(
    tickerid: string,
    period: string,
    currencyCode?: string,
    unitId?: string,
    subsessionId?: string,
  ): ISymbolInstrument;

  /**
   * Creates an in-memory temporary storage with unlimited depth.
   *
   * @param value - (Optional) The initial value for the variable.
   * @returns An `IPineSeries` instance for managing values.
   */
  new_unlimited_var(value?: number): IPineSeries;

  /**
   * Creates an in-memory temporary storage with a depth defined by the first call.
   *
   * @param value - (Optional) The initial value for the variable.
   * @returns An `IPineSeries` instance for managing values.
   */
  new_var(value?: number): IPineSeries;

  /**
   * Switches the context to another symbol received through `IContext.new_sym`.
   *
   * @param i - The index of the symbol (0 for the main series).
   */
  select_sym(i: number): void;

  /**
   * Forces the minimum additional depth.
   *
   * @param value - The minimum depth to set.
   */
  setMinimumAdditionalDepth(value: number): void;
}

interface IPineSeries {
  /**
   * Map some values from one time scale to another.
   *
   * @param source - Source times (as a Pine series).
   * @param destination - Destination times (as a Pine series).
   * @param mode - Adopt mode.
   *               - 0: Continuous mode, every source time is mapped to a destination time if one exists.
   *               - 1: Precise mode, every source time is mapped to a destination time AT MOST ONCE.
   * @returns The adopted value at the destination series.
   */
  adopt(source: IPineSeries, destination: IPineSeries, mode: 0 | 1): number;

  /**
   * Get the value at a specific index.
   *
   * Note: The indices are reversed:
   * - `get(1)` returns the second last value.
   * - `get(2)` returns the third last value, and so on.
   *
   * @param n - The index of the value to retrieve.
   * @returns The value at the specified index.
   */
  get(n?: number): number;

  /**
   * Get the index for the bar at the specified timestamp.
   *
   * @param time - The timestamp to find the index for.
   * @returns The index corresponding to the given timestamp.
   */
  indexOf(time: number): number;

  /**
   * Set the value for the pine series at the current index iteration.
   *
   * @param value - The value to be set.
   */
  set(value: number): void;
}

export interface PineJS {
  Std: PineJSStd;
}

export interface LibraryPineStudyConstructor<TPineStudyResult> {
  _context: IContext;
  _input: <T = unknown>(index: number) => T;
  init: (ctx: IContext, inputs: <T = unknown>(index: number) => T) => void;
  main: (
    ctx: IContext,
    inputs: <T = unknown>(index: number) => T,
  ) => TPineStudyResult;
}

interface PineJSStd {
  /**
   * Checks if a value is zero.
   * @param v - The value to test.
   * @returns `1` if the value is zero, `0` otherwise.
   */
  isZero(v: number): number;

  /**
   * Absolute value of a number.
   * @param x - The input number.
   * @returns The absolute value of `x`.
   */
  abs(x: number): number;

  /**
   * Accumulation/distribution index.
   * @param context - The PineJS execution context.
   * @returns The accumulation/distribution index.
   */
  accdist(context: IContext): number;

  /**
   * Calculates the arccosine (acos) of a number.
   * @param x - The input value (must be in the range [-1, 1]).
   * @returns The arc cosine of `x` in radians, or `NaN` if `x` is outside the valid range.
   */
  acos(x: number): number;

  /**
   * Adds a number of days to a date while considering Daylight Savings Time.
   * @param timezone - The timezone to use.
   * @param utcTime - The starting UTC date.
   * @param daysCount - The number of days to add.
   * @returns The new date after adding `daysCount` days.
   */
  add_days_considering_dst(
    timezone: string,
    utcTime: Date,
    daysCount: number,
  ): Date;

  /**
   * Adds a number of years to a date while considering Daylight Savings Time.
   * @param timezone - The timezone to use.
   * @param utcTime - The starting UTC date.
   * @param yearsCount - The number of years to add.
   * @returns The new date after adding `yearsCount` years.
   */
  add_years_considering_dst(
    timezone: string,
    utcTime: Date,
    yearsCount: number,
  ): Date;

  /**
   * Arnaud Legoux Moving Average (ALMA).
   * @param series - The input series.
   * @param length - The number of bars.
   * @param offset - Controls the tradeoff between smoothness and responsiveness.
   * @param sigma - Adjusts the smoothness of ALMA.
   * @returns The ALMA value.
   */
  alma(
    series: IPineSeries,
    length: number,
    offset: number,
    sigma: number,
  ): number;

  /**
   * Logical AND operation.
   * @param n_0 - First operand.
   * @param n_1 - Second operand.
   * @returns `1` if both operands are truthy, `0` otherwise.
   */
  and(n_0: number, n_1: number): number;

  /**
   * Calculates the arcsine (asin) of a number.
   * @param x - The input value (must be in the range [-1, 1]).
   * @returns The arcsine of `x` in radians, or `NaN` if `x` is outside the valid range.
   */
  asin(x: number): number;

  /**
   * Calculates the arctangent (atan) of a number.
   * @param x - The input value.
   * @returns The arctangent of `x` in radians.
   */
  atan(x: number): number;

  /**
   * Calculates the Average True Range (ATR).
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The average true range.
   */
  atr(length: number, context: IContext): number;

  /**
   * Calculates the average of multiple values.
   * @param values - A series of numbers.
   * @returns The average of the input values.
   */
  avg(...values: number[]): number;

  /**
   * Rounds a number up to the nearest integer.
   * @param x - The input value.
   * @returns The smallest integer greater than or equal to `x`.
   */
  ceil(x: number): number;

  /**
   * Calculates the difference between the current value and the previous value in a series.
   * @param source - The input series.
   * @returns The difference between the current and previous value.
   */
  change(source: IPineSeries): number;

  /**
   * Retrieves the close price of the current bar.
   * @param context - The PineJS execution context.
   * @returns The current close price.
   */
  close(context: IContext): number;

  /**
   * Compares two numbers with an optional epsilon for precision.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @param eps - (Optional) The precision tolerance.
   * @returns `0` if `n1` equals `n2`, `1` if `n1 > n2`, `-1` if `n1 < n2`.
   */
  compare(n1: number, n2: number, eps?: number): -1 | 0 | 1;

  /**
   * Calculates the correlation coefficient between two series.
   * @param sourceA - The first series.
   * @param sourceB - The second series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The correlation coefficient.
   */
  correlation(
    sourceA: IPineSeries,
    sourceB: IPineSeries,
    length: number,
    context: IContext,
  ): number;

  /**
   * Calculates the cosine of an angle in radians.
   * @param x - The angle in radians.
   * @returns The cosine of the angle.
   */
  cos(x: number): number;

  /**
   * Creates a function to check if a new session can be created.
   * @param context - The PineJS execution context.
   * @returns A function that takes a time value and returns `true` if a new session can be created.
   */
  createNewSessionCheck(context: IContext): (time: number) => boolean;

  /**
   * Checks if two series have crossed each other.
   * @param n_0 - The first series.
   * @param n_1 - The second series.
   * @param context - The PineJS execution context.
   * @returns `true` if the two series have crossed, `false` otherwise.
   */
  cross(n_0: number, n_1: number, context: IContext): boolean;

  /**
   * Cumulative (total) sum, tracking previous values internally.
   * @param n_value - The value to add to the sum.
   * @param context - The PineJS execution context.
   * @returns The cumulative sum.
   */
  cum(n_value: number, context: IContext): number;

  /**
   * Retrieves the currency code for the current symbol.
   * @param ctx - The PineJS execution context.
   * @returns The symbol's currency code as a string.
   */
  currencyCode(ctx: IContext): string;

  /**
   * Retrieves the day of the month for the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) The specific time. Defaults to the current bar time.
   * @returns The day of the month (1-31).
   */
  dayofmonth(context: IContext, time?: number): number;

  /**
   * Retrieves the day of the week for the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) The specific time. Defaults to the current bar time.
   * @returns The day of the week (1-7, where 1 is Monday).
   */
  dayofweek(context: IContext, time?: number): number;

  /**
   * Measures the difference between a series and its simple moving average (sma).
   * @param source - The input series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The deviation from the SMA.
   */
  dev(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the directional movement index (+DI, -DI, DX, ADX, ADXR).
   * @param diLength - The number of bars used for +DI and -DI calculations.
   * @param adxSmoothingLength - The smoothing length for ADX calculations.
   * @param context - The PineJS execution context.
   * @returns An array of [ +DI, -DI, DX, ADX, ADXR ].
   */
  dmi(
    diLength: number,
    adxSmoothingLength: number,
    context: IContext,
  ): [number, number, number, number, number];

  /**
   * Exponential Moving Average (EMA).
   * @param source - The input series.
   * @param length - The number of bars for calculation.
   * @param context - The PineJS execution context.
   * @returns The EMA value.
   */
  ema(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the machine epsilon, the smallest number that can be added to 1 to produce a distinct number.
   * @returns The machine epsilon value.
   */
  eps(): number;

  /**
   * Checks if two numbers are equal.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @returns `1` if the numbers are equal, `0` otherwise.
   */
  eq(n1: number, n2: number): number;

  /**
   * Checks if two numbers are approximately equal within a given epsilon.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @param eps - (Optional) The precision tolerance.
   * @returns `true` if the numbers are approximately equal, `false` otherwise.
   */
  equal(n1: number, n2: number, eps?: number): boolean;

  /**
   * Displays an error message and stops execution.
   * @param message - The error message to display.
   * @returns This function does not return a value.
   */
  error(message: string): never;

  /**
   * Calculates e raised to the power of a number.
   * @param x - The input number.
   * @returns The value of e^x.
   */
  exp(x: number): number;

  /**
   * Checks if a series is falling over a given number of bars.
   * @param series - The input series.
   * @param length - The number of bars to evaluate.
   * @returns `true` if the series is falling, `false` otherwise.
   */
  falling(series: IPineSeries, length: number): boolean;

  /**
   * Replaces `NaN` values in a series with the nearest non-`NaN` value.
   * @param n_current - The input series.
   * @param context - The PineJS execution context.
   * @returns A series without `NaN` gaps.
   */
  fixnan(n_current: number, context: IContext): number;

  /**
   * Rounds a number down to the nearest integer.
   * @param x - The input number.
   * @returns The largest integer less than or equal to `x`.
   */
  floor(x: number): number;

  /**
   * Checks if the first number is greater than or equal to the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @returns `1` if `n1 >= n2`, `0` otherwise.
   */
  ge(n1: number, n2: number): number;

  /**
   * Checks if the first number is greater than the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @param eps - (Optional) The precision tolerance.
   * @returns `true` if `n1 > n2`, `false` otherwise.
   */
  greater(n1: number, n2: number, eps?: number): boolean;

  /**
   * Checks if the first number is greater than or equal to the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @param eps - (Optional) The precision tolerance.
   * @returns `true` if `n1 >= n2`, `false` otherwise.
   */
  greaterOrEqual(n1: number, n2: number, eps?: number): boolean;

  /**
   * Checks if the first number is greater than the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @returns `1` if `n1 > n2`, `0` otherwise.
   */
  gt(n1: number, n2: number): number;

  /**
   * Retrieves the high price of the current bar.
   * @param context - The PineJS execution context.
   * @returns The current high price.
   */
  high(context: IContext): number;

  /**
   * Retrieves the highest value for a given number of bars back.
   * @param source - The input series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The highest value.
   */
  highest(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the bar offset to the highest value for a given number of bars back.
   * @param source - The input series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The offset to the highest bar.
   */
  highestbars(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the average of the high and low prices of the current bar.
   * @param context - The PineJS execution context.
   * @returns The average of the high and low prices.
   */
  hl2(context: IContext): number;

  /**
   * Calculates the average of the high, low, and close prices of the current bar.
   * @param context - The PineJS execution context.
   * @returns The average of the high, low, and close prices.
   */
  hlc3(context: IContext): number;

  /**
   * Retrieves the hour of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) Specific time. Defaults to the current bar time.
   * @returns The hour of the current bar (0-23).
   */
  hour(context: IContext, time?: number): number;

  /**
   * Performs a conditional evaluation. Equivalent to the ternary operator `condition ? thenValue : elseValue`.
   * @param condition - The condition to check.
   * @param thenValue - The value if the condition is true.
   * @param elseValue - The value if the condition is false.
   * @returns Either `thenValue` or `elseValue`.
   */
  iff(condition: number, thenValue: number, elseValue: number): number;

  /**
   * Retrieves the interval of the current symbol.
   * @param ctx - The PineJS execution context.
   * @returns The symbol interval.
   */
  interval(ctx: IContext): number;

  /**
   * Determines if the current resolution is a daily resolution.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is daily, `false` otherwise.
   */
  isdaily(context: IContext): boolean;

  /**
   * Determines if the current resolution is daily, weekly, or monthly.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is daily, weekly, or monthly, `false` otherwise.
   */
  isdwm(context: IContext): boolean;

  /**
   * Determines if the current resolution is intraday (minutes or seconds).
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is intraday, `false` otherwise.
   */
  isintraday(context: IContext): boolean;

  /**
   * Determines if the current resolution is monthly.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is monthly, `false` otherwise.
   */
  ismonthly(context: IContext): boolean;

  /**
   * Determines if the current resolution is weekly.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is weekly, `false` otherwise.
   */
  isweekly(context: IContext): boolean;

  /**
   * Checks if the first number is less than or equal to the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @returns `1` if `n1 <= n2`, `0` otherwise.
   */
  le(n1: number, n2: number): number;

  /**
   * Checks if the first number is less than the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @param eps - (Optional) The precision tolerance.
   * @returns `true` if `n1 < n2`, `false` otherwise.
   */
  less(n1: number, n2: number, eps?: number): boolean;

  /**
   * Checks if the first number is less than or equal to the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @param eps - (Optional) The precision tolerance.
   * @returns `true` if `n1 <= n2`, `false` otherwise.
   */
  lessOrEqual(n1: number, n2: number, eps?: number): boolean;

  /**
   * Generates a linear regression curve for a specified period.
   * @param source - The input series.
   * @param length - The number of bars for calculation.
   * @param offset - The number of bars for offset.
   * @returns The linear regression value.
   */
  linreg(source: IPineSeries, length: number, offset: number): number;

  /**
   * Calculates the natural logarithm of a number.
   * @param x - The input number.
   * @returns The natural logarithm of `x`.
   */
  log(x: number): number;

  /**
   * Calculates the base-10 logarithm of a number.
   * @param x - The input number.
   * @returns The base-10 logarithm of `x`.
   */
  log10(x: number): number;

  /**
   * Retrieves the low price of the current bar.
   * @param context - The PineJS execution context.
   * @returns The current low price.
   */
  low(context: IContext): number;

  /**
   * Retrieves the lowest value for a given number of bars back.
   * @param source - The input series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The lowest value.
   */
  lowest(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the bar offset to the lowest value for a given number of bars back.
   * @param source - The input series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The offset to the lowest bar.
   */
  lowestbars(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Checks if the first number is less than the second.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @returns `1` if `n1 < n2`, `0` otherwise.
   */
  lt(n1: number, n2: number): number;

  /**
   * Finds the maximum value among the given numbers.
   * @param values - A list of numbers.
   * @returns The largest number in the list.
   */
  max(...values: number[]): number;

  /**
   * Finds the minimum value among the given numbers.
   * @param values - A list of numbers.
   * @returns The smallest number in the list.
   */
  min(...values: number[]): number;

  /**
   * Retrieves the minute of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) Specific time. Defaults to the current bar time.
   * @returns The minute of the current bar (0-59).
   */
  minute(context: IContext, time?: number): number;

  /**
   * Retrieves the month of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) Specific time. Defaults to the current bar time.
   * @returns The current bar's month (1-12).
   */
  month(context: IContext, time?: number): number;

  /**
   * Retrieves the current bar index.
   * @param context - The PineJS execution context.
   * @returns The zero-based index of the current bar.
   */
  n(context: IContext): number;

  /**
   * Checks if the provided value is `NaN`.
   * @param n - The value to check.
   * @returns `1` if the value is `NaN`, otherwise `0`.
   */
  na(n?: number): boolean;

  /**
   * Checks if two numbers are not equal.
   * @param n1 - The first number.
   * @param n2 - The second number.
   * @returns `1` if the numbers are not equal, `0` otherwise.
   */
  neq(n1: number, n2: number): number;

  /**
   * Performs a logical NOT operation.
   * @param n - The input value.
   * @returns `1` if the value is falsy, otherwise `0`.
   */
  not(n_0: number): number;

  /**
   * Replaces `NaN` values with zeros or a fallback value in a series.
   * @param x - The value to test.
   * @param y - (Optional) The fallback value. Defaults to `0`.
   * @returns The original value if valid, otherwise the fallback.
   */
  nz(x: number, y?: number): number;

  /**
   * Calculates the average of open, high, low, and close prices of the current bar.
   * @param context - The PineJS execution context.
   * @returns The average of OHLC values.
   */
  ohlc4(context: IContext): number;

  /**
   * Retrieves the opening price of the current bar.
   * @param context - The PineJS execution context.
   * @returns The opening price.
   */
  open(context: IContext): number;

  /**
   * Performs a logical OR operation.
   * @param n1 - The first value.
   * @param n2 - The second value.
   * @returns `1` if either value is truthy, otherwise `0`.
   */
  or(n_0: number, n_1: number): number;

  /**
   * Calculates the percent rank of a value in the series for a specified length.
   * @param source - The series of values.
   * @param length - The number of bars back.
   * @returns The percent rank of the current value.
   */
  percentrank(source: IPineSeries, length: number): number;

  /**
   * Retrieves the resolution string for the current context.
   * @param context - The PineJS execution context.
   * @returns The resolution (e.g., "D" for daily, "M" for monthly).
   */
  period(context: IContext): string;

  /**
   * Raises a base number to the power of an exponent.
   * @param base - The base number.
   * @param exponent - The power to raise the base to.
   * @returns The result of `base^exponent`.
   */
  pow(base: number, exponent: number): number;

  /**
   * Tests if the series is now rising for a specified number of bars.
   * @param series - The input series.
   * @param length - The number of bars to test.
   * @returns `1` if the series is rising, otherwise `0`.
   */
  rising(series: IPineSeries, length: number): number;

  /**
   * Calculates the RMA (used in RSI calculations) of a series.
   * @param source - The series of values.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The RMA value.
   */
  rma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the rate of change (ROC) for a series over a specified length.
   * @param source - The series of values.
   * @param length - The number of bars back.
   * @returns The rate of change.
   */
  roc(source: IPineSeries, length: number): number;

  /**
   * Rounds a number to the nearest integer.
   * @param x - The input number.
   * @returns The rounded integer.
   */
  round(x: number): number;

  /**
   * Calculates the Relative Strength Index (RSI).
   * @param upper - Upward change in the series.
   * @param lower - Downward change in the series.
   * @returns The RSI value.
   */
  rsi(upper: number, lower: number): number;

  /**
   * Calculates the Parabolic SAR (Stop and Reverse) value.
   * @param start - Start value for the SAR calculation.
   * @param inc - Increment value.
   * @param max - Maximum increment value.
   * @param context - The PineJS execution context.
   * @returns The SAR value.
   */
  sar(start: number, inc: number, max: number, context: IContext): number;

  /**
   * Retrieves the second of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) Specific time. Defaults to the current bar time.
   * @returns The current bar second (0-59).
   */
  second(context: IContext, time?: number): number;

  /**
   * Selects session breaks for intraday resolutions only.
   * @param context - The PineJS execution context.
   * @param times - An array of times to select session breaks from.
   * @returns An array of session break times.
   */
  selectSessionBreaks(context: IContext, times: number[]): number[];

  /**
   * Returns the sign of a number.
   * @param x - The input number.
   * @returns `1` if positive, `-1` if negative, `0` if zero.
   */
  sign(x: number): number;

  /**
   * Calculates the sine of an angle in radians.
   * @param x - The angle in radians.
   * @returns The sine of the angle.
   */
  sin(x: number): number;

  /**
   * Calculates the Simple Moving Average (SMA).
   * @param source - The series of values.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The SMA value.
   */
  sma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the Smoothed Moving Average (SMMA).
   * @param n_value - The next value in the series to calculate.
   * @param n_length - The smoothing length.
   * @param ctx - The PineJS execution context.
   * @returns The SMMA value.
   */
  smma(n_value: number, n_length: number, ctx: IContext): number;

  /**
   * Calculates the square root of a non-negative number.
   * @param x - The input number.
   * @returns The square root of the number.
   */
  sqrt(x: number): number;

  /**
   * Calculates the standard deviation of a series.
   * Note: This is a biased estimation of standard deviation.
   * @param source - The series of values.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The standard deviation value.
   */
  stdev(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the Stochastic oscillator value.
   * Formula: `100 * (close - lowest(low, length)) / (highest(high, length) - lowest(low, length))`
   * @param source - The close price series.
   * @param high - The high price series.
   * @param low - The low price series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The Stochastic oscillator value.
   */
  stoch(
    source: IPineSeries,
    high: IPineSeries,
    low: IPineSeries,
    length: number,
    context: IContext,
  ): number;

  /**
   * Calculates the sliding sum of the last `y` values of a series.
   * @param source - The series of values.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The sum of the values.
   */
  sum(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the symmetrically weighted moving average with a fixed length of 4.
   * Weights: `[1/6, 2/6, 2/6, 1/6]`.
   * @param source - The series of values.
   * @param context - The PineJS execution context.
   * @returns The SWMA value.
   */
  swma(source: IPineSeries, context: IContext): number;

  /**
   * Calculates the tangent of an angle in radians.
   * @param x - The angle in radians.
   * @returns The tangent of the angle.
   */
  tan(x: number): number;

  /**
   * Retrieves the ticker ID for the current symbol.
   * @param context - The PineJS execution context.
   * @returns The ticker ID as a string.
   */
  ticker(context: IContext): string;

  /**
   * Retrieves the ticker ID of the current symbol.
   * @param context - The PineJS execution context.
   * @returns The ticker ID as a string.
   */
  tickerid(context: IContext): string;

  /**
   * Retrieves the UNIX time of the current bar according to the symbol timezone.
   * @param context - The PineJS execution context.
   * @returns The UNIX time of the current bar.
   */
  time(context: IContext): number;

  /**
   * Retrieves the UNIX time of the current bar according to the symbol timezone for a given period.
   * @param context - The PineJS execution context.
   * @param period - The specified period.
   * @returns The UNIX time of the current bar.
   */
  time(context: IContext, period: string): number;

  /**
   * Converts a number to a boolean.
   * @param v - The number to convert.
   * @returns `true` if the number is finite and non-zero, `false` otherwise.
   */
  toBool(v: number): boolean;

  /**
   * Calculates the True Range (TR) of a series.
   * @param n_handleNaN - Determines how `NaN` values are handled.
   * @param ctx - The PineJS execution context.
   * @returns The true range, calculated as:
   * - `max(high - low, abs(high - close[1]), abs(low - close[1]))`
   */
  tr(n_handleNaN: number, ctx: IContext): number;

  /**
   * Calculates the True Strength Index (TSI).
   * Uses moving averages of the underlying momentum of a financial instrument.
   * @param source - The series of values.
   * @param shortLength - The short moving average length.
   * @param longLength - The long moving average length.
   * @param context - The PineJS execution context.
   * @returns The TSI value in the range [-1, 1].
   */
  tsi(
    source: IPineSeries,
    shortLength: number,
    longLength: number,
    context: IContext,
  ): number;

  /**
   * Retrieves the unit ID of the current symbol.
   * @param ctx - The PineJS execution context.
   * @returns The unit ID as a string.
   */
  unitId(ctx: IContext): string;

  /**
   * Retrieves the time of the current update.
   * @param context - The PineJS execution context.
   * @returns The UNIX time of the last update for the current symbol.
   */
  updatetime(context: IContext): number;

  /**
   * Calculates the variance of a series.
   * Note: This is a biased estimation of sample variance.
   * @param source - The series of values to process.
   * @param length - The number of bars back to consider.
   * @param context - The PineJS execution context.
   * @returns The variance of the series.
   */
  variance(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the current bar volume.
   * @param context - The PineJS execution context.
   * @returns The volume of the current bar.
   */
  volume(context: IContext): number;

  /**
   * Calculates the Volume Weighted Moving Average (VWMA).
   * Formula: `sma(source * volume, length) / sma(volume, length)`
   * @param source - The series of values to process.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The VWMA value.
   */
  vwma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the week number of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) Specific time to evaluate. Defaults to the current bar time.
   * @returns The week number.
   */
  weekofyear(context: IContext, time?: number): number;

  /**
   * Calculates the Weighted Moving Average (WMA).
   * Weights decrease arithmetically as the index moves back in time.
   * @param source - The series of values to process.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The WMA value.
   */
  wma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the year of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) Specific time. Defaults to the current bar time.
   * @returns The current year.
   */
  year(context: IContext, time?: number): number;

  /**
   * Calculates the Zig-Zag pivot points.
   * @param n_deviation - The deviation threshold for pivots.
   * @param n_depth - The depth threshold for pivots.
   * @param context - The PineJS execution context.
   * @returns The Zig-Zag pivot points.
   */
  zigzag(n_deviation: number, n_depth: number, context: IContext): number;

  /**
   * Calculates the Zig-Zag pivot points for bars.
   * @param n_deviation - The deviation threshold for pivots.
   * @param n_depth - The depth threshold for pivots.
   * @param context - The PineJS execution context.
   * @returns The Zig-Zag pivot points (for bars).
   */
  zigzagbars(n_deviation: number, n_depth: number, context: IContext): number;

  /**
   * Checks whether a value is zero.
   * @param v - The value to test.
   * @returns `1` if the value is zero, `0` otherwise.
   */
  isZero(v: number): number;

  /**
   * Retrieves the default maximum size of a PineJS series.
   * @returns The maximum size as a constant value (`10001`).
   */
  max_series_default_size(): number;

  /**
   * Checks if a specified time is a new session for intraday resolutions.
   * @param context - The PineJS execution context.
   * @param time - The time to check.
   * @returns `true` if the time represents a new session; `false` otherwise.
   */
  createNewSessionCheck(context: IContext): (time: number) => boolean;

  /**
   * Calculates the period of a given symbol in the current context.
   * @param context - The PineJS execution context.
   * @returns The resolution string (e.g., `"60"` for minutes, `"D"` for daily).
   */
  period(context: IContext): string;

  /**
   * Checks if the current resolution is daily.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is daily; otherwise `false`.
   */
  isdaily(context: IContext): boolean;

  /**
   * Checks if the current resolution is daily, weekly, or monthly.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is one of the specified intervals.
   */
  isdwm(context: IContext): boolean;

  /**
   * Checks if the current resolution is intraday (minute/second-based).
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is intraday; otherwise `false`.
   */
  isintraday(context: IContext): boolean;

  /**
   * Checks if the current resolution is monthly.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is monthly; otherwise `false`.
   */
  ismonthly(context: IContext): boolean;

  /**
   * Checks if the current resolution is weekly.
   * @param context - The PineJS execution context.
   * @returns `true` if the resolution is weekly; otherwise `false`.
   */
  isweekly(context: IContext): boolean;

  /**
   * Calculates the interval of the current symbol.
   * @param ctx - The PineJS execution context.
   * @returns The interval (e.g., `"1D"` for daily, `"60"` for hourly).
   */
  interval(ctx: IContext): number;

  /**
   * Rounds a number to the nearest integer.
   * Ties are rounded up to the nearest even number.
   * @param x - The number to round.
   * @returns The rounded number.
   */
  round(x: number): number;

  /**
   * Calculates the relative strength index (RSI).
   * RSI = 100 - (100 / (1 + RS)), where RS = average gain / average loss.
   * @param upper - The upward change in value.
   * @param lower - The downward change in value.
   * @returns The RSI value as a percentage (0-100).
   */
  rsi(upper: number, lower: number): number;

  /**
   * Calculates the Parabolic Stop and Reverse (SAR).
   * @param start - The starting acceleration factor.
   * @param inc - The increment acceleration factor.
   * @param max - The maximum acceleration factor.
   * @param context - The PineJS execution context.
   * @returns The Parabolic SAR value.
   */
  sar(start: number, inc: number, max: number, context: IContext): number;

  /**
   * Retrieves the second of the current bar time in the exchange timezone.
   * @param context - The PineJS execution context.
   * @param time - (Optional) A specific time to evaluate.
   * @returns The second value.
   */
  second(context: IContext, time?: number): number;

  /**
   * Filters session breaks for intraday resolutions.
   * @param context - The PineJS execution context.
   * @param times - Array of times to filter session breaks from.
   * @returns An array of session break times.
   */
  selectSessionBreaks(context: IContext, times: number[]): number[];

  /**
   * Returns the sign of a number.
   * @param x - The input number.
   * @returns `1` if positive, `-1` if negative, `0` if zero.
   */
  sign(x: number): number;

  /**
   * Calculates the sine of an angle in radians.
   * @param x - The angle in radians.
   * @returns The sine value of the angle.
   */
  sin(x: number): number;

  /**
   * Calculates the simple moving average (SMA).
   * SMA = Sum of values / Number of values.
   * @param source - The series of values to process.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The SMA value.
   */
  sma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the smoothed moving average (SMMA).
   * SMMA uses cumulative smoothing to calculate the average.
   * @param n_value - The next value in the series to calculate.
   * @param n_length - The smoothing length.
   * @param ctx - The PineJS execution context.
   * @returns The SMMA value.
   */
  smma(n_value: number, n_length: number, ctx: IContext): number;

  /**
   * Calculates the square root of a number.
   * @param x - The number to calculate.
   * @returns The square root of `x`.
   */
  sqrt(x: number): number;

  /**
   * Calculates the standard deviation of a series.
   * Note: This is a biased estimation of standard deviation.
   * @param source - The series of values to process.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The standard deviation.
   */
  stdev(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the stochastic value.
   * Formula: `100 * (close - lowest) / (highest - lowest)`.
   * @param source - The close series.
   * @param high - The high series.
   * @param low - The low series.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The stochastic value.
   */
  stoch(
    source: IPineSeries,
    high: IPineSeries,
    low: IPineSeries,
    length: number,
    context: IContext,
  ): number;

  /**
   * Calculates the sliding sum of the last `n` values of a series.
   * @param source - The series of values to process.
   * @param length - The number of bars back.
   * @param context - The PineJS execution context.
   * @returns The sum.
   */
  sum(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Calculates the symmetrically weighted moving average (SWMA).
   * Fixed length of 4 with weights `[1/6, 2/6, 2/6, 1/6]`.
   * @param source - The series of values to process.
   * @param context - The PineJS execution context.
   * @returns The SWMA value.
   */
  swma(source: IPineSeries, context: IContext): number;

  /**
   * Calculates the tangent of an angle in radians.
   * @param x - The angle in radians.
   * @returns The tangent of the angle.
   */
  tan(x: number): number;

  /**
   * Retrieves the ticker ID for the current symbol.
   * @param context - The PineJS execution context.
   * @returns The ticker ID as a string.
   */
  ticker(context: IContext): string;

  /**
   * Retrieves the ticker ID for the current symbol (alias for `ticker`).
   * @param context - The PineJS execution context.
   * @returns The ticker ID as a string.
   */
  tickerid(context: IContext): string;

  /**
   * Retrieves the current bar time.
   * @param context - The PineJS execution context.
   * @param period - (Optional) The period to evaluate.
   * @returns The UNIX time of the current bar according to the symbol timezone.
   */
  time(context: IContext, period?: string): number;

  /**
   * Converts a number to a boolean.
   * @param v - The value to convert.
   * @returns `true` if the number is finite and non-zero, `false` otherwise.
   */
  toBool(v: number): boolean;

  /**
   * Calculates the True Range (TR).
   * Formula: `max(high - low, abs(high - close[1]), abs(low - close[1]))`.
   * @param n_handleNaN - Determines how NaN values are handled.
   * @param ctx - The PineJS execution context.
   * @returns The true range.
   */
  tr(n_handleNaN: number, ctx: IContext): number;

  /**
   * Calculates the True Strength Index (TSI) based on short and long length averages of momentum.
   */
  tsi(
    source: IPineSeries,
    shortLength: number,
    longLength: number,
    context: IContext,
  ): number;

  /**
   * Retrieves the unit ID of the current symbol.
   */
  unitId(ctx: IContext): string;

  /**
   * Retrieves the time of the current update.
   */
  updatetime(context: IContext): number;

  /**
   * Computes the variance of a series over a given length.
   */
  variance(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the current bar's volume.
   */
  volume(context: IContext): number;

  /**
   * Calculates the volume-weighted moving average (VWMA) of a source series over a specified length.
   */
  vwma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the week number of the current bar's time in exchange timezone.
   */
  weekofyear(context: IContext, time?: number): number;

  /**
   * Calculates the Weighted Moving Average (WMA) of a source series over a specified length.
   */
  wma(source: IPineSeries, length: number, context: IContext): number;

  /**
   * Retrieves the year of the current bar's time in exchange timezone.
   */
  year(context: IContext, time?: number): number;

  /**
   * Calculates zig-zag pivot points based on deviation and depth.
   */
  zigzag(n_deviation: number, n_depth: number, context: IContext): number;

  /**
   * Retrieves the zig-zag pivot points for bars based on deviation and depth.
   */
  zigzagbars(n_deviation: number, n_depth: number, context: IContext): number;
}

interface StudyMetaInfo {
  _metainfoVersion: 53;
  isCustomIndicator: boolean;
  id: string;
  description: string;
  shortDescription: string;
  inputs: Array<StudyInputInfo>;
  defaults: Partial<StudyMetaInfoDefaults>;
  is_price_study?: boolean;
  is_hidden_study?: boolean;
  financialPeriod?: "FY" | "FQ" | "FH" | "TTM";
  format?:
    | { type: "inherit" }
    | { precision?: number; type: "percent" | "price" | "volume" };
  linkedToSeries?: boolean;
  name?: string;
  palettes?: Record<string, StudyPalettesInfo>;
  plots: Array<StudyPlotInformation>;
  priceScale?: StudyTargetPriceScale;
  // Can't be changed from UI, Any additional value that can be changed will be in defaults
  styles?: Record<string, StudyStylesInfo>;
  symbolSource?: SymbolInputSymbolSource;
  behind_chart?: boolean;
}

interface StudyMetaInfoDefaults {
  inputs: Record<string, string | number | boolean>;
  precision: string | number;
  styles: Record<string, StudyPlotPreferences>;
  palettes: Record<string, StudyPaletteStyle>;
}

type StudyInputInfo = (
  | StudyBooleanInputInfo
  | StudyTextInputInfo
  | StudySymbolInputInfo
  | StudyResolutionInputInfo
  | StudySessionInputInfo
  | StudySourceInputInfo
  | StudyNumericInputInfo
  | StudyPriceInputInfo
  | StudyColorInputInfo
  | StudyTimeInputInfo
  | StudyBarTimeInputInfo
  | StudyTextareaInputInfo
) & {
  group?: string;
  inline?: string;
  display?: number;
  isFake?: boolean;
  migrate?: boolean;
};

/**
 * Enumeration representing various input types for a study or plot.
 */
export enum StudyInputType {
  Color = "color",
  Source = "source",
}

interface StudyBooleanInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the input.
   */
  readonly defval: boolean;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * The input type, which is Boolean in this case.
   */
  readonly type: "bool";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyTextInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the input.
   */
  readonly defval: string;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Options for the text input.
   */
  readonly options?: string[];

  /**
   * Options for the titles of the text input.
   */
  readonly optionsTitles?: Record<string, string>;

  /**
   * The input type, which is Text in this case.
   */
  readonly type: "text";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudySymbolInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the input.
   */
  readonly defval?: string;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Indicates whether the input is optional.
   */
  readonly optional?: boolean;

  /**
   * The input type, which is Symbol in this case.
   */
  readonly type: "symbol";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyResolutionInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the resolution input.
   */
  readonly defval: ResolutionString;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Indicates whether this input is a multi-timeframe (MTF) resolution.
   */
  readonly isMTFResolution?: boolean;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Options for the resolution input.
   */
  readonly options?: string[];

  /**
   * Titles for the options in the resolution input.
   */
  readonly optionsTitles?: Record<string, string>;

  /**
   * The input type, which is Resolution in this case.
   */
  readonly type: "resolution";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudySessionInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the session input.
   */
  readonly defval: string;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Options for the session input.
   */
  readonly options?: string[];

  /**
   * Titles for the options in the session input.
   */
  readonly optionsTitles?: Record<string, string>;

  /**
   * The input type, which is "Session" in this case.
   */
  readonly type: "session";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudySourceInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the source input.
   */
  readonly defval: string;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Options for the source input.
   */
  readonly options?: string[];

  /**
   * Titles for the options in the source input.
   */
  readonly optionsTitles?: Record<string, string>;

  /**
   * The input type, which is "Source" in this case.
   */
  readonly type: "source";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyNumericInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the numeric input.
   */
  readonly defval: number;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Maximum allowed value for the input.
   */
  readonly max?: number;

  /**
   * Minimum allowed value for the input.
   */
  readonly min?: number;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Step size for the numeric value.
   */
  readonly step?: number;

  /**
   * Type of the numeric input, which can be "Integer", "Float", or "Price".
   */
  readonly type: "integer" | "float" | "price";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyPriceInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default value for the price input.
   */
  readonly defval: number;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Maximum allowed value for the input.
   */
  readonly max?: number;

  /**
   * Minimum allowed value for the input.
   */
  readonly min?: number;

  /**
   * Title of the input.
   */
  readonly name: string;

  /**
   * Step size for the price value.
   */
  readonly step?: number;

  /**
   * Type of the price input. It is always "Price".
   */
  readonly type: "price";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyColorInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default color value for the input (e.g., a HEX color code like "#FF0000").
   */
  readonly defval: string;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title or label for the input.
   */
  readonly name: string;

  /**
   * Specifies the type of input as "Color".
   */
  readonly type: "color";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyTimeInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default time value for the input, typically represented as a timestamp.
   */
  readonly defval: number;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Maximum time value allowed for the input.
   */
  readonly max: number;

  /**
   * Minimum time value allowed for the input.
   */
  readonly min: number;

  /**
   * Title or label for the input.
   */
  readonly name: string;

  /**
   * Specifies the type of input as "Time".
   */
  readonly type: "time";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyBarTimeInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default bar time value for the input, typically represented as a timestamp.
   */
  readonly defval: number;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Maximum bar time value allowed for the input.
   */
  readonly max: number;

  /**
   * Minimum bar time value allowed for the input.
   */
  readonly min: number;

  /**
   * Title or label for the input.
   */
  readonly name: string;

  /**
   * Specifies the type of input as "BarTime".
   */
  readonly type: "bar_time";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

interface StudyTextareaInputInfo {
  /**
   * If true, the user will be asked to confirm the input value before the indicator is added to the chart.
   * Default value is false.
   */
  readonly confirm?: boolean;

  /**
   * Default text value for the textarea input.
   */
  readonly defval: string;

  /**
   * An array of plot IDs; if these plots are hidden, this input should also be hidden within the legend.
   */
  readonly hideWhenPlotsHidden?: string[];

  /**
   * Unique ID for the input.
   */
  readonly id: string;

  /**
   * Determines if the input is hidden.
   */
  readonly isHidden?: boolean;

  /**
   * Title or label for the input.
   */
  readonly name: string;

  /**
   * Specifies the type of input as "Textarea".
   */
  readonly type: "text_area";

  /**
   * Determines if the input is visible.
   */
  readonly visible?: string;
}

type StudyPlotPreferences =
  | StudyLinePlotPreferences
  | StudyShapesPlotPreferences
  | StudyArrowsPlotPreferences
  | StudyCharsPlotPreferences;

export enum StudyPlotDisplayMode {
  None = 0,
  Pane = 1,
  DataWindow = 2,
  PriceScale = 4,
  StatusLine = 8,
  All = 15,
}

export enum LineStyle {
  Solid = 0,
  Dotted = 1,
  Dashed = 2,
}

export enum LineStudyPlotStyle {
  /**
   * Line plot style.
   */
  Line = 0,

  /**
   * Histogram plot style.
   */
  Histogram = 1,

  /**
   * Cross plot style.
   */
  Cross = 3,

  /**
   * Area plot style.
   */
  Area = 4,

  /**
   * Column plot style.
   */
  Columns = 5,

  /**
   * Circles plot style.
   */
  Circles = 6,

  /**
   * Line with breaks plot style.
   */
  LineWithBreaks = 7,

  /**
   * Area with breaks plot style.
   */
  AreaWithBreaks = 8,

  /**
   * Step line plot style.
   */
  StepLine = 9,

  /**
   * Step line with diamonds plot style.
   */
  StepLineWithDiamonds = 10,

  /**
   * Step line with breaks, similar to LineWithBreaks.
   */
  StepLineWithBreaks = 11,
}

interface StudyLinePlotPreferences {
  /**
   * Line color in any valid CSS color format (e.g., "#FF0000" for red).
   */
  color: string;

  /**
   * Display mode of the plot. Determines how the plot is displayed on the chart.
   * For example, `StudyPlotDisplayMode.None` to hide the plot.
   */
  display?: StudyPlotDisplayMode;

  /**
   * Line style for the plot, e.g., solid, dashed, dotted.
   */
  linestyle: LineStyle;

  /**
   * Line width in pixels.
   */
  linewidth: number;

  /**
   * Plot style, defining the type of line study.
   */
  plottype: LineStudyPlotStyle;

  /**
   * If defined, specifies the number of most recent bars to display on the chart.
   */
  readonly showLast?: number;

  /**
   * Whether to display the price line associated with this plot.
   */
  trackPrice: boolean;

  /**
   * Transparency of the line. A value between 1 (completely opaque) and 100 (completely transparent).
   */
  transparency: number;

  /**
   * Determines if the plot is visible.
   */
  visible?: boolean;
}

enum MarkLocation {
  /**
   * Position above the bar.
   */
  AboveBar = "AboveBar",

  /**
   * Absolute positioning.
   */
  Absolute = "Absolute",

  /**
   * Absolute positioning downwards.
   */
  AbsoluteDown = "AbsoluteDown",

  /**
   * Absolute positioning upwards.
   */
  AbsoluteUp = "AbsoluteUp",

  /**
   * Position below the bar.
   */
  BelowBar = "BelowBar",

  /**
   * Position at the bottom.
   */
  Bottom = "Bottom",

  /**
   * Position to the left.
   */
  Left = "Left",

  /**
   * Position to the right.
   */
  Right = "Right",

  /**
   * Position at the top.
   */
  Top = "Top",
}

type PlotShapeId =
  | "shape_arrow_down"
  | "shape_arrow_up"
  | "shape_circle"
  | "shape_cross"
  | "shape_xcross"
  | "shape_diamond"
  | "shape_flag"
  | "shape_square"
  | "shape_label_down"
  | "shape_label_up"
  | "shape_triangle_down"
  | "shape_triangle_up";

interface StudyShapesPlotPreferences {
  /**
   * The color of the shape in any valid CSS color format (e.g., "#FF0000" for red).
   */
  color: string;

  /**
   * Display mode of the shape plot, determining how it is displayed on the chart.
   * Example: `StudyPlotDisplayMode.None` to hide the plot.
   */
  display?: StudyPlotDisplayMode;

  /**
   * Location of the shape relative to the bar.
   * Determines if the shape is above, below, or at the bar.
   */
  location: MarkLocation;

  /**
   * Plot type for the shape.
   * Defines the shape to be plotted (e.g., arrow, label, or other shapes).
   */
  plottype: PlotShapeId;

  /**
   * The color of any associated text in the shape.
   */
  textColor: string;

  /**
   * Transparency of the shape, ranging from 1 (fully opaque) to 100 (fully transparent).
   * Example: `80` for high transparency.
   */
  transparency: number;

  /**
   * Determines whether the shape plot is visible.
   */
  visible?: boolean;
}

interface StudyArrowsPlotPreferences {
  /**
   * Color of the down arrow.
   * Specified in any valid CSS color format.
   */
  colordown: string;

  /**
   * Color of the up arrow.
   * Specified in any valid CSS color format.
   */
  colorup: string;

  /**
   * Display mode for the arrows plot.
   * Use `StudyPlotDisplayMode` to control visibility or display properties.
   * Example: `StudyPlotDisplayTarget.None` to hide the plot.
   */
  display?: StudyPlotDisplayMode;

  /**
   * Optional maximum height of the arrows, typically in pixels.
   */
  maxHeight?: number;

  /**
   * Optional minimum height of the arrows, typically in pixels.
   */
  minHeight?: number;

  /**
   * Transparency level for the arrows, ranging from 1 (fully opaque) to 100 (fully transparent).
   * Example: `80` for high transparency.
   */
  transparency: number;

  /**
   * Visibility of the arrow plot.
   * If true, the plot is visible; if false or omitted, it may not be displayed.
   */
  visible?: boolean;
}

interface StudyCharsPlotPreferences {
  /**
   * A character to be displayed at the plot point (optional).
   * Example: 'A', 'B', or any single character.
   */
  char?: string;

  /**
   * Color of the character or marker, specified in any valid CSS color format.
   */
  color: string;

  /**
   * Display mode for the character plot.
   * Use `StudyPlotDisplayMode` to control visibility or display properties.
   * Example: `StudyPlotDisplayTarget.None` to hide the plot.
   */
  display?: StudyPlotDisplayMode;

  /**
   * Location of the character relative to the bar.
   * Defined by `MarkLocation`, which specifies positions like above, below, or at the bar.
   */
  location: MarkLocation;

  /**
   * Color of any associated text, specified in CSS color format.
   */
  textColor: string;

  /**
   * Transparency level for the character or marker, ranging from 1 (fully opaque) to 100 (fully transparent).
   * Example: `80` for high transparency.
   */
  transparency: number;

  /**
   * Visibility of the character plot.
   * If true, the plot is visible; if false or omitted, it may not be displayed.
   */
  visible?: boolean;
}

type StudyPaletteStyle = {
  colors: Record<string, StudyPaletteColor> | StudyPaletteColor[];
};

interface StudyPaletteColor {
  /**
   * Palette color.
   */
  color: string;

  /**
   * Palette style.
   */
  style?: number;

  /**
   * Palette width.
   */
  width?: number;
}

interface StudyPalettesInfo {
  /**
   * Use default color for StudyPlotType.Colorer plots when the value is NaN.
   */
  addDefaultColor?: boolean;

  /**
   * Palette colors, defined as an array or a mapped object of `StudyPaletteInfo`.
   */
  colors: Record<string, StudyPaletteInfo> | StudyPaletteInfo[];

  /**
   * Mapping from values returned by the study to palette color indices.
   */
  valToIndex?: Record<string, number>;
}

interface StudyPaletteInfo {
  /**
   * Palette name.
   */
  readonly name: string;
}

type StudyPlotInformation =
  | StudyArrowsPlotInfo
  | StudyCharsPlotInfo
  | StudyColorerPlotInfo
  | StudyRgbaColorerPlotInfo
  | StudyDataPlotInfo
  | StudyDataOffsetPlotInfo
  | StudyLinePlotInfo
  | StudyOhlcPlotInfo
  | StudyShapesPlotInfo
  | StudyBarColorerPlotInfo
  | StudyBgColorerPlotInfo
  | StudyTextColorerPlotInfo
  | StudyOhlcColorerPlotInfo
  | StudyCandleWickColorerPlotInfo
  | StudyCandleBorderColorerPlotInfo
  | StudyUpColorerPlotInfo
  | StudyDownColorerPlotInfo;

/**
 * Interface for describing a study characters plot.
 */
interface StudyCharsPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the plot.
   */
  readonly id: string;

  /**
   * Plot type.
   * Specifies that this plot uses characters.
   */
  readonly type: "chars";
}

/**
 * Interface for describing a study arrows plot.
 */
interface StudyArrowsPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the plot.
   */
  readonly id: string;

  /**
   * Plot type.
   * Specifies that this plot uses arrows.
   */
  readonly type: "arrows"; // Overrides StudyPlotBaseInfo.type
}

/**
 * Interface for describing a colorer plot.
 */
interface StudyColorerPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the plot.
   */
  readonly id: string;

  /**
   * A color palette ID.
   * Refers to the palette used for this plot.
   */
  readonly palette: string;

  /**
   * ID of another target plot.
   * Specifies the plot that this colorer targets.
   */
  readonly target: string;

  /**
   * Target field.
   * The specific field of the target plot affected by the colorer.
   * Can be one of the following: "topColor", "bottomColor", "topValue", or "bottomValue".
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Specifies that this is a colorer plot.
   */
  readonly type: "colorer"; // Overrides StudyTargetedPlotInfo.type
}

/**
 * Interface for describing an RGBA colorer plot.
 */
interface StudyRgbaColorerPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the plot.
   */
  readonly id: string;

  /**
   * ID of another target plot.
   * Specifies the plot that this RGBA colorer targets.
   */
  readonly target: string;

  /**
   * Target field.
   * The specific field of the target plot affected by the colorer.
   * Can be one of the following: "topColor", "bottomColor", "topValue", or "bottomValue".
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Specifies that this is a colorer plot.
   */
  readonly type: "colorer"; // Overrides StudyTargetedPlotInfo.type
}

/**
 * Interface for describing a study data plot.
 */
interface StudyDataPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the data plot.
   */
  readonly id: string;

  /**
   * ID of another target plot.
   * Specifies the plot that this data plot modifies or targets.
   */
  readonly target: string;

  /**
   * Target field.
   * The specific field of the target plot affected by the data plot.
   * Can be one of the following: "topColor", "bottomColor", "topValue", or "bottomValue".
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Specifies that this is a data plot.
   */
  readonly type: "data"; // Overrides StudyTargetedPlotInfo.type
}

/**
 * Interface for describing a study data offset plot.
 */
interface StudyDataOffsetPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the data offset plot.
   */
  readonly id: string;

  /**
   * ID of another target plot.
   * Specifies the plot that this data offset plot modifies or targets.
   */
  readonly target: string;

  /**
   * Target field.
   * The specific field of the target plot affected by the data offset plot.
   * Can be one of the following: "topColor", "bottomColor", "topValue", or "bottomValue".
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Specifies that this is a data offset plot.
   */
  readonly type: "dataoffset"; // Overrides StudyTargetedPlotInfo.type
}

/**
 * Interface for describing a study line plot.
 */
interface StudyLinePlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the line plot.
   */
  readonly id: string;

  /**
   * Plot type.
   * Indicates that this plot is a Line type.
   */
  readonly type: "line";
}

/**
 * Interface for describing an OHLC (Open, High, Low, Close) plot.
 */
interface StudyOhlcPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the OHLC plot.
   */
  readonly id: string;

  /**
   * ID of another target plot.
   * Specifies the associated plot that this OHLC plot targets.
   */
  readonly target: string;

  /**
   * Target field.
   * Specifies the field within the target plot.
   * Possible values: "topColor", "bottomColor", "topValue", "bottomValue".
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Indicates the specific OHLC type.
   * Possible values: "OhlcOpen", "OhlcHigh", "OhlcLow", "OhlcClose".
   */
  readonly type: "ohlc_open" | "ohlc_high" | "ohlc_low" | "ohlc_close";
}

/**
 * Interface for describing a study shapes plot.
 */
interface StudyShapesPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the shapes plot.
   */
  readonly id: string;

  /**
   * Plot type.
   * Specifies the plot type as "Shapes".
   */
  readonly type: "shapes";
}

/**
 * Interface for describing a bar colorer plot in a study.
 */
interface StudyBarColorerPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the bar colorer plot.
   */
  readonly id: string;

  /**
   * Palette ID.
   * Refers to a color palette used by the plot.
   */
  readonly palette: string;

  /**
   * Plot type.
   * Specifies the plot type as "BarColorer".
   */
  readonly type: "bar_colorer";
}

/**
 * Interface for describing a background colorer plot in a study.
 */
interface StudyBgColorerPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the background colorer plot.
   */
  readonly id: string;

  /**
   * Palette ID.
   * Refers to a color palette used by the plot.
   */
  readonly palette: string;

  /**
   * Plot type.
   * Specifies the plot type as "BgColorer".
   */
  readonly type: "bg_colorer";
}

/**
 * Interface for describing a text colorer plot in a study.
 */
interface StudyTextColorerPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the text colorer plot.
   */
  readonly id: string;

  /**
   * Palette ID.
   * Refers to a color palette used by the plot.
   */
  readonly palette: string;

  /**
   * Target Plot ID.
   * Specifies the ID of another target plot associated with this colorer.
   */
  readonly target: string;

  /**
   * Target field.
   * Optionally specifies the field within the target plot to apply the color.
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Specifies the plot type as "TextColorer".
   */
  readonly type: "text_colorer";
}

/**
 * Interface for describing an OHLC colorer plot in a study.
 */
interface StudyOhlcColorerPlotInfo {
  /**
   * Plot ID.
   * A unique identifier for the OHLC colorer plot.
   */
  readonly id: string;

  /**
   * Palette ID.
   * Refers to a color palette used by the plot.
   */
  readonly palette: string;

  /**
   * Target Plot ID.
   * Specifies the ID of another target plot associated with this colorer.
   */
  readonly target: string;

  /**
   * Target field.
   * Optionally specifies the field within the target plot to apply the color.
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Plot type.
   * Specifies the plot type as "OhlcColorer".
   */
  readonly type: "ohlc_colorer";
}

/**
 * Interface for describing a candle wick colorer plot.
 */
interface StudyCandleWickColorerPlotInfo {
  /**
   * Unique identifier for the plot.
   */
  readonly id: string;

  /**
   * Identifier for the associated color palette.
   */
  readonly palette: string;

  /**
   * Identifier of the target plot this wick colorer is associated with.
   */
  readonly target: string;

  /**
   * Optional field indicating the specific target property within the associated plot.
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Specifies the plot type as a candle wick colorer.
   */
  readonly type: "wick_colorer";
}

/**
 * Interface for describing a candle border colorer plot.
 */
interface StudyCandleBorderColorerPlotInfo {
  /**
   * Unique identifier for the plot.
   */
  readonly id: string;

  /**
   * Identifier for the associated color palette.
   */
  readonly palette: string;

  /**
   * Identifier of the target plot this border colorer is associated with.
   */
  readonly target: string;

  /**
   * Optional field indicating the specific target property within the associated plot.
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Specifies the plot type as a candle border colorer.
   */
  readonly type: "border_colorer";
}

/**
 * Interface for describing an up colorer plot.
 */
interface StudyUpColorerPlotInfo {
  /**
   * Unique identifier for the plot.
   */
  readonly id: string;

  /**
   * Identifier for the associated color palette.
   */
  readonly palette: string;

  /**
   * Identifier of the target plot this colorer is associated with.
   */
  readonly target: string;

  /**
   * Optional field indicating the specific target property within the associated plot.
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Specifies the plot type as an up colorer.
   */
  readonly type: "up_colorer";
}

/**
 * Interface for describing a down colorer plot.
 */
interface StudyDownColorerPlotInfo {
  /**
   * Unique identifier for the plot.
   */
  readonly id: string;

  /**
   * Identifier for the associated color palette.
   */
  readonly palette: string;

  /**
   * Identifier of the target plot this colorer is associated with.
   */
  readonly target: string;

  /**
   * Optional field indicating the specific target property within the associated plot.
   */
  readonly targetField?:
    | "topColor"
    | "bottomColor"
    | "topValue"
    | "bottomValue";

  /**
   * Specifies the plot type as a down colorer.
   */
  readonly type: "down_colorer";
}

/**
 * Enumeration for specifying the price scale target for a study.
 */
enum StudyTargetPriceScale {
  /**
   * Price scale displayed on the right side of the chart.
   */
  Right = 0,

  /**
   * Price scale displayed on the left side of the chart.
   */
  Left = 1,

  /**
   * No price scale associated with the study.
   */
  NoScale = 2,
}

/**
 * Interface representing the styles description of a study.
 */
interface StudyStylesInfo {
  /**
   * Char to display with the plot. Applicable only to chars plot types.
   */
  char?: string;

  /**
   * Optional flag to indicate the plot should be drawn on the main page.
   */
  forceOverlay?: boolean;

  /**
   * Info about the price scale formatting.
   */
  format?: Partial<StudyPlotValuePrecisionFormat>;

  /**
   * Histogram base. A price value that will be considered as a start base point
   * when rendering plot with histogram, columns, or area style.
   */
  histogramBase?: number;

  /**
   * If true, then the styles tab will be hidden in the study dialog.
   */
  isHidden?: boolean;

  /**
   * If true, plot points will be joined with a line.
   * Applicable only to Circles and Cross type plots. Default is false.
   */
  joinPoints?: boolean;

  /**
   * Maximum possible plot arrow size. Applicable only to arrow plot types.
   */
  maxHeight?: number;

  /**
   * Minimum possible plot arrow size. Applicable only to arrow plot types.
   */
  minHeight?: number;

  /**
   * If defined, specifies the number of bars to plot on the chart.
   */
  showLast?: number;

  /**
   * Size of characters on the chart.
   * Possible values are: auto, tiny, small, normal, large, huge.
   * Applicable to chars and shapes plot types.
   */
  size?: PlotSymbolSize;

  /**
   * Text to display with the plot. Applicable to chars and shapes plot types.
   */
  text?: string;

  /**
   * Title used in the study dialog styles tab.
   */
  title: string;

  /**
   * Used to control the z-order of the plot.
   * Controls whether a plot is visually behind or in front of another.
   */
  zorder?: number;
}

/**
 * Interface representing the value precision format for a study plot.
 */
interface StudyPlotValuePrecisionFormat {
  /**
   * Plot value precision (number of decimal places).
   */
  precision?: number;

  /**
   * Plot value type.
   * Supported types:
   * - "percent": Values are treated as percentages.
   * - "price": Values are treated as prices.
   * - "volume": Values are treated as volumes.
   */
  type: "percent" | "price" | "volume";
}

/**
 * Enumeration representing possible plot symbol sizes.
 */
enum PlotSymbolSize {
  /**
   * Automatic size adjustment.
   */
  Auto = "auto",

  /**
   * Huge symbol size.
   */
  Huge = "huge",

  /**
   * Large symbol size.
   */
  Large = "large",

  /**
   * Normal/default symbol size.
   */
  Normal = "normal",

  /**
   * Small symbol size.
   */
  Small = "small",

  /**
   * Tiny symbol size.
   */
  Tiny = "tiny",
}

/**
 * Interface representing a symbol input source for a symbol-based study or plot.
 */
interface SymbolInputSymbolSource {
  /**
   * Input ID for the symbol source.
   */
  inputId: string;

  /**
   * Type of input. For this interface, it is always "symbolInputSymbolSource".
   */
  type: "symbolInputSymbolSource";
}
