import {
  CustomIndicator,
  IPineSeries,
  MarkLocation,
  PineJS,
  PlotShapeId,
} from "./pinejs";

interface MarketCycleCountProps {
  insideBar: boolean;
  oopsReversal: boolean;
}

interface OHLCVSeries {
  o: IPineSeries;
  h: IPineSeries;
  l: IPineSeries;
  c: IPineSeries;
  v: IPineSeries;
}

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
          oopsReversal: false,
        },
        styles: {
          insideBar: {
            location: MarkLocation.BelowBar,
            plottype: PlotShapeId.shape_arrow_up,
          },
          oopsReversal: {
            location: MarkLocation.BelowBar,
            plottype: PlotShapeId.shape_arrow_up,
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
      ],
      styles: {
        insideBar: {
          title: "Inside Bar",
        },
        oopsReversal: {
          title: "Oops Reversal",
        },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.insideBar = this._input(0);
        this.oopsReversal = this._input(1);
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

        return [insideBar, oopsReversal];
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
