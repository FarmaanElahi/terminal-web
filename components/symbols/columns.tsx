import { CellClassParams, ColDef, DataTypeDefinition } from "ag-grid-community";
import type { Symbol } from "@/types/symbol";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import { Check, Flag, X } from "lucide-react";
import { ReactNode } from "react";
import { Candlestick } from "@/components/charting/candlestick";
import Image from "next/image";

type CellDataType =
  | "percentage"
  | "price"
  | "fundamental_price"
  | "date"
  | "number";

function agoCols(
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
  context?: unknown,
  cellDataType?: CellDataType,
): ColDef<Symbol>[] {
  const freqNameMapping = { fq: "Qtr", fy: "Yr" } as Record<
    typeof freq,
    string
  >;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist =
      i === 0
        ? `Latest ${freqName}`
        : i === 1
          ? `Prior ${freqName}`
          : undefined;

    hist = hist ? hist : `${i} ${freqName}s Ago`;
    const sign = cellDataType === "percentage" ? "%" : "";
    cols.push({
      field: [metric, freq, i].join("_") as keyof Symbol,
      headerName: [name_prefix, hist, sign].filter((s) => s).join(" "),
      context,
      cellDataType,
    });
  }
  return cols;
}

function forwardCols(
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
  context?: unknown,
  cellDataType?: CellDataType,
): ColDef<Symbol>[] {
  const freqNameMapping = { fq: "Qtr", fy: "Yr" } as Record<
    typeof freq,
    string
  >;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist = i === 0 ? `Next ${freqName}` : undefined;
    hist = hist ? hist : `${i + 1} ${freqName}s Forward`;

    const sign = cellDataType === "percentage" ? "%" : "";
    cols.push({
      field: [metric, freq, i].join("_") as keyof Symbol,
      headerName: [name_prefix, hist, sign].filter((s) => s).join(" "),
      cellDataType,
      context,
    });
  }
  return cols;
}

export const extendedColumnType: Record<
  CellDataType,
  DataTypeDefinition<Symbol>
