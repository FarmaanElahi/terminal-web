import {
  CustomIndicator,
  LineStudyPlotStyle,
  MarkLocation,
  PineJS,
  PlotShapeId,
} from "./pinejs";

interface EnhancedVolumeProps {
  dailyAverage: number;
  weeklyAverage: number;

  instantBuyThreshold: number;
  accumulateThreshold: number;
  accumulateMultiple: number;
  accumulatePeriod: number;
}

export function EnhancedVolume(
  PineJS: PineJS,
): CustomIndicator<EnhancedVolumeProps> {
  return {
    name: "TM-EnhancedVolume",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      behind_chart: true,
      is_price_study: false,
      shortDescription: "TM-Enhanced Volume",
      defaults: {
        inputs: {
          dailyAvg: 20,
          weeklyAvg: 10,
          instantBuyThreshold: 4,
          accumulateThreshold: 1,
          accumulateMultiple: 5,
          accumulatePeriod: 20,
        },
        styles: {
          volume: {
            linestyle: 0,
            linewidth: 2,
            plottype: LineStudyPlotStyle.Histogram,
          },
          volume_ma: {
            linestyle: 0,
            linewidth: 1,
            plottype: LineStudyPlotStyle.Line,
            color: "red",
          },
          instant_buy: {
            location: MarkLocation.Top,
            plottype: PlotShapeId.shape_arrow_up,
            color: "green",
          },
          accumulated_buy: {
            location: MarkLocation.Top,
            plottype: PlotShapeId.shape_xcross,
            color: "green",
          },
        },
        palettes: {
          volume_colorer_palette: {
            colors: {
              0: { color: "#2A62FF", width: 1, style: 0 },
              1: { color: "#E140FB", width: 1, style: 0 },
              2: { color: "#02E676", width: 1, style: 0 },
              3: { color: "#FF9800", width: 1, style: 0 },
            },
          },
        },
      },
      description: "TM-Enhanced Volume",
      format: { type: "volume" },
      id: "TM-EnhancedVolumeCount@tv-basicstudies-1",
      inputs: [
        {
          id: "dailyAvg",
          name: "Daily Average",
          group: "Volume",
          type: "integer",
          min: 1,
          max: 1000,
        },
        {
          id: "weeklyAvg",
          name: "Weekly Average",
          type: "integer",
          group: "Volume",
          min: 1,
          max: 1000,
        },
        {
          id: "instantBuyThreshold",
          name: "Instant Buy Threshold(Cr)",
          type: "float",
          group: "Institution",
          min: 1,
        },
        {
          id: "accumulateThreshold",
          name: "accumulate Threshold(Cr)",
          type: "float",
          group: "Institution",
          min: 1,
        },
        {
          id: "accumulateMultiple",
          name: "Accumulate MA Multiple",
          type: "float",
          group: "Institution",
          min: 1,
        },
        {
          id: "accumulatePeriod",
          name: "Accumulation Period(Min)",
          type: "integer",
          group: "Institution",
          min: 1,
        },
      ],
      is_hidden_study: false,
      palettes: {
        volume_colorer_palette: {
          colors: {
            0: { name: "Up" },
            1: { name: "Down" },
            2: { name: "Pocket Pivot" },
            3: { name: "Reverse Pocket Pivot" },
          },
        },
      },
      plots: [
        {
          id: "volume",
          type: "line",
        },
        {
          id: "volume_colorer",
          type: "colorer",
          palette: "volume_colorer_palette",
          target: "volume",
        },
        {
          id: "volume_ma",
          type: "line",
        },
        {
          id: "instant_buy",
          type: "shapes",
        },
        {
          id: "accumulated_buy",
          type: "shapes",
        },
      ],
      styles: {
        volume: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Volume",
        },
        volume_ma: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Volume MA",
        },
        instant_buy: {
          title: "Instant Buy",
          text: "IB",
        },
        accumulated_buy: {
          title: "Accumulated Buy",
          text: "AB",
        },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.dailyAverage = this._input(0);
        this.weeklyAverage = this._input(1);
        this.instantBuyThreshold = (this._input(2) as number) * 1_00_00_000;
        this.accumulateThreshold = (this._input(3) as number) * 1_00_00_000;
        this.accumulateMultiple = this._input(4);
        this.accumulatePeriod = this._input(5);
      };
      this.main = function (ctx) {
        this._context = ctx;

        // Up Day and Down Day Calculation
        const open = PineJS.Std.open(this._context);
        const high = PineJS.Std.high(this._context);
        const low = PineJS.Std.low(this._context);
        const close = PineJS.Std.close(this._context);

        const upDay = close > open;
        const downDay = !upDay;

        // Volume Calculation
        const volume = PineJS.Std.volume(this._context);
        const volumeSeries = this._context.new_unlimited_var(volume);
        const downVolume = downDay ? volume : Number.MAX_SAFE_INTEGER;
        const downVolumeSeries = this._context.new_unlimited_var(downVolume);
        const historicalDownDayVolume = PineJS.Std.lowest(
          downVolumeSeries,
          10,
          this._context,
        );

        // Volume Bar Color Calculation
        let volumeColor = upDay ? 0 : 1;
        const range = (close - low) / (high - low);
        const strongCR = range > 0.5;
        const pocketPivot =
          upDay && strongCR && volume > historicalDownDayVolume;
        const reversePocketPivot = downDay && volume <= historicalDownDayVolume;
        if (pocketPivot) volumeColor = 2;
        if (reversePocketPivot) volumeColor = 3;

        // Volume Average Calculation
        const volumeMA = PineJS.Std.sma(
          volumeSeries,
          PineJS.Std.isweekly(this._context)
            ? this.weeklyAverage
            : this.dailyAverage,
          this._context,
        );

        // Institution Buying Indicator (Will only work in intraday and 1 minute candle)
        let instantBuy = false;
        let accumulationBuy = false;
        if (PineJS.Std.isintraday(ctx) && PineJS.Std.period(ctx) === "1") {
          const avgPrice = (open + high) / 2;
          const volume = PineJS.Std.volume(ctx);
          const priceVolume = avgPrice * volume;
          const priceVolumeSer = ctx.new_unlimited_var(priceVolume);
          const priceVolumeSma = PineJS.Std.sma(
            priceVolumeSer,
            this.accumulatePeriod,
            ctx,
          );

          instantBuy = priceVolume > this.instantBuyThreshold;
          if (!instantBuy) {
            accumulationBuy =
              priceVolume > priceVolumeSma * this.accumulateMultiple &&
              priceVolume > this.accumulateThreshold;
          }
        }

        return [
          // Market cycle count
          volume,
          volumeColor,
          volumeMA,
          instantBuy ? 1 : NaN,
          accumulationBuy ? 1 : NaN,
        ] satisfies (number | string)[];
      };
    },
  };
}
