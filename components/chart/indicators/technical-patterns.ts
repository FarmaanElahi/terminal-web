import {
  CustomIndicator,
  IContext,
  IPineSeries,
  MarkLocation,
  PineJS,
  PlotShapeId,
} from "./pinejs";

interface MarketCycleCountProps {
  insideBar: boolean;
  oopsReversal: boolean;
  keyReversal: boolean;
}

interface OHLCVSeries {
  o: IPineSeries;
  h: IPineSeries;
  l: IPineSeries;
  c: IPineSeries;
  v: IPineSeries;
}

/**
 * Creates a custom indicator for identifying specific technical patterns, including "Inside Bar" and "Oops Reversal."
 *
 * @param {PineJS} PineJS - The PineJS library instance for indicator calculations and context management.
 * @return {CustomIndicator<MarketCycleCountProps>} A custom indicator configuration object with metadata, inputs, styles, and plotting logic.
 *
 * TODO:
 *  1. Key Reversal Bar
 */

export function TechnicalPatterns(
  PineJS: PineJS,
): CustomIndicator<MarketCycleCountProps> {
  return {
    name: "TM-Technical Patterns",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-Technical Patterns",
      defaults: {
        inputs: {
          insideBar: false,
          oopsReversal: true,
          keyReversal: false,
        },
        styles: {
          insideBar: {
            location: MarkLocation.BelowBar,
            plottype: PlotShapeId.shape_arrow_up,
            color: "green",
          },
          oopsReversal: {
            location: MarkLocation.BelowBar,
            plottype: PlotShapeId.shape_arrow_up,
            color: "green",
          },
          bullishKeyReversal: {
            location: MarkLocation.BelowBar,
            plottype: PlotShapeId.shape_arrow_up,
            color: "green",
          },
          bearishKeyReversal: {
            location: MarkLocation.AboveBar,
            plottype: PlotShapeId.shape_arrow_down,
            color: "red",
          },
        },
        palettes: {},
      },
      description: "TM-Technical Patterns",
      format: { type: "inherit" },
      id: "TM-TechnicalPatterns@tv-basicstudies-1",
      inputs: [
        {
          id: "insideBar",
          name: "Inside Bar",
          type: "bool",
        },
        {
          id: "oopsReversal",
          name: "Oops Reversal",
          type: "bool",
        },
        {
          id: "keyReversal",
          name: "Key Reversal",
          type: "bool",
        },
      ],
      is_hidden_study: false,
      is_price_study: true,
      palettes: {},
      plots: [
        {
          id: "insideBar",
          type: "shapes",
        },
        {
          id: "oopsReversal",
          type: "shapes",
        },
        {
          id: "bullishKeyReversal",
          type: "shapes",
        },
        {
          id: "bearishKeyReversal",
          type: "shapes",
        },
      ],
      styles: {
        insideBar: { title: "Inside Bar", text: "IB" },
        oopsReversal: { title: "Oops Reversal", text: "Oops" },
        bullishKeyReversal: { title: "Bullish Key Reversal" },
        bearishKeyReversal: { title: "Bearish Key Reversal" },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.insideBar = this._input(0);
        this.oopsReversal = this._input(1);
        this.keyReversal = this._input(2);
      };
      this.main = function (ctx) {
        this._context = ctx;
        const o = this._context.new_unlimited_var(
          PineJS.Std.open(this._context),
        );
        const h = this._context.new_unlimited_var(
          PineJS.Std.high(this._context),
        );
        const l = this._context.new_unlimited_var(
          PineJS.Std.low(this._context),
        );
        const c = this._context.new_unlimited_var(
          PineJS.Std.close(this._context),
        );
        const v = this._context.new_unlimited_var(
          PineJS.Std.close(this._context),
        );
        const ohlcv = { o, h, l, c, v };
        const insideBar = this.insideBar ? isInsideBar(PineJS, ohlcv) : NaN;
        const oopsReversal = this.oopsReversal
          ? isOopsReversal(PineJS, ohlcv)
          : NaN;

        const keyReversal = this.keyReversal
          ? isKeyReversal(this._context, PineJS, ohlcv)
          : [NaN, NaN];

        return [insideBar, oopsReversal, ...keyReversal];
      };
    },
  };
}

function isInsideBar(PineJS: PineJS, { h, l }: OHLCVSeries) {
  const currentHigh = h.get();
  const previousHigh = h.get(1);

  const currentLow = l.get();
  const previousLow = l.get(1);

  return PineJS.Std.and(
    PineJS.Std.le(currentHigh, previousHigh),
    PineJS.Std.gt(currentLow, previousLow),
  );
}

function isOopsReversal(PineJS: PineJS, { c, o, l }: OHLCVSeries) {
  const previousLow = l.get(1);
  const currentOpen = o.get();
  const currentClose = c.get();

  return PineJS.Std.and(
    PineJS.Std.le(currentOpen, previousLow),
    PineJS.Std.ge(currentClose, previousLow),
  );
}

function isKeyReversal(context: IContext, PineJS: PineJS, s: OHLCVSeries) {
  return [
    isBullishKeyReversal(context, PineJS, s),
    isBearishKeyReversal(context, PineJS, s),
  ] as const;
}

function isBullishKeyReversal(
  context: IContext,
  PineJS: PineJS,
  { c, o, l, h }: OHLCVSeries,
) {
  const downtrend = PineJS.Std.sma(c, 50, context) > c.get();
  if (!downtrend) return NaN;

  const previousClose = c.get(1);
  const previousLow = l.get(1);
  const previousHigh = h.get(1);

  const currentOpen = o.get();
  const currentClose = c.get();
  const currentLow = l.get();

  const result =
    currentOpen < previousClose &&
    currentLow < previousLow &&
    currentClose > previousHigh;

  return result ? 1 : NaN;
}

function isBearishKeyReversal(
  context: IContext,
  PineJS: PineJS,
  { c, o, h }: OHLCVSeries,
) {
  const uptrend = PineJS.Std.sma(c, 50, context) < c.get();
  if (!uptrend) return NaN;

  const previousClose = c.get(1);
  const previousHigh = h.get(1);

  const currentOpen = o.get();
  const currentHigh = h.get();
  const currentClose = c.get();

  // Highest bar in the lookup

  const result =
    currentOpen > previousClose &&
    currentHigh > previousHigh &&
    currentClose < previousClose;

  return result ? 1 : NaN;
}