> = {
  fundamental_price: {
    extendsDataType: "number",
    baseDataType: "number",
    valueFormatter: (params) => {
      const value = params.value;
      if (value === null || value === undefined) return "-";
      // TODO Make it dynamic
      const currencyCode =
        (params.value as unknown as Symbol).fundamental_currency ?? "INR";
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: value > 1_00_00_000 ? 2 : 0,
        minimumFractionDigits: 0,
        currencyDisplay: "symbol",
        notation: value > 1_00_00_000 ? "compact" : "standard",
        ...(currencyCode ? { currency: currencyCode, style: "currency" } : {}),
      }).format(value);
    },
  },
  price: {
    extendsDataType: "number",
    baseDataType: "number",
    valueFormatter: (params) => {
      const value = params.value;
      if (value === null || value === undefined) return "-";
      // TODO Make it dynamic
      const currencyCode =
        (params.value as unknown as Symbol).currency_code ?? "INR";
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        currencyDisplay: "symbol",
        currency: currencyCode,
        style: "currency",
      }).format(value);
    },
  },
  percentage: {
    extendsDataType: "number",
    baseDataType: "number",
    valueFormatter: (params) => {
      const value = params.value;
      if (value === null || value === undefined) return "-";

      const number = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
      }).format(value);
      return `${number} %`;
    },
  },
  // TODO
  date: {
    extendsDataType: "date",
    baseDataType: "date",
    appendColumnTypes: false,
    valueParser: (params) => {
      const value = params.newValue as unknown;
      if (typeof value === "number")
        return DateTime.fromMillis(value).toJSDate();
      if (typeof value === "string") return DateTime.fromISO(value).toJSDate();
      return null;
    },
    valueFormatter: (params) => {
      return params.value
        ? DateTime.fromMillis(params.value as unknown as number).toFormat(
            "dd-MM-yyyy",
          )
        : "-";
    },
  },
  number: {
    extendsDataType: "number",
    baseDataType: "number",
    valueFormatter: (params) => {
      const value = params.value;
      if (value === null || value === undefined) return "-";
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
};

export const defaultColumns: Array<ColDef<Symbol>> = [
  // #############################  Generals  ################################
  {
    field: "name",
    headerName: "Symbol",
    context: { category: "General" },
    cellRenderer: SymbolCell,
  },
  { field: "isin", headerName: "ISIN", context: { category: "General" } },
  {
    field: "day_open",
    headerName: "Open",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "day_high",
    headerName: "High",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "day_low",
    headerName: "Low",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "day_close",
    headerName: "Last",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "day_volume",
    headerName: "Volume",
    context: { category: "General" },
  },
  {
    field: "week_open",
    headerName: "Week Open",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "week_high",
    headerName: "Week High",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "week_low",
    headerName: "Week Low",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "week_close",
    headerName: "Week Close",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "week_volume",
    headerName: "Week Volume",
    context: { category: "General" },
  },
  {
    field: "month_open",
    headerName: "Month Open",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "month_high",
    headerName: "Month High",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "month_low",
    headerName: "Month Low",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "month_close",
    headerName: "Month Close",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "month_volume",
    headerName: "Month Volume",
    context: { category: "General" },
  },
  {
    field: "description",
    headerName: "Name",
    context: { category: "General" },
  },
  {
    field: "website",
    headerName: "Website",
    context: { category: "General" },
  },
  {
    field: "ceo",
    headerName: "CEO",
    context: { category: "General" },
  },
  {
    field: "employees",
    headerName: "Employee Count",
    context: { category: "General" },
  },
  {
    field: "country",
    headerName: "Country",
    cellRenderer: LogoTextCell,
    cellRendererParams: { logoCol: "country_code", logoPrefix: "country" },
    context: { category: "General" },
  },
  { field: "location", headerName: "City", context: { category: "General" } },
  {
    field: "ipo_date",
    headerName: "IPO Date",
    cellDataType: "date",
    context: { category: "General" },
  },
  {
    field: "most_recent_split",
    headerName: "Recent Split",
    cellDataType: "date",
    context: { category: "General" },
  },
  { field: "type", headerName: "Type", context: { category: "General" } },
  {
    field: "exchange",
    headerName: "Exchange",
    cellRenderer: LogoTextCell,
    cellRendererParams: { logoCol: "exchange_logo", logoPrefix: "country" },
    context: { category: "General" },
  },
  {
    field: "mcap",
    headerName: "Market Cap",
    cellDataType: "fundamental_price" satisfies CellDataType,
    context: { category: "General" },
  },
  {
    field: "shares_float",
    headerName: "Shares Float",
    context: { category: "General" },
  },
  {
    // Weighted Shares Outstanding.
    field: "total_shares_outstanding",
    headerName: "Total Outstanding Shares",
    context: { category: "General" },
  },
  // TODO: Add Non-Weighted Shares Outstanding
  {
    field: "timezone",
    headerName: "Timezone",
    context: { category: "General" },
  },
  {
    field: "currency",
    headerName: "Currency",
    cellRenderer: LogoTextCell,
    cellRendererParams: { logoCol: "currency_logo" },
    context: { category: "General" },
  },
  // #############################  Generals  ################################

  // ##############################  Earnings  ###############################
  {
    field: "earnings_release_date",
    headerName: "Earnings Date",
    cellDataType: "date",
    context: { category: "Earnings" },
  },
  {
    field: "earnings_release_next_date",
    headerName: "Next Earnings Date",
    cellDataType: "date",
    context: { category: "Earnings" },
  },
  {
    field: "days_since_latest_earning",
    headerName: "Days since last earning",
    context: { category: "Earnings" },
  },
  {
    field: "earnings_per_share_ttm",
    headerName: "EPS TTM",
    context: { category: "Earnings" },
  },

  ...agoCols("eps", "EPS", "fq", 9, { category: "Earnings" }),
  ...agoCols("eps", "EPS", "fy", 3, { category: "Earnings" }),

  ...agoCols(
    "earning_surprise",
    "EPS Surprise",
    "fq",
    9,
    { category: "Earnings" },
    "percentage",
  ),
  ...agoCols(
    "earning_surprise",
    "EPS Surprise",
    "fy",
    3,
    { category: "Earnings" },
    "percentage",
  ),
  ...forwardCols("eps_estimated", "EPS Estimate", "fq", 3, {
    category: "Earnings",
  }),
  ...forwardCols("eps_estimated", "EPS Estimate", "fy", 2, {
    category: "Earnings",
  }),
  ...agoCols(
    "eps_growth",
    "EPS Growth",
    "fq",
    9,
    { category: "Earnings" },
    "percentage",
  ),
  ...agoCols(
    "eps_growth",
    "EPS Growth",
    "fy",
    3,
    { category: "Earnings" },
    "percentage",
  ),
  {
    field: "eps_avg_growth_fq_2",
    headerName: "Average Quarterly EPS Growth Last 2 Qtrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  {
    field: "eps_avg_growth_fq_3",
    headerName: "Average Quarterly EPS Growth Last 3 Qtrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  {
    field: "eps_avg_growth_fy_2",
    headerName: "Average Annual EPS Growth Last 2 Yrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  {
    field: "eps_avg_growth_fy_3",
    headerName: "Average Annual EPS Growth Last 3 Yrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  // TODO: Quarterly Earnings Acceleration
  // TODO: Quarter Over Quarter EPS $ Growth
  ...forwardCols(
    "eps_estimated_growth",
    "Quarterly EPS Estimated Growth",
    "fq",
    3,
    { category: "Earnings" },
    "percentage",
  ),
  ...forwardCols(
    "eps_estimated_growth",
    "Annual EPS Estimated Growth",
    "fy",
    2,
    { category: "Earnings" },
    "percentage",
  ),
  {
    field: "eps_estimated_growth_avg_fq_2",
    headerName: "Average Quarterly Estimated EPS Growth 2 Qtrs Forward",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  {
    field: "eps_estimated_growth_avg_fq_3",
    headerName: "Average Quarterly Estimated EPS Growth 3 Qtrs Forward",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  {
    field: "eps_estimated_growth_avg_fy_2",
    headerName: "Average Annual Estimated EPS Growth 2 Yrs Forward",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  {
    field: "eps_estimated_growth_avg_fy_3",
    headerName: "Average Annual Estimated EPS Growth 3 Yrs Forward",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Earnings" },
  },
  // ##############################  Earnings  ###############################

  // ##############################  Sales  ##################################
  ...agoCols(
    "ebitda",
    "EBITDA",
    "fq",
    9,
    { category: "Sales" },
    "fundamental_price",
  ),
  ...agoCols(
    "ebit",
    "EBIT",
    "fq",
    9,
    { category: "Sales" },
    "fundamental_price",
  ),
  ...agoCols(
    "revenue",
    "Sales",
    "fq",
    9,
    { category: "Sales" },
    "fundamental_price",
  ),
  ...agoCols(
    "revenue",
    "Sales",
    "fy",
    3,
    { category: "Sales" },
    "fundamental_price",
  ),
  ...forwardCols(
    "revenue_forecast",
    "Sales Estimate",
    "fq",
    3,
    { category: "Sales" },
    "fundamental_price",
  ),
  ...forwardCols(
    "revenue_forecast",
    "Sales Estimate ",
    "fy",
    2,
    { category: "Sales" },
    "fundamental_price",
  ),
  // TODO: Quarterly Estimated Sales – Latest Reported
  // TODO: Annual Estimated Sales – Latest Reported Year
  ...agoCols(
    "revenue_growth",
    "Sales Growth",
    "fq",
    9,
    { category: "Sales" },
    "percentage",
  ),
  ...agoCols(
    "revenue_growth",
    "Sales Growth",
    "fy",
    3,
    { category: "Sales" },
    "percentage",
  ),
  {
    field: "revenue_avg_growth_fq_2",
    headerName: "Average Quarterly Sales Growth 2 Qtrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },
  {
    field: "revenue_avg_growth_fq_3",
    headerName: "Average Quarterly Sales Growth 3 Qtrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },
  {
    field: "revenue_avg_growth_fy_2",
    headerName: "Average Annual Sales Growth 2 Yrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },
  {
    field: "revenue_avg_growth_fy_3",
    headerName: "Average Annual Sales Growth 3 Yrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  }, // TODO: Quarterly Sales Acceleration

  ...agoCols(
    "revenue_growth_yoy",
    "QoQ Sales Growth",
    "fq",
    9,
    { category: "Sales" },
    "percentage",
  ),

  ...forwardCols(
    "revenue_forecast_growth",
    "Sales Growth Estimated",
    "fq",
    3,
    { category: "Sales" },
    "percentage",
  ),
  ...forwardCols(
    "revenue_forecast_growth",
    "Sales Growth Estimated",
    "fy",
    2,
    { category: "Sales" },
    "percentage",
  ),
  {
    field: "revenue_forecast_growth_avg_fq_2",
    headerName: "Average Quarterly Estimated Sales Growth 2 Qtrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },
  {
    field: "revenue_forecast_growth_avg_fq_3",
    headerName: "Average Quarterly Estimated Sales Growth 3 Qtrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },

  {
    field: "revenue_forecast_growth_avg_fy_2",
    headerName: "Average Quarterly Estimated Sales Growth 2 Yrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },
  {
    field: "revenue_forecast_growth_avg_fy_3",
    headerName: "Average Quarterly Estimated Sales Growth 3 Yrs",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Sales" },
  },
  // TODO: Quarterly Sales Acceleration
  ...agoCols(
    "revenue_surprise",
    "Sales Surprise",
    "fq",
    9,
    { category: "Sales" },
    "percentage",
  ),
  ...agoCols(
    "revenue_surprise",
    "Sales Surprise",
    "fy",
    3,
    { category: "Sales" },
    "percentage",
  ),

  // ##############################  Sales  ##################################

  // ##########################  Sector & Industry  ##########################
  {
    field: "sector",
    headerName: "Sector",
    context: { category: "Sector & Industry" },
  },
  {
    field: "group",
    headerName: "Group",
    context: { category: "Sector & Industry" },
  },
  {
    field: "industry",
    headerName: "Industry",
    context: { category: "Sector & Industry" },
  },
  {
    field: "sub_industry",
    headerName: "Sub Industry",
    context: { category: "Sector & Industry" },
  },
  // ##########################  Sector & Industry  ##########################

  // ##############################  Fundamental  ############################
  {
    field: "price_revenue_ttm",
    headerName: "Price Revenue TTM",
    context: { category: "Fundamentals" },
  },

  {
    field: "dividend_amount",
    headerName: "Last Dividend Amount",
    cellDataType: "fundamental_price" satisfies CellDataType,
    context: { category: "Fundamentals" },
  },
  // TODO: Missing Dividend Declaration Date
  //Declaration Date - Date on which dividend is declared
  //Ex Date - Date before which an investor must have purchased the stock to receive the upcoming dividend
  //Record Date- This date determines all shareholders of record who are entitled to the dividend payment and it usually occurs two days after the ex-date. Date -This is when dividend payments are issued to shareholders and it's usually about one month after the record date
  //Payment Date -This is when dividend payments are issued to shareholders and it's usually about one month after the record date
  {
    field: "divided_ex_date",
    headerName: "Last Dividend Ex Date",
    cellDataType: "date" satisfies CellDataType,
    context: { category: "Fundamentals" },
  },
  {
    field: "dividend_yield",
    headerName: "Dividend Yield",
    context: { category: "Fundamentals" },
  },
  {
    field: "price_earnings_ttm",
    headerName: "Price Earning",
    context: { category: "Fundamentals" },
  },
  {
    field: "price_earnings_run_rate",
    headerName: "Price Earning Run Rate",
    context: { category: "Fundamentals" },
  },
  {
    field: "forward_price_earnings",
    headerName: "Forward Price Earnings",
    context: { category: "Fundamentals" },
  },

  ...agoCols(
    "net_income",
    "Net Income",
    "fy",
    2,
    { category: "Fundamentals" },
    "fundamental_price",
  ),
  ...agoCols(
    "total_assets",
    "Total Assets",
    "fq",
    3,
    { category: "Fundamentals" },
    "fundamental_price",
  ),
  ...agoCols(
    "total_liabilities",
    "Total Liabilities",
    "fq",
    3,
    { category: "Fundamentals" },
    "fundamental_price",
  ),
  ...agoCols("current_ratio", "Current Ratio", "fq", 3, {
    category: "Fundamentals",
  }),
  {
    field: "net_income_ttm_0",
    headerName: "Net Income TTM",
    context: { category: "Fundamentals" },
  },

  {
    field: "price_earnings_growth_ttm",
    headerName: "Price Earning Growth",
    context: { category: "Fundamentals" },
  },
  {
    field: "price_sales_ttm",
    headerName: "Price Sales",
    context: { category: "Fundamentals" },
  },
  ...agoCols("price_earnings", "Price Earning", "fq", 3, {
    category: "Fundamentals",
  }),
  ...agoCols("debt_to_equity", "Debt to Equity", "fq", 3, {
    category: "Fundamentals",
  }),
  ...agoCols("price_book", "Price Book", "fq", 3, { category: "Fundamentals" }),
  ...agoCols("price_sales", "Price Sales", "fy", 3, {
    category: "Fundamentals",
  }),
  // ##############################  Fundamental  ############################
  // ######################  Price and Volume  #######################
  {
    field: "price_change_today_abs",
    headerName: "Price Change Today",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_change_from_open_abs",
    headerName: "Price Change from Open",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_change_from_high_abs",
    headerName: "Price Change from High",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_change_from_low_abs",
    headerName: "Price Change from Low",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_change_today_pct",
    headerName: "Price % Change Today",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_from_open_pct",
    headerName: "Price % Change from Open",
    cellDataType: "percentage" satisfies CellDataType,
    // TODO Colorize
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_from_high_pct",
    headerName: "Price % Change from High",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  // TODO: Missing field
  // {
  //   field: "price_change_from_low_pct",
  //   headerName: "Price % Change from Low",
  //   context: {
  //     format: "numeric",
  //     sign: "%",
  //     colorize: true,
  //     category: "Price & Volume",
  //   },
  // },
  {
    field: "dcr",
    headerName: "DCR",
    cellRenderer: CandleStickCell,
    cellRendererParams: {
      open_col: "day_open",
      high_col: "day_high",
      low_col: "day_low",
      close_col: "day_close",
    },
    context: { category: "Price & Volume" },
  },
  {
    field: "wcr",
    headerName: "WCR",
    cellRenderer: CandleStickCell,
    cellRendererParams: {
      open_col: "week_open",
      high_col: "week_high",
      low_col: "week_low",
      close_col: "week_close",
    },
    context: { category: "Price & Volume" },
  },
  {
    field: "mcr",
    headerName: "MCR",
    cellRenderer: CandleStickCell,
    cellRendererParams: {
      open_col: "month_open",
      high_col: "month_high",
      low_col: "month_low",
      close_col: "month_close",
    },
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_daily_vwap_pct",
    headerName: "Away From Daily VWAP",
    cellDataType: "percentage" satisfies CellDataType,
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_weekly_vwap_pct",
    headerName: "Away From Weekly VWAP",
    cellDataType: "percentage" satisfies CellDataType,
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_monthly_vwap_pct",
    headerName: "Away From Monthly VWAP",
    cellDataType: "percentage" satisfies CellDataType,
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_yearly_vwap_pct",
    headerName: "Away From YTD VWAP",
    cellDataType: "percentage" satisfies CellDataType,
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
    context: { category: "Price & Volume" },
  },
  {
    field: "price_above_daily_vwap",
    headerName: "Price Above Daily VWAP",
    cellRenderer: BooleanCell,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_above_weekly_vwap",
    headerName: "Price Above Weekly VWAP",
    cellRenderer: BooleanCell,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_above_monthly_vwap",
    headerName: "Price Above Monthly VWAP",
    cellRenderer: BooleanCell,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_above_yearly_vwap",
    headerName: "Price Above Yearly VWAP",
    cellRenderer: BooleanCell,
    context: { category: "Price & Volume" },
  },
  {
    field: "daily_vwap",
    headerName: "Daily VWAP",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "weekly_vwap",
    headerName: "Weekly VWAP",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "monthly_vwap",
    headerName: "Monthly VWAP",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "yearly_vwap",
    headerName: "YTD VWAP",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "gap_dollar_D",
    headerName: "Gap $ Daily",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "gap_dollar_W",
    headerName: "Gap $ Weekly",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "gap_dollar_M",
    headerName: "Gap $ Monthly",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "gap_pct_D",
    headerName: "Gap % Daily",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "gap_pct_W",
    headerName: "Gap % Weekly",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "gap_pct_M",
    headerName: "Gap % Monthly",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "unfilled_gap_D",
    headerName: "Unfilled Gap $ Daily",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "unfilled_gap_W",
    headerName: "Unfilled Gap $ Weekly",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "unfilled_gap_M",
    headerName: "Unfilled Gap $ Monthly",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "unfilled_gap_pct_D",
    headerName: "Unfilled Gap % Daily",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "unfilled_gap_pct_W",
    headerName: "Unfilled Gap % Weekly",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "unfilled_gap_pct_M",
    headerName: "Unfilled Gap % Monthly",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "high_52_week",
    headerName: "High 52W",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "low_52_week",
    headerName: "Low 52W",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "high_52_week_today",
    headerName: "High 52W Today",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "low_52_week_today",
    headerName: "Low 52W Today",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_52_week_high_pct",
    headerName: "Away from 52W High",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_52_week_low_pct",
    headerName: "Away from 52W Low",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "all_time_high",
    headerName: "All Time High",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "all_time_low",
    headerName: "All Time Low",
    cellDataType: "price" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "all_time_high_today",
    headerName: "All Time High Today",
    context: { category: "Price & Volume" },
  },
  {
    field: "all_time_low_today",
    headerName: "All Time Low Today",
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_all_time_high_pct",
    headerName: "Away from All Time High",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "away_from_all_time_low_pct",
    headerName: "Away from All Time Low",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "price_change_since_earning_pct",
    headerName: "Price Change % Last Earning",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_1W",
    headerName: "Price Change % Current Week",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_curr_week_open_pct",
    headerName: "Price Change % Current Week Open",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_2D",
    headerName: "Price Change % 2D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_3D",
    headerName: "Price Change % 3D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_4D",
    headerName: "Price Change % 4D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_1M",
    headerName: "Price Change % MTD",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_2M",
    headerName: "Price Change % 2M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_3M",
    headerName: "Price Change % 3M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_4M",
    headerName: "Price Change % 4M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_5M",
    headerName: "Price Change % 5M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_6M",
    headerName: "Price Change % 6M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_7M",
    headerName: "Price Change % 7M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_8M",
    headerName: "Price Change % 8M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_9M",
    headerName: "Price Change % 9M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_10M",
    headerName: "Price Change % 10M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_11M",
    headerName: "Price Change % 11M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_1Y",
    headerName: "Price Change % YTD",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_2Y",
    headerName: "Price Change % 2Y",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_3Y",
    headerName: "Price Change % 3Y",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_change_pct_4Y",
    headerName: "Price Change % 4Y",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_5D",
    headerName: "Price vs SMA 5D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_10D",
    headerName: "Price vs SMA 10D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_20D",
    headerName: "Price vs SMA 20D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_30D",
    headerName: "Price vs SMA 30D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_40D",
    headerName: "Price vs SMA 40D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_50D",
    headerName: "Price vs SMA 50D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_100D",
    headerName: "Price vs SMA 100D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_200D",
    headerName: "Price vs SMA 200D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_10W",
    headerName: "Price vs SMA 10W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_20W",
    headerName: "Price vs SMA 20W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_30W",
    headerName: "Price vs SMA 30W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_40W",
    headerName: "Price vs SMA 40W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "price_vs_price_sma_50W",
    headerName: "Price vs SMA 50W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "relative_vol_5D",
    headerName: "RV 5D",
    cellRenderer: VolumeCell,
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_10D",
    headerName: "RV 10D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_20D",
    headerName: "RV 20D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_30D",
    headerName: "RV 30D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_40D",
    headerName: "RV 40D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_50D",
    headerName: "RV 50D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_100D",
    headerName: "RV 100D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "relative_vol_200D",
    headerName: "RV 200D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_5D",
    headerName: "Run Rate 5D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_10D",
    headerName: "Run Rate 10D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_20D",
    headerName: "Run Rate 20D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_30D",
    headerName: "Run Rate 30D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_40D",
    headerName: "Run Rate 40D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_50D",
    headerName: "Run Rate 50D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_100D",
    headerName: "Run Rate 100D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "run_rate_vol_200D",
    headerName: "Run Rate 200D",
    cellRendererParams: { activityLevel: 1.5, bold: true },
    context: { category: "Price & Volume" },
  },
  {
    field: "up_down_day_20D",
    headerName: "U/D 20D",
    context: { category: "Price & Volume" },
  },
  {
    field: "up_down_day_50D",
    headerName: "U/D 50D",
    context: { category: "Price & Volume" },
  },
  // TODO: Check this
  {
    field: "highest_vol_since_earning",
    headerName: "HVLE",
    context: { category: "Price & Volume" },
    cellRenderer: BooleanCell,
  },
  {
    field: "highest_vol_in_1_year",
    headerName: "HV1",
    context: { category: "Price & Volume" },
    cellRenderer: BooleanCell,
  },
  {
    field: "highest_vol_ever",
    headerName: "HVE",
    context: { category: "Price & Volume" },
    cellRenderer: BooleanCell,
  },
  {
    field: "price_volume",
    headerName: "Dollar Volume",
    context: { category: "Price & Volume" },
  },
  {
    field: "price_volume_sma_20D",
    headerName: "Dollar Volume 20D",
    context: { category: "Price & Volume" },
  },
  {
    field: "price_volume_sma_50D",
    headerName: "Dollar Volume 50D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_5D",
    headerName: "Vol SMA 5D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_10D",
    headerName: "Vol SMA 10D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_20D",
    headerName: "Vol SMA 20D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_30D",
    headerName: "Vol SMA 30D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_40D",
    headerName: "Vol SMA 40D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_50D",
    headerName: "Vol SMA 50D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_100D",
    headerName: "Vol SMA 100D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_200D",
    headerName: "Vol SMA 200D",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_10W",
    headerName: "Vol SMA 10W",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_20W",
    headerName: "Vol SMA 20W",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_30W",
    headerName: "Vol SMA 30W",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_40W",
    headerName: "Vol SMA 40W",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_sma_50W",
    headerName: "Vol SMA 50W",
    context: { category: "Price & Volume" },
  },
  {
    field: "vol_vs_yesterday_vol",
    headerName: "Vol vs Yesterday Vol",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "week_vol_vs_prev_week_vol",
    headerName: "Week Vol vs Last Week Vol",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },

  {
    field: "vol_vs_vol_sma_5D",
    headerName: "Vol vs SMA 5D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_10D",
    headerName: "Vol vs SMA 10D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_20D",
    headerName: "Vol vs SMA 20D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_30D",
    headerName: "Vol vs SMA 30D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_40D",
    headerName: "Vol vs SMA 40D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_50D",
    headerName: "Vol vs SMA 50D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_100D",
    headerName: "Vol vs SMA 100D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_200D",
    headerName: "Vol vs SMA 200D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_10W",
    headerName: "Vol vs SMA 10W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_20W",
    headerName: "Vol vs SMA 20W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_30W",
    headerName: "Vol vs SMA 30W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_40W",
    headerName: "Vol vs SMA 40W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "vol_vs_vol_sma_50W",
    headerName: "Vol vs SMA 50W",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
    cellClass: ({ value = 0 }: CellClassParams<Symbol, number>) =>
      cn("font-bold", {
        "text-bullish": value !== null && value > 0,
        "text-bearish": value !== null && value < 0,
      }),
  },
  {
    field: "float_turnover",
    headerName: "Float Turnover",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "float_turnover_sma_20D",
    headerName: "Float Turnover SMA 20D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },
  {
    field: "float_turnover_sma_50D",
    headerName: "Float Turnover SMA 50D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Price & Volume" },
  },

  // ######################  Price and Volume  #######################

  // ##########################  Technical  ##########################

  {
    field: "beta_1_year",
    headerName: "Beta 1Y",
    context: { category: "Technicals" },
  },
  {
    field: "beta_3_year",
    headerName: "Beta 3 Yrs",
    context: { category: "Technicals" },
  },
  {
    field: "beta_5_year",
    headerName: "Beta 5Y",
    context: { category: "Technicals" },
  },

  {
    field: "day_open_gt_prev_open",
    headerName: "Day Open > Prev Day Open",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_high_gt_prev_high",
    headerName: "Day High > Prev Day High",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_low_gt_prev_low",
    headerName: "Day Low > Prev Day Low",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_close_gt_prev_close",
    headerName: "Day Close > Prev Day Close",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_open_lt_prev_open",
    headerName: "Day Open < Prev Day Open",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_high_lt_prev_high",
    headerName: "Day High < Prev Day High",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_low_lt_prev_low",
    headerName: "Day Low < Prev Day Low",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_close_lt_prev_close",
    headerName: "Day Close < Prev Day Close",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_open_eq_high",
    headerName: "Day Open = Day High",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "day_open_eq_low",
    headerName: "Day Open = Day Low",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "inside_day",
    headerName: "Inside Day",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "double_inside_day",
    headerName: "Double Inside Day",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "inside_week",
    headerName: "Inside Week",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "double_inside_week",
    headerName: "Double Inside Week",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "outside_day",
    headerName: "Outside Day",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "outside_week",
    headerName: "Outside Week",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "outside_bullish_day",
    headerName: "Outside Bullish Day",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "outside_bearish_day",
    headerName: "Outside Bearish Day",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "outside_bullish_week",
    headerName: "Outside Bullish Week",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "outside_bearish_week",
    headerName: "Outside Bearish Week",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "wick_play",
    headerName: "Wick Play",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "in_the_wick",
    headerName: "In the Wick",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "3_line_strike_bearish",
    headerName: "3 Line Strike Bearish",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "3_line_strike_bullish",
    headerName: "3 Line Strike Bullish",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "3_bar_break",
    headerName: "3 Bar Break",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "bullish_reversal",
    headerName: "Bullish Reversal",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "upside_reversal",
    headerName: "Upside Reversal",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "oops_reversal",
    headerName: "Oops Reversal",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "key_reversal",
    headerName: "Key Reversal",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "pocket_pivot",
    headerName: "Pocket Pivot",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "volume_dry_up",
    headerName: "Volume Dry Up Day",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "slingshot",
    headerName: "Slingshot",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "minicoil",
    headerName: "Slingshot",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "3_week_tight",
    headerName: "3 Week Tight",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "5_week_up",
    headerName: "5 Week Tight",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "high_tight_flag",
    headerName: "High Tight Flag",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "ants",
    headerName: "Ants",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "power_trend",
    headerName: "Power Trend",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "launchpad",
    headerName: "Launchpad Daily",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "launchpad_weekly",
    headerName: "Launchpad Weekly",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  // TODO: Missing  Green Line Breakout
  {
    field: "doji",
    headerName: "Doji",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "morning_star",
    headerName: "Morning Star",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "evening_star",
    headerName: "Evening Star",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "shooting_star",
    headerName: "Shooting Star",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "hammer",
    headerName: "Hammer",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "inverted_hammer",
    headerName: "Inverted Hammer",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "bearish_harami",
    headerName: "Bearish Hammer",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "bullish_harami",
    headerName: "Bullish Hammer",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  // TODO: Missing  Engulfing, Kicker
  {
    field: "piercing_line",
    headerName: "Piercing Line",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "hanging_man",
    headerName: "Hanging Man",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "dark_cloud_cover",
    headerName: "Dark Cloud Cover",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "gravestone_doji",
    headerName: "Gravestone Doji",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "3_back_crows",
    headerName: "3 Black Crows",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "dragonfly_doji",
    headerName: "Dragonfly Doji",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "3_white_soldiers",
    headerName: "3 White Soldier",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "sigma_spike",
    headerName: "Sigma Spike",
    context: { category: "Technicals" },
  },
  {
    field: "stan_weinstein_stage",
    headerName: "Stan Weinstein Stage",
    context: { category: "Technicals" },
  },
  {
    field: "sma_200_vs_sma_200_1M_ago",
    headerName: "200D SMA > 200SMA 1M Ago",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "sma_200_vs_sma_200_2M_ago",
    headerName: "200D SMA > 200SMA 2M Ago",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "sma_200_vs_sma_200_3M_ago",
    headerName: "200D SMA > 200SMA 3M Ago",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "sma_200_vs_sma_200_4M_ago",
    headerName: "200D SMA > 200SMA 4M Ago",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "sma_200_vs_sma_200_5M_ago",
    headerName: "200D SMA > 200SMA 5M Ago",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "sma_200_vs_sma_200_6M_ago",
    headerName: "200D SMA > 200SMA 6M Ago",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "alpha_6M",
    headerName: "Alpha 6M",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "10Dsma_vs_ema_slope_pct",
    headerName: "10D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "20Dsma_vs_ema_slope_pct",
    headerName: "20D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "30Dsma_vs_ema_slope_pct",
    headerName: "30D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "40Dsma_vs_ema_slope_pct",
    headerName: "40D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "50Dsma_vs_ema_slope_pct",
    headerName: "50D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "100Dsma_vs_ema_slope_pct",
    headerName: "100D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "200Dsma_vs_ema_slope_pct",
    headerName: "200D SMA Vs EMA Slope %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },

  {
    field: "10Dsma_vs_ema_slope_adr",
    headerName: "10D SMA Vs EMA Slope ADR",
    context: { category: "Technicals" },
  },
  {
    field: "20Dsma_vs_ema_slope_adr",
    headerName: "20D SMA Vs EMA Slope ADR",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "30Dsma_vs_ema_slope_adr",
    headerName: "30D SMA Vs EMA Slope ADR",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "40Dsma_vs_ema_slope_adr",
    headerName: "40D SMA Vs EMA Slope ADR",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "50Dsma_vs_ema_slope_adr",
    headerName: "50D SMA Vs EMA Slope ADR",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "100Dsma_vs_ema_slope_adr",
    headerName: "100D SMA Vs EMA Slope ADR",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "200Dsma_vs_ema_slope_adr",
    headerName: "200D SMA Vs EMA Slope ADR",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_5D",
    headerName: "RS 5D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_10D",
    headerName: "RS 10D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_15D",
    headerName: "RS 15D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_20D",
    headerName: "RS 20D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_25D",
    headerName: "RS 25D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_30D",
    headerName: "RS 30D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_60D",
    headerName: "RS 60D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_90D",
    headerName: "RS 90D",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },

  {
    field: "RS_5D_pct",
    headerName: "RS 5D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_10D_pct",
    headerName: "RS 10D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_15D_pct",
    headerName: "RS 15D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_20D_pct",
    headerName: "RS 20D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_25D_pct",
    headerName: "RS 25D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_30D_pct",
    headerName: "RS 30D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_60D_pct",
    headerName: "RS 60D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_90D_pct",
    headerName: "RS 90D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "RS_Value_1M",
    headerName: "RS Value 1M",
    context: { category: "Technicals" },
  },
  {
    field: "RS_Value_3M",
    headerName: "RS Value 3M",
    context: { category: "Technicals" },
  },
  {
    field: "RS_Value_6M",
    headerName: "RS Value 6M",
    context: { category: "Technicals" },
  },
  {
    field: "RS_Value_9M",
    headerName: "RS Value 9M",
    context: { category: "Technicals" },
  },
  {
    field: "RS_Value_12M",
    headerName: "RS Value 12M",
    context: { category: "Technicals" },
  },
  {
    field: "RSNH_1M",
    headerName: "RSNH 1M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNH_3M",
    headerName: "RSNH 3M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNH_6M",
    headerName: "RSNH 6M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNH_9M",
    headerName: "RSNH 9M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNH_12M",
    headerName: "RSNH 12M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNHBP_1M",
    headerName: "RSNHBP 1M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNHBP_3M",
    headerName: "RSNHBP 3M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNHBP_6M",
    headerName: "RSNHBP 6M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNHBP_9M",
    headerName: "RSNHBP 9M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "RSNHBP_12M",
    headerName: "RSNHBP 12M",
    cellRenderer: BooleanCell,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_1D",
    headerName: "ADR 1D $",
    context: { category: "Technicals" },
  },
  {
    field: "ADR_2D",
    headerName: "ADR 2D $",
    context: { category: "Technicals" },
  },
  {
    field: "ADR_5D",
    headerName: "ADR 5D $",
    context: { category: "Technicals" },
  },
  {
    field: "ADR_10D",
    headerName: "ADR 10D $",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_14D",
    headerName: "ADR 14D $",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_20D",
    headerName: "ADR 20D $",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },

  {
    field: "ADR_pct_1D",
    headerName: "ADR 1D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_pct_2D",
    headerName: "ADR 2D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_pct_5D",
    headerName: "ADR 5D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_pct_10D",
    headerName: "ADR 10D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_pct_14D",
    headerName: "ADR 14D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ADR_pct_20D",
    headerName: "ADR 20D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ATR_2D",
    headerName: "ATR 2D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ATR_5D",
    headerName: "ATR 5D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ATR_10D",
    headerName: "ATR 10D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ATR_14D",
    headerName: "ATR 14D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },
  {
    field: "ATR_20D",
    headerName: "ATR 20D %",
    cellDataType: "percentage" satisfies CellDataType,
    context: { category: "Technicals" },
  },

  // ##########################  Technical  ##########################

  // ##########################  Ratings  ##########################
  {
    field: "AS_Rating_1D",
    headerName: "AS Rating 1D",
    context: { category: "Ratings" },
  },
  {
    field: "AS_Rating_1W",
    headerName: "AS Rating 1W",
    context: { category: "Ratings" },
  },
  {
    field: "AS_Rating_1M",
    headerName: "AS Rating 1M",
    context: { category: "Ratings" },
  },
  {
    field: "AS_Rating_3M",
    headerName: "AS Rating 3M",
    context: { category: "Ratings" },
  },
  {
    field: "AS_Rating_6M",
    headerName: "AS Rating 6M",
    context: { category: "Ratings" },
  },
  {
    field: "AS_Rating_9M",
    headerName: "AS Rating 9M",
    context: { category: "Ratings" },
  },
  {
    field: "AS_Rating_12M",
    headerName: "AS Rating 12M",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_1D",
    headerName: "RS Rating 1D",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_1W",
    headerName: "RS Rating 1W",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_1M",
    headerName: "RS Rating 1M",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_3M",
    headerName: "RS Rating 3M",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_6M",
    headerName: "RS Rating 6M",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_9M",
    headerName: "RS Rating 9M",
    context: { category: "Ratings" },
  },
  {
    field: "RS_Rating_12M",
    headerName: "RS Rating 12M",
    context: { category: "Ratings" },
  },

  {
    field: "sector_rating_1D",
    headerName: "Sector Rating 1D",
    context: { category: "Ratings" },
  },
  {
    field: "sector_rating_1W",
    headerName: "Sector Rating 1W",
    context: { category: "Ratings" },
  },
  {
    field: "sector_rating_1M",
    headerName: "Sector Rating 1M",
    context: { category: "Ratings" },
  },
  {
    field: "sector_rating_3M",
    headerName: "Sector Rating 3M",
    context: { category: "Ratings" },
  },
  {
    field: "sector_rating_6M",
    headerName: "Sector Rating 6M",
    context: { category: "Ratings" },
  },
  {
    field: "sector_rating_9M",
    headerName: "Sector Rating 9M",
    context: { category: "Ratings" },
  },
  {
    field: "sector_rating_12M",
    headerName: "Sector Rating 12M",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_1D",
    headerName: "Industry Rating 1D",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_1W",
    headerName: "Industry Rating 1W",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_1M",
    headerName: "Industry Rating 1M",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_3M",
    headerName: "Industry Rating 3M",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_6M",
    headerName: "Industry Rating 6M",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_9M",
    headerName: "Industry Rating 9M",
    context: { category: "Ratings" },
  },
  {
    field: "industry_rating_12M",
    headerName: "Industry Rating 12M",
    context: { category: "Ratings" },
  },

  {
    field: "sub_industry_rating_1D",
    headerName: "Sub Industry Rating 1D",
    context: { category: "Ratings" },
  },
  {
    field: "sub_industry_rating_1W",
    headerName: "Sub Industry Rating 1W",
    context: { category: "Ratings" },
  },
  {
    field: "sub_industry_rating_1M",
    headerName: "Sub Industry Rating 1M",
    context: { category: "Ratings" },
  },
  {
    field: "sub_industry_rating_3M",
    headerName: "Sub Industry Rating 3M",
    context: { category: "Ratings" },
  },
  {
    field: "sub_industry_rating_6M",
    headerName: "Sub Industry Rating 6M",
    context: { category: "Ratings" },
  },
  {
    field: "sub_industry_rating_9M",
    headerName: "Sub Industry Rating 9M",
    context: { category: "Ratings" },
  },
  {
    field: "sub_industry_rating_12M",
    headerName: "Sub Industry Rating 12M",
    context: { category: "Ratings" },
  },
  // ##########################  Ratings  ##########################
].map((c) => ({ ...c, colId: c.field as keyof Symbol }) as ColDef<Symbol>);

// ##########################  Custom Cell UI  ##########################

interface FormattedValueProps {
  value?: unknown;
  data: Symbol;
}

export function BooleanCell(props: FormattedValueProps) {
  const { value } = props;
  return value ? <Check className="size-4" /> : <X className="size-4" />;
}

interface CandleStickCellProps extends FormattedValueProps {
  open_col: string;
  high_col: string;
  low_col: string;
  close_col: string;
}

export function CandleStickCell(props: CandleStickCellProps) {
  const {
    data: symbol,
    value: cellValue,
    open_col,
    high_col,
    low_col,
    close_col,
  } = props;
  let candlestick: ReactNode;
  if (!symbol) return "-";

  if (open_col && high_col && low_col && close_col) {
    const open = symbol[open_col as keyof Symbol] as number;
    const high = symbol[high_col as keyof Symbol] as number;
    const low = symbol[low_col as keyof Symbol] as number;
    const close = symbol[close_col as keyof Symbol] as number;

    if (open && high_col && low_col && close_col) {
      candlestick = (
        <Candlestick open={open} high={high} low={low} close={close} />
      );
    }
  }

  const rangeValue = cellValue as number;
  const value = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "percent",
  }).format(rangeValue / 100);

  if (candlestick) {
    return (
      <div className="inline-flex gap-4">
        {candlestick}
        {value}
      </div>
    );
  }
  return <span>{value}</span>;
}

export function SymbolCell(props: FormattedValueProps) {
  const { data: symbol, value } = props;
  if (!symbol) return "-";

  const text = value;
  const logo = symbol.logo;

  const days = symbol.earnings_release_next_date
    ? DateTime.fromISO(symbol.earnings_release_next_date).diffNow("day").days
    : undefined;
  const earningFlag = days !== undefined && days <= 14 && days >= 0;

  const earningFlagRed = earningFlag && days >= 0 && days <= 7;

  const earningFlagGrey = earningFlag && days > 7 && days <= 14;

  const showEarningFlag = earningFlag || earningFlag;
  return (
    <div className="inline-flex justify-start items-center gap-2 align-middle">
      <Image
        src={[`${process.env.NEXT_PUBLIC_LOGO_BASE_URL}`, `${logo}.svg`].join(
          "/",
        )}
        alt="Logo"
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="font-bold">{String(text)}</span>
      {showEarningFlag && (
        <Flag
          className={cn("size-3", {
            "text-red-500": earningFlagRed,
            "text-gray-500": earningFlagGrey,
          })}
        />
      )}
    </div>
  );
}

interface LogoTextCellProps extends FormattedValueProps {
  logoCol?: string;
  logoPrefix?: string;
}

export function LogoTextCell(props: LogoTextCellProps) {
  const { value, data, logoPrefix, logoCol } = props;
  if (!value) return "-";
  const text = value as string;
  let logo = logoCol ? (data[logoCol as keyof Symbol] as string) : undefined;
  logo = logoPrefix ? [logoPrefix, logo].join("/") : logo;

  return (
    <div className="inline-flex justify-start items-center gap-2 align-middle">
      <Image
        src={["/external/logos/", logo + ".svg"].join("/")}
        alt="Logo"
        width={24}
        height={24}
        className="rounded-full"
      />
      <span className="font-bold">{String(text)}</span>
    </div>
  );
}

interface VolumeCellProps extends FormattedValueProps {
  activityLevel: number;
  bold: boolean;
}

export function VolumeCell(props: VolumeCellProps) {
  const { value, activityLevel, bold } = props;
  if (!value) return "-";

  const showIndicator =
    activityLevel !== undefined &&
    activityLevel !== null &&
    typeof value === "number" &&
    value >= (activityLevel as number);

  return (
    <div className={cn("inline-flex gap-1", { "font-bold": bold })}>
      <span
        className={cn("text-volume-activity", {
          "opacity-0": !showIndicator,
        })}
      >
        •
      </span>
      <span>{value?.toString()}</span>
    </div>
  );
}
