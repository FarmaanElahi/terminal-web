"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import Image from "next/image";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

const CURRENCY_SYMBOL = {
  INR: "\u20B9",
  USD: "\u0024",
} as Record<string, string>;

const DEFAULT_NUMBER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

function SymbolCell(props: { cell: CellContext<Symbol, unknown> }) {
  const { cell } = props;
  const text = cell.getValue() as string;
  const logo = cell.row.original.logo;
  const symbol = cell.row.original;

  const days = symbol.earnings_release_next_date
    ? DateTime.fromMillis(symbol.earnings_release_next_date).diffNow("day").days
    : undefined;
  const earningFlag = days !== undefined && days <= 14 && days >= 0;

  const earningFlagRed = earningFlag && days >= 0 && days <= 7;

  const earningFlagGrey = earningFlag && days > 7 && days <= 14;

  const showEarningFlag = earningFlag || earningFlag;
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

function LogoTextCell(props: {
  cell: CellContext<Symbol, unknown>;
  logoCol?: keyof Symbol;
  logoPrefix?: string;
}) {
  const { cell, logoCol, logoPrefix } = props;
  const text = cell.getValue() as string;
  let logo = logoCol ? cell.row.original[logoCol] : undefined;
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

function DateCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();

  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }
  const str = DateTime.fromMillis(value).toFormat("dd/MM/yyyy");
  return <span>{str}</span>;
}

function NumericCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const meta = (cell.column.columnDef.meta ?? {}) as Record<string, unknown>;
  const { sign, maximumFractionDigits, colorize } = meta;
  const numberFormater = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: (maximumFractionDigits as number) ?? 2,
  });
  const result = [numberFormater.format(value), sign].filter((s) => s).join("");
  const colorClassName = colorize
    ? {
        "text-pink-500 font-bold": value > 0,
        "text-blue-500 font-bold": value < 0,
      }
    : {};
  return <span className={cn(colorClassName)}>{result}</span>;
}

function CurrencyCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const currencyCode = cell.row.original.currency as string;
  const currentSymbol = currencyCode
    ? CURRENCY_SYMBOL[currencyCode]
    : undefined;

  const toCR = value > 100000;

  const amount = toCR
    ? DEFAULT_NUMBER_FORMATTER.format(value / 10000000) + "Cr"
    : value;

  return (
    <span>
      {currentSymbol}
      {amount}
    </span>
  );
}

function PriceCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const num = DEFAULT_NUMBER_FORMATTER.format(value);
  return <span>{num}</span>;
}

function FormattedCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const meta = (cell.column.columnDef.meta ?? {}) as Record<string, string>;
  const { defaultValue, format } = meta;
  const value = cell.getValue() || (defaultValue as string) || "-";
  if (format === "symbol") {
    return <SymbolCell cell={cell} />;
  }
  if (format === "date") {
    return <DateCell cell={cell} />;
  }
  if (format === "textlogo") {
    return (
      <LogoTextCell
        cell={cell}
        logoCol={meta.logoCol as keyof Symbol}
        logoPrefix={meta.logoPrefix as string}
      />
    );
  }
  if (format === "currency") {
    return <CurrencyCell cell={cell} />;
  }
  if (format === "numeric") {
    return <NumericCell cell={cell} />;
  }
  if (format === "price") {
    return <PriceCell cell={cell} />;
  }
  return <span>{String(value)}</span>;
}

function agoCols(
  meta: Record<string, unknown>,
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
): ColumnDef<Symbol>[] {
  const freqNameMapping = { fq: "Qtr", fy: "Yr" } as Record<
    typeof freq,
    string
  >;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColumnDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist =
      i === 0
        ? `Latest ${freqName}`
        : i === 1
          ? `Prior ${freqName}`
          : undefined;

    hist = hist ? hist : `${i} ${freqName}s Ago`;
    cols.push({
      accessorKey: [metric, freq, i].join("_"),
      header: [name_prefix, hist, meta.sign].filter((s) => s).join(" "),
      meta,
    });
  }
  return cols;
}

