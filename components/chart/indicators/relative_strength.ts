import { CustomIndicator, PineJS } from "./pinejs";

interface RelativeStrengthProps {
  source: "open" | "high" | "low" | "close";
  comparativeTickerId: string;
  length: number;
  showZeroLine: boolean;
  showRefDateLbl: boolean;
  toggleRSColor: boolean;
  showRSTrend: boolean;
  base: number;
  showMA: boolean;
  lengthRSMA: number;
  showMAColor: boolean;
  showBubbles: boolean;
  lengthPriceSMA: number;
  bullishColor: string;
  bearishColor: string;
}

export function RelativeStrength(
  PineJS: PineJS,
): CustomIndicator<RelativeStrengthProps> {
  return {
    name: "TM-RS",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      behind_chart: true,
      defaults: {
        inputs: {
          in_0: "close",
          in_1: "NSE:NIFTY",
          in_10: true,
          in_11: true,
          in_12: 50,
          in_13: "rgba(76,175,80,0.15)",
          in_14: "rgba(255,82,82,0.15)",
          in_2: 65,
          in_3: true,
          in_4: true,
          in_5: true,
          in_6: false,
          in_7: 5,
          in_8: false,
          in_9: 50,
        },
        palettes: {
          palette_0: {
            colors: {
              "0": {
                color: "#4CAF50",
                style: 0,
                width: 2,
              },
              "1": {
                color: "#880E4F",
                style: 0,
                width: 2,
              },
            },
          },
          palette_1: {
            colors: {
              "0": {
                color: "#4CAF50",
                style: 0,
                width: 3,
              },
              "1": {
                color: "#FF5252",
                style: 0,
                width: 3,
              },
              "2": {
                color: "#2962ff",
                style: 0,
                width: 3,
              },
            },
          },
          palette_2: {
            colors: {
              "0": {
                color: "#4CAF50",
                style: 0,
                width: 2,
              },
              "1": {
                color: "#FF5252",
                style: 0,
                width: 2,
              },
              "2": {
                color: "#787B86",
                style: 0,
                width: 2,
              },
            },
          },
          palette_3: {
            colors: {
              "0": {
                color: "rgba(76,175,80,0.15)",
                style: 0,
                width: 10,
              },
              "1": {
                color: "rgba(255,82,82,0.15)",
                style: 0,
                width: 10,
              },
            },
          },
          palette_common: {
            colors: {
              "0": {
                color: "rgba(76,175,80,0.15)",
              },
              "1": {
                color: "rgba(255,82,82,0.15)",
              },
              "2": {
                color: "#4CAF50",
              },
              "3": {
                color: "#FF5252",
              },
              "4": {
                color: "#2962ff",
              },
              "5": {
                color: "#363A45",
              },
              "6": {
                color: "#880E4F",
              },
              "7": {
                color: "#787B86",
              },
            },
          },
        },
        styles: {
          plot_0: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_2: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 3,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_4: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
          plot_6: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 10,
            plottype: 6,
            trackPrice: false,
            transparency: 0,
          },
        },
      },
      description: "Relative Strength",
      format: { type: "inherit" },
      id: "TM-RelativeStrenght@tv-basicstudies-1",
      inputs: [
        {
          defval: "close",
          id: "in_0",
          name: "Source",
          options: [
            "open",
            "high",
            "low",
            "close",
            "hl2",
            "hlc3",
            "hlcc4",
            "ohlc4",
          ],
          type: "source",
        },
        {
          defval: "NSE:NIFTY",
          display: 15,
          id: "in_1",
          name: "Comparative Symbol",
          type: "symbol",
        },
        {
          defval: 65,
          display: 15,
          id: "in_2",
          max: 1000000000000,
          min: 1,
          name: "Period",
          type: "integer",
        },
        {
          defval: true,
          display: 0,
          id: "in_3",
          name: "Show Zero Line",
          type: "bool",
        },
        {
          defval: true,
          display: 0,
          id: "in_4",
          name: "Show Reference Label",
          type: "bool",
        },
        {
          defval: true,
          display: 0,
          id: "in_5",
          name: "Toggle RS color on crossovers",
          type: "bool",
        },
        {
          defval: false,
          display: 0,
          group: "RS Trend",
          id: "in_6",
          inline: "RS Trend",
          name: "RS Trend,",
          type: "bool",
        },
        {
          defval: 5,
          display: 15,
          group: "RS Trend",
          id: "in_7",
          inline: "RS Trend",
          max: 1000000000000,
          min: 1,
          name: "Range",
          type: "integer",
        },
        {
          defval: false,
          display: 0,
          group: "RS Mean",
          id: "in_8",
          inline: "RS Mean",
          name: "",
          type: "bool",
        },
        {
          defval: 50,
          display: 15,
          group: "RS Mean",
          id: "in_9",
          inline: "RS Mean",
          max: 1000000000000,
          min: 1,
          name: "Period",
          type: "integer",
        },
        {
          defval: true,
          display: 0,
          group: "RS Mean",
          id: "in_10",
          inline: "RS Mean",
          name: "Trend Color",
          type: "bool",
        },
        {
          defval: true,
          display: 0,
          group: "Price Confirmation",
          id: "in_11",
          inline: "Color",
          name: "",
          type: "bool",
        },
        {
          defval: 50,
          display: 15,
          group: "Price Confirmation",
          id: "in_12",
          inline: "Color",
          max: 1000000000000,
          min: 1,
          name: "Period",
          type: "integer",
        },
        {
          defval: "rgba(76,175,80,0.15)",
          display: 0,
          group: "Price Confirmation",
          id: "in_13",
          inline: "Color",
          name: "+ve",
          type: "color",
        },
        {
          defval: "rgba(255,82,82,0.15)",
          display: 0,
          group: "Price Confirmation",
          id: "in_14",
          inline: "Color",
          name: "-ve",
          type: "color",
        },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {
        palette_0: {
          addDefaultColor: true,
          colors: {
            "0": {
              name: "Color 0",
            },
            "1": {
              name: "Color 1",
            },
          },
          valToIndex: {
            "2": 0,
            "6": 1,
          },
        },
        palette_1: {
          addDefaultColor: true,
          colors: {
            "0": {
              name: "Color 0",
            },
            "1": {
              name: "Color 1",
            },
            "2": {
              name: "Color 2",
            },
          },
          valToIndex: {
            "2": 0,
            "3": 1,
            "4": 2,
          },
        },
        palette_2: {
          addDefaultColor: true,
          colors: {
            "0": {
              name: "Color 0",
            },
            "1": {
              name: "Color 1",
            },
            "2": {
              name: "Color 2",
            },
          },
          valToIndex: {
            "2": 0,
            "3": 1,
            "7": 2,
          },
        },
        palette_3: {
          addDefaultColor: true,
          colors: {
            "0": {
              name: "Color 0",
            },
            "1": {
              name: "Color 1",
            },
          },
          valToIndex: {
            "0": 0,
            "1": 1,
          },
        },
        palette_common: {
          colors: {
            "0": {
              name: "Color 0",
            },
            "1": {
              name: "Color 1",
            },
            "2": {
              name: "Color 2",
            },
            "3": {
              name: "Color 3",
            },
            "4": {
              name: "Color 4",
            },
            "5": {
              name: "Color 5",
            },
            "6": {
              name: "Color 6",
            },
            "7": {
              name: "Color 7",
            },
          },
          valToIndex: {
            "0": 0,
            "1": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
          },
        },
      },
      plots: [
        // Zero line
        {
          id: "plot_0",
          type: "line",
        },
        // Zeroline color
        {
          id: "plot_1",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
        // RS
        {
          id: "plot_2",
          type: "line",
        },
        // RS Color
        {
          id: "plot_3",
          palette: "palette_1",
          target: "plot_2",
          type: "colorer",
        },
        // MA
        {
          id: "plot_4",
          type: "line",
        },
        // MA Color
        {
          id: "plot_5",
          palette: "palette_2",
          target: "plot_4",
          type: "colorer",
        },
        // Bubble
        {
          id: "plot_6",
          type: "line",
        },
        // Bubble Color
        {
          id: "plot_7",
          palette: "palette_3",
          target: "plot_6",
          type: "colorer",
        },
      ],
      shortDescription: "Relative Strength",
      styles: {
        plot_0: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Zero Line / RS Trend",
        },
        plot_2: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "RS",
        },
        plot_4: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "MA",
        },
        plot_6: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Confirmation Bubbles",
        },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        // Store inputs
        this.source = this._input(0);
        this.comparativeTickerId = this._input(1);
        this.length = this._input(2);
        this.showZeroLine = this._input(3);
        this.showRefDateLbl = this._input(4);
        this.toggleRSColor = this._input(5);
        this.showRSTrend = this._input(6);
        this.base = this._input(7);
        this.showMA = this._input(8);
        this.lengthRSMA = this._input(9);
        this.showMAColor = this._input(10);
        this.showBubbles = this._input(11);
        this.lengthPriceSMA = this._input(12);
        this.bullishColor = this._input(13);
        this.bearishColor = this._input(14);

        // Load additional symbol data
        ctx.new_sym(
          this.comparativeTickerId,
          PineJS.Std.period(this._context),
          PineJS.Std.currencyCode(this._context),
          PineJS.Std.unitId(this._context),
          "regular",
        );
        this._context.setMinimumAdditionalDepth(this.length);
      };
      this.main = function (ctx) {
        this._context = ctx;
        //========= Start Setup ==========
        // Main Symbol
        this._context.select_sym(0);
        const mainValue = PineJS.Std[this.source](this._context);
        const main = this._context.new_var(mainValue);
        const mainTime = this._context.new_var(
          this._context.symbol.time,
        );

        // Switch to comparative symbol
        this._context.select_sym(1);
        const compV = PineJS.Std[this.source](this._context);
        const comp = this._context.new_var(compV);
        const compTime = this._context.new_var(
          this._context.symbol.time,
        );

        // Switch back to main symbol and align the series
        this._context.select_sym(0);
        const alignedV = comp.adopt(compTime, mainTime, 1);
        const alignedComp = this._context.new_var(alignedV);
        //========= End Setup ==========

        //========= Start Calculation ==========

        // RS
        const mCurr = main.get();
        const mHist = main.get(this.length);
        const cCurr = alignedComp.get();
        const cHist = alignedComp.get(this.length);
        const mainReturn = mCurr / mHist;
        const compReturn = cCurr / cHist;
        const rsValue = mainReturn / compReturn - 1;

        const rs = ctx.new_var(rsValue);
        const resColor = this.toggleRSColor ? (rs.get() > 0 ? 0 : 1) : 2;

        // Zeroline
        let zeroLine = NaN;
        let zeroLineColor = 1;
        if (this.showZeroLine) {
          const y0 = rs.get() - rs.get(this.base);
          const angle0 = PineJS.Std.atan(y0 / this.base);
          zeroLine = 0;
          zeroLineColor = this.showRSTrend ? (angle0 > 0 ? 0 : 1) : 1;
        }

        // MA
        let ma = NaN;
        let maColor = 2;
        if (this.showMA) {
          const smaRes = this._context.new_var(
            PineJS.Std.sma(rs, this.lengthRSMA, this._context),
          );
          ma = smaRes.get();

          const maRising = PineJS.Std.rising(smaRes, 3);
          const maFalling = PineJS.Std.falling(smaRes, 3);
          maColor =
            this.showMAColor && maRising
              ? 0
              : this.showMAColor && maFalling
                ? 1
                : 2;
        }

        // Price Confirmation Bubble
        let priceConf = NaN;
        let divColor = NaN;
        if (this.showBubbles) {
          const smaSource = this._context.new_var(
            PineJS.Std.sma(main, this.lengthPriceSMA, this._context),
          );
          const posDiv =
            PineJS.Std.rising(smaSource, 3) && main.get() >= smaSource.get();
          const negDiv =
            PineJS.Std.falling(smaSource, 3) && main.get() < smaSource.get();
          const divStarted = posDiv || negDiv;
          divColor = divStarted ? (posDiv ? 0 : negDiv ? 1 : NaN) : NaN;
          if (divStarted) {
            priceConf = rs.get();
          }
        }

        //========= End Calculation ==========

        return [
          // Zero Line / RS Trend
          zeroLine,
          zeroLineColor,
          // RS
          rs.get(),
          resColor,
          // MA
          ma,
          maColor,
          // Confirmation Bubbles
          priceConf,
          divColor,
        ] satisfies (number | string)[];
      };
    },
  };
}
