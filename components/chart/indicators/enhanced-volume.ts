import { CustomIndicator, LineStudyPlotStyle, PineJS } from "./pinejs";

interface EnhancedVolumeProps {
  dailyAverage: number;
  weeklyAverage: number;
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
        },
        styles: {
          volume: {
            linestyle: 0,
            linewidth: 2,
            plottype: LineStudyPlotStyle.Columns,
          },
          volume_ma: {
            linestyle: 0,
            linewidth: 1,
            plottype: LineStudyPlotStyle.Line,
            color: "red",
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
          type: "integer",
          min: 1,
          max: 1000,
        },
        {
          id: "weeklyAvg",
          name: "Weekly Average",
          type: "integer",
          min: 1,
          max: 1000,
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
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.dailyAverage = this._input(0);
        this.weeklyAverage = this._input(1);
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
        const pocketPivot = upDay && strongCR && volume > historicalDownDayVolume;
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

        return [
          // Market cycle count
          volume,
          volumeColor,
          volumeMA,
        ] satisfies (number | string)[];
      };
    },
  };
}