function forwardCols(
  meta: Record<string, unknown>,
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
): ColumnDef<Symbol>[] {
  const freqNameMapping = { fq: "Qtr", fy: "Yr" } as Record<
    typeof freq,
    string
  >;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColumnDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist = i === 0 ? `Next ${freqName}` : undefined;
    hist = hist ? hist : `${i + 1} ${freqName}s Forward`;
    cols.push({
      accessorKey: [metric, freq, i].join("_"),
      header: [name_prefix, hist, meta.sign].filter((s) => s).join(" "),
      meta,
    });
  }
  return cols;
}

export let columns: ColumnDef<Symbol>[] = [
  // #############################  Generals  ################################

  { accessorKey: "isin", header: "ISIN", meta: { category: "General" } },
  {
    accessorKey: "name",
    header: "Symbol",
    meta: { format: "symbol", category: "General" },
  },
  {
    accessorKey: "day_open",
    header: "Open",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "day_high",
    header: "High",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "day_low",
    header: "Low",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "day_close",
    header: "Last",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "day_volume",
    header: "Volume",
    meta: { format: "numeric", category: "General" },
  },
  {
    accessorKey: "week_open",
    header: "Week Open",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "week_high",
    header: "Week High",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "week_low",
    header: "Week Low",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "week_close",
    header: "Week Close",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "week_volume",
    header: "Week Volume",
    meta: { format: "numeric", category: "General" },
  },
  {
    accessorKey: "month_open",
    header: "Month Open",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "month_high",
    header: "Month High",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "month_low",
    header: "Month Low",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "month_close",
    header: "Month Close",
    meta: { format: "price", category: "General" },
  },
  {
    accessorKey: "month_volume",
    header: "Month Volume",
    meta: { format: "numeric", category: "General" },
  },
  {
    accessorKey: "description",
    header: "Name",
    meta: { category: "General" },
  },
  {
    accessorKey: "website",
    header: "Website",
    meta: { category: "General" },
  },
  {
    accessorKey: "ceo",
    header: "CEO",
    meta: { category: "General" },
  },
  {
    accessorKey: "employees",
    header: "Employee Count",
    meta: { category: "General" },
  },
  {
    accessorKey: "country",
    header: "Country",
    meta: {
      format: "textlogo",
      logoCol: "country_code",
      logoPrefix: "country",
      category: "General",
    },
  },
  { accessorKey: "location", header: "City", meta: { category: "General" } },
  {
    accessorKey: "ipo_date",
    header: "IPO Date",
    meta: { format: "date", category: "General" },
  },
  {
    accessorKey: "most_recent_split",
    header: "Recent Split",
    meta: { format: "date", category: "General" },
  },
  { accessorKey: "type", header: "Type", meta: { category: "General" } },
  {
    accessorKey: "exchange",
    header: "Exchange",
    meta: { format: "textlogo", logoCol: "exchange_logo", category: "General" },
  },
  {
    accessorKey: "mcap",
    header: "Market Cap",
    meta: { format: "currency", category: "General" },
  },
  {
    accessorKey: "shares_float",
    header: "Shares Float",
    meta: { format: "numeric", maximumFractionDigits: 0, category: "General" },
  },
  {
    // Weighted Shares Outstanding.
    accessorKey: "total_shares_outstanding",
    header: "Total Outstanding Shares",
    meta: { format: "numeric", maximumFractionDigits: 0, category: "General" },
  },
  // TODO: Add Non-Weighted Shares Outstanding
  {
    accessorKey: "timezone",
    header: "Timezone",
    meta: { category: "General" },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    meta: { format: "textlogo", logoCol: "currency_logo", category: "General" },
  },
  // #############################  Generals  ################################

  // ##############################  Earnings  ###############################
  {
    accessorKey: "earnings_release_date",
    header: "Earnings Date",
    meta: { format: "date", category: "Earnings" },
  },
  {
    accessorKey: "earnings_release_next_date",
    header: "Next Earnings Date",
    meta: { format: "date", category: "Earnings" },
  },
  {
    accessorKey: "days_since_latest_earning",
    header: "Days since last earning",
    meta: { format: "numeric", category: "Earnings" },
  },
  {
    accessorKey: "earnings_per_share_ttm",
    header: "EPS TTM",
    meta: { format: "numeric", category: "Earnings" },
  },

  ...agoCols(
    { format: "numeric", category: "Earnings" },
    "eps",
    "Quarterly EPS",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "numeric", category: "Earnings" },
    "eps",
    "Annual EPS",
    "fy",
    3,
  ),

  ...agoCols(
    { format: "numeric", sign: "%", category: "Earnings" },
    "earning_surprise",
    "Quarterly EPS Surprise",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "numeric", sign: "%", category: "Earnings" },
    "earning_surprise",
    "Annual EPS Surprise",
    "fy",
    3,
  ),
  ...forwardCols(
    { format: "numeric", category: "Earnings" },
    "eps_estimated",
    "Quarterly EPS Estimate",
    "fq",
    3,
  ),
  ...forwardCols(
    { format: "numeric", category: "Earnings" },
    "eps_estimated",
    "Annual EPS Estimate",
    "fy",
    2,
  ),
  ...agoCols(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_growth",
    "Quarterly EPS Growth",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_growth",
    "Annual EPS Growth",
    "fy",
    3,
  ),
  {
    accessorKey: "eps_avg_growth_fq_2",
    header: "Average Quarterly EPS Growth Last 2 Qtrs",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_avg_growth_fq_3",
    header: "Average Quarterly EPS Growth Last 3 Qtrs",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_avg_growth_fy_2",
    header: "Average Annual EPS Growth Last 2 Yrs",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_avg_growth_fy_3",
    header: "Average Annual EPS Growth Last 3 Yrs",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  // TODO: Quarterly Earnings Acceleration
  // TODO: Quarter Over Quarter EPS $ Growth
  ...forwardCols(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_estimated_growth",
    "Quarterly EPS Estimated Growth",
    "fq",
    3,
  ),
  ...forwardCols(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_estimated_growth",
    "Annual EPS Estimated Growth",
    "fy",
    2,
  ),
  {
    accessorKey: "eps_estimated_growth_avg_fq_2",
    header: "Average Quarterly Estimated EPS Growth 2 Qtrs Forward",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_estimated_growth_avg_fq_3",
    header: "Average Quarterly Estimated EPS Growth 3 Qtrs Forward",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_estimated_growth_avg_fy_2",
    header: "Average Annual Estimated EPS Growth 2 Yrs Forward",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_estimated_growth_avg_fy_3",
    header: "Average Annual Estimated EPS Growth 3 Yrs Forward",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  // ##############################  Earnings  ###############################

  // ##############################  Sales  ##################################
  ...agoCols(
    { format: "currency", category: "Fundamentals" },
    "ebitda",
    "EBITDA",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "currency", category: "Fundamentals" },
    "ebit",
    "EBIT",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "currency", category: "Sales" },
    "revenue",
    "Quarterly Sales",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "currency", category: "Sales" },
    "revenue",
    "Annual Sales",
    "fy",
    3,
  ),
  ...forwardCols(
    { format: "currency", category: "Sales" },
    "revenue_forecast",
    "Quarterly Sales Estimate",
    "fq",
    3,
  ),
  ...forwardCols(
    { format: "currency", category: "Sales" },
    "revenue_forecast",
    "Annual Sales Estimate ",
    "fy",
    2,
  ),
  // TODO: Quarterly Estimated Sales – Latest Reported
  // TODO: Annual Estimated Sales – Latest Reported Year
  ...agoCols(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_growth",
    "Quarterly Sales Growth",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_growth",
    "Annual Sales Growth",
    "fy",
    3,
  ),
  {
    accessorKey: "revenue_avg_growth_fq_2",
    header: "Average Quarterly Sales Growth 2 Qtrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_avg_growth_fq_3",
    header: "Average Quarterly Sales Growth 3 Qtrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_avg_growth_fy_2",
    header: "Average Annual Sales Growth 2 Yrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_avg_growth_fy_3",
    header: "Average Annual Sales Growth 3 Yrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  }, // TODO: Quarterly Sales Acceleration

  ...agoCols(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_growth_yoy",
    "Quarter Over Quarter Sales Growth",
    "fq",
    9,
  ),

  ...forwardCols(
    { format: "number", sign: "%", category: "Sales" },
    "revenue_forecast_growth",
    "Quarterly Estimated Sales Growth",
    "fq",
    3,
  ),
  ...forwardCols(
    { format: "number", sign: "%", category: "Sales" },
    "revenue_forecast_growth",
    "Annual Estimated Sales Growth",
    "fy",
    2,
  ),
  {
    accessorKey: "revenue_forecast_growth_avg_fq_2",
    header: "Average Quarterly Estimated Sales Growth 2 Qtrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fq_3",
    header: "Average Quarterly Estimated Sales Growth 3 Qtrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },

  {
    accessorKey: "revenue_forecast_growth_avg_fy_2",
    header: "Average Quarterly Estimated Sales Growth 2 Yrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fy_3",
    header: "Average Quarterly Estimated Sales Growth 3 Yrs",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  // TODO: Quarterly Sales Acceleration
  ...agoCols(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_surprise",
    "Quarterly Sales Surprise",
    "fq",
    9,
  ),
  ...agoCols(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_surprise",
    "Annual Sales Surprise",
    "fy",
    3,
  ),

  // ##############################  Sales  ##################################

  // ##########################  Sector & Industry  ##########################
  {
    accessorKey: "sector",
    header: "Sector",
    meta: { category: "Sector & Industry" },
  },
  {
    accessorKey: "group",
    header: "Group",
    meta: { category: "Sector & Industry" },
  },
  {
    accessorKey: "industry",
    header: "Industry",
    meta: { category: "Sector & Industry" },
  },
  {
    accessorKey: "sub_industry",
    header: "Sub Industry",
    meta: { category: "Sector & Industry" },
  },
  // ##########################  Sector & Industry  ##########################

  // ##############################  Fundamental  ############################
  {
    accessorKey: "price_revenue_ttm",
    header: "Price Revenue TTM",
    meta: { format: "numeric", category: "Sales" },
  },

  {
    accessorKey: "dividend_amount",
    header: "Last Dividend Amount",
    meta: { format: "currency", category: "Fundamentals" },
  },
  // TODO: Missing Dividend Declaration Date
  //Declaration Date - Date on which dividend is declared
  //Ex Date - Date before which an investor must have purchased the stock to receive the upcoming dividend
  //Record Date- This date determines all shareholders of record who are entitled to the dividend payment and it usually occurs two days after the ex-date. Date -This is when dividend payments are issued to shareholders and it's usually about one month after the record date
  //Payment Date -This is when dividend payments are issued to shareholders and it's usually about one month after the record date
  {
    accessorKey: "divided_ex_date",
    header: "Last Dividend Ex Date",
    meta: { format: "date", category: "Fundamentals" },
  },
  {
    accessorKey: "dividend_yield",
    header: "Dividend Yield",
    meta: { format: "numeric", category: "Fundamentals" },
  },
  {
    accessorKey: "price_earnings_ttm",
    header: "Price Earning",
    meta: { format: "numeric", category: "Fundamentals" },
  },
  {
    accessorKey: "price_earnings_run_rate",
    header: "Price Earning Run Rate",
    meta: { format: "numeric", category: "Fundamentals" },
  },
  {
    accessorKey: "forward_price_earnings",
    header: "Forward Price Earnings",
    meta: { format: "numeric", category: "Fundamentals" },
  },

  ...agoCols(
    { format: "currency", category: "Fundamentals" },
    "net_income",
    "Net Income",
    "fy",
    2,
  ),
  ...agoCols(
    { format: "currency", category: "Fundamentals" },
    "total_assets",
    "Total Assets",
    "fq",
    3,
  ),
  ...agoCols(
    { format: "currency", category: "Fundamentals" },
    "total_liabilities",
    "Total Liabilities",
    "fq",
    3,
  ),
  ...agoCols(
    { format: "numeric", category: "Fundamentals" },
    "current_ratio",
    "Current Ratio",
    "fq",
    3,
  ),
  {
    accessorKey: "net_income_ttm_0",
    header: "Net Income TTM",
    meta: { format: "currency", category: "Fundamentals" },
  },

  {
    accessorKey: "price_earnings_growth_ttm",
    header: "Price  Growth",
    meta: { format: "numeric", category: "Fundamentals" },
  },
  {
    accessorKey: "price_sales_ttm",
    header: "Price Sales",
    meta: { format: "numeric", category: "Fundamentals" },
  },
  ...agoCols(
    { format: "numeric", category: "Fundamentals" },
    "price_earnings",
    "Price Earning",
    "fq",
    3,
  ),
  ...agoCols(
    { format: "numeric", category: "Fundamentals" },
    "debt_to_equity",
    "Debt to Equity",
    "fq",
    3,
  ),
  ...agoCols(
    { format: "numeric", category: "Fundamentals" },
    "price_book",
    "Price Book",
    "fq",
    3,
  ),
  ...agoCols(
    { format: "numeric", category: "Fundamentals" },
    "price_sales",
    "Price Sales",
    "fy",
    3,
  ),
  // ##############################  Fundamental  ############################

  // ######################  Price and Volume  #######################
  {
    accessorKey: "price_change_today_abs",
    header: "$ Change Today",
    meta: { format: "price", category: "Price & Volume" },
  },
  {
    accessorKey: "price_change_from_open_abs",
    header: "$ Change from Open",
    meta: { format: "price", category: "Price & Volume" },
  },
  {
    accessorKey: "price_change_from_high_abs",
    header: "$ Change from High",
    meta: { format: "price", category: "Price & Volume" },
  },
  {
    accessorKey: "price_change_from_low_abs",
    header: "$ Change from Low",
    meta: { format: "price", category: "Price & Volume" },
  },
  {
    accessorKey: "price_change_today_pct",
    header: "% Change Today",
    meta: {
      format: "numeric",
      sign: "%",
      colorize: true,
      category: "Price & Volume",
    },
  },
  {
    accessorKey: "price_change_from_open_pct",
    header: "% Change from Open",
    meta: {
      format: "numeric",
      sign: "%",
      colorize: true,
      category: "Price & Volume",
    },
  },
  {
    accessorKey: "price_change_from_high_pct",
    header: "% Change from High",
    meta: {
      format: "numeric",
      sign: "%",
      colorize: true,
      category: "Price & Volume",
    },
  },
  // TODO: Missing field
  {
    accessorKey: "price_change_from_low_pct",
    header: "% Change from Low",
    meta: {
      format: "numeric",
      sign: "%",
      colorize: true,
      category: "Price & Volume",
    },
  },
  {
    accessorKey: "dcr",
    header: "DCR",
    meta: { format: "numeric", sign: "%", category: "Price & Volume" },
  },
  {
    accessorKey: "wcr",
    header: "WCR",
    meta: { format: "numeric", sign: "%", category: "Price & Volume" },
  },
  {
    accessorKey: "mcr",
    header: "MCR",
    meta: { format: "numeric", sign: "%", category: "Price & Volume" },
  },
  // ######################  Price and Volume  #######################

  // ##########################  Technical  ##########################

  {
    accessorKey: "beta_1_year",
    header: "Beta 1Y",
    meta: { format: "numeric", category: "Technicals" },
  },
  {
    accessorKey: "beta_3_year",
    header: "Beta 3 Yrs",
    meta: { format: "numeric", category: "Technicals" },
  },
  {
    accessorKey: "beta_5_year",
    header: "Beta 5Y",
    meta: { format: "numeric", category: "Technicals" },
  },

  // ##########################  Technical  ##########################
];

columns = columns.map((col) => {
  return {
    ...col,
    cell: (props) => <FormattedCell cell={props} />,
  };
});

columns = columns.filter(
  (c) => c.meta?.category === "Fundamentals" || c.header === "Symbol",
);
