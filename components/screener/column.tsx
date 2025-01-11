"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import Image from "next/image";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";

const CURRENCY_SYMBOL = {
  INR: "\u20B9",
  USD: "\u0024",
} as Record<string, string>;

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

  const amount = [Math.floor(value / 10000000), "CR"].join(" ");
  return (
    <span>
      {currentSymbol && <span>{currentSymbol}</span>}
      {amount}
    </span>
  );
}

function PriceCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  return <span>{value}</span>;
}

function FormattedCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const meta = (cell.column.columnDef.meta ?? {}) as Record<string, string>;
  const { defaultValue, format } = meta;
  const value = cell.getValue() || (defaultValue as string) || "-";
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

function getPastColumn(
  meta: Record<string, unknown>,
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
): ColumnDef<Symbol>[] {
  const freqNameMapping = { fq: "Q", fy: "Y" } as Record<typeof freq, string>;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColumnDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist =
      i === 0
        ? `This ${freqName.toUpperCase()}`
        : i === 1
          ? `Last ${freqName.toUpperCase()}`
          : undefined;

    hist = hist ? hist : `${i}${freqName} Ago`;
    cols.push({
      accessorKey: [metric, freq, i].join("_"),
      header: [name_prefix, hist].join(" "),
      meta,
    });
  }
  return cols;
}

function getFutureCol(
  meta: Record<string, unknown>,
  metric: string,
  name_prefix: string,
  freq: "fq" | "fy",
  ago: number,
): ColumnDef<Symbol>[] {
  const freqNameMapping = { fq: "Q", fy: "Y" } as Record<typeof freq, string>;
  const freqName = freqNameMapping[freq];

  const cols = [] as ColumnDef<Symbol>[];
  for (let i = 0; i <= ago; i++) {
    let hist = i === 0 ? `Next ${freqName.toUpperCase()}` : undefined;
    hist = hist ? hist : `${i + 1}${freqName} Forward`;
    cols.push({
      accessorKey: [metric, freq, i].join("_"),
      header: [name_prefix, hist].join(" "),
      meta,
    });
  }
  return cols;
}

export let columns: ColumnDef<Symbol>[] = [
  { accessorKey: "isin", header: "ISIN", meta: { category: "General" } },
  {
    accessorKey: "name",
    header: "Symbol",
    meta: { format: "textlogo", logoCol: "logo", category: "General" },
  },
  {
    accessorKey: "description",
    header: "Description",
    meta: { category: "General" },
  },
  { accessorKey: "type", header: "Type", meta: { category: "General" } },
  {
    accessorKey: "exchange",
    header: "Exchange",
    meta: { format: "textlogo", logoCol: "exchange_logo", category: "General" },
  },
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
    accessorKey: "employees",
    header: "Employee Count",
    meta: { category: "General" },
  },
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
    accessorKey: "total_shares_outstanding",
    header: "Total Outstanding Shares",
    meta: { format: "numeric", maximumFractionDigits: 0, category: "General" },
  },
  {
    accessorKey: "price_revenue_ttm",
    header: "Price Revenue TTM",
    meta: { format: "numeric", category: "Sales" },
  },
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_surprise",
    "Revenue Surprise",
    "fq",
    2,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_surprise",
    "Revenue Surprise",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "currency", category: "Sales" },
    "revenue",
    "Revenue",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "currency", category: "Sales" },
    "revenue",
    "Revenue",
    "fy",
    2,
  ),
  ...getFutureCol(
    { format: "currency", category: "Sales" },
    "revenue_forecast",
    "Revenue Forecast",
    "fq",
    3,
  ),
  ...getFutureCol(
    { format: "currency", category: "Sales" },
    "revenue_forecast",
    "Revenue Forecast",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_growth",
    "Revenue Growth",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_growth_yoy",
    "Revenue Growth",
    "fq",
    7,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Sales" },
    "revenue_growth",
    "Revenue Growth",
    "fy",
    2,
  ),
  {
    accessorKey: "revenue_avg_growth_fq_2",
    header: "Avg Revenue Growth 2Q",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_avg_growth_fq_3",
    header: "Avg Revenue Growth 3Q",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_avg_growth_fy_2",
    header: "Avg Revenue Growth 2Y",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_avg_growth_fy_3",
    header: "Avg Revenue Growth 3Y",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },

  ...getFutureCol(
    { format: "number", sign: "%", category: "Sales" },
    "revenue_forecast_growth",
    "Revenue Forecast Growth",
    "fq",
    2,
  ),
  ...getFutureCol(
    { format: "number", sign: "%", category: "Sales" },
    "revenue_forecast_growth",
    "Revenue Forecast Growth",
    "fy",
    2,
  ),

  {
    accessorKey: "revenue_forecast_growth_avg_fq_2",
    header: "Avg Revenue Forecasted Growth 2Q",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fq_3",
    header: "Avg Revenue Forecasted Growth 3Q",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fy_2",
    header: "Avg Revenue Forecasted Growth 2Y",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fy_3",
    header: "Avg Revenue Forecasted Growth 3Y",
    meta: { format: "numeric", sign: "%", category: "Sales" },
  },
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
    accessorKey: "earnings_per_share_ttm",
    header: "EPS TTM",
    meta: { format: "numeric", category: "Earnings" },
  },
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Earnings" },
    "earning_surprise",
    "Earning Surprise",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Earnings" },
    "earning_surprise",
    "Earning Surprise",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Earnings" },
    "eps",
    "EPS",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Earnings" },
    "eps",
    "EPS",
    "fy",
    2,
  ),
  ...getFutureCol(
    { format: "numeric", category: "Earnings" },
    "eps_estimated",
    "EST EPS",
    "fq",
    3,
  ),
  ...getFutureCol(
    { format: "numeric", category: "Earnings" },
    "eps_estimated",
    "EST EPS",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_growth",
    "EPS Growth",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_growth",
    "EPS Growth",
    "fy",
    2,
  ),
  {
    accessorKey: "eps_avg_growth_fq_2",
    header: "Avg EPS Growth 2Q",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_avg_growth_fq_3",
    header: "Avg EPS Growth 3Q",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_avg_growth_fy_2",
    header: "Avg EPS Growth 2Y",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_avg_growth_fy_3",
    header: "Avg EPS Growth 3Y",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  ...getFutureCol(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_estimated_growth",
    "EST EPS Growth",
    "fq",
    2,
  ),
  ...getFutureCol(
    { format: "numeric", sign: "%", category: "Earnings" },
    "eps_estimated_growth",
    "EST EPS Growth",
    "fy",
    2,
  ),
  {
    accessorKey: "eps_estimated_growth_avg_fq_2",
    header: "Avg EST EPS Growth 2Q",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_estimated_growth_avg_fq_3",
    header: "Avg EST EPS Growth 3Q",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_estimated_growth_avg_fy_2",
    header: "Avg EST EPS Growth 2Y",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "eps_estimated_growth_avg_fy_3",
    header: "Avg EST EPS Growth 3Y",
    meta: { format: "numeric", sign: "%", category: "Earnings" },
  },
  {
    accessorKey: "net_income_ttm_0",
    header: "Net Income TTM",
    meta: { format: "currency", category: "Fundamentals" },
  },
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "net_income",
    "Net Income",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "net_income",
    "Net Income",
    "fy",
    2,
  ),

  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "ebitda",
    "EBITDA",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "ebitda",
    "EBITDA",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "ebit",
    "EBIT",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "ebit",
    "EBIT",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "total_assets",
    "Total Assets",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "total_assets",
    "Total Assets",
    "fy",
    2,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "total_liabilities",
    "Total Liabilities",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "currency", category: "Fundamentals" },
    "total_liabilities",
    "Total Liabilities",
    "fy",
    2,
  ),
  {
    accessorKey: "dividend_amount",
    header: "Last Dividend Amount",
    meta: { format: "currency", category: "Fundamentals" },
  },
  {
    accessorKey: "divided_ex_date",
    header: "Dividend Ex Date",
    meta: { format: "date", category: "Fundamentals" },
  },
  {
    accessorKey: "dividend_yield",
    header: "Dividend Yield",
    meta: { format: "numeric", category: "Fundamentals" },
  },
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "dividends_yield",
    "Dividend Yield",
    "fy",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "dividend_payout_ratio",
    "Dividend Payout Ratio",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "dividend_payout_ratio",
    "Dividend Payout Ratio",
    "fy",
    3,
  ),
  {
    accessorKey: "price_earnings_ttm",
    header: "Price Earning",
    meta: { format: "numeric", category: "Fundamentals" },
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
  {
    accessorKey: "current_ratio",
    header: "Current Ratio",
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
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "price_earnings",
    "Price Earning",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "price_earnings",
    "Price Earning",
    "fy",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "current_ratio",
    "Current Ratio",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "current_ratio",
    "Current Ratio",
    "fy",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "debt_to_equity",
    "Debt to Equity",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "debt_to_equity",
    "Debt to Equity",
    "fy",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "price_book",
    "Price Book",
    "fq",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "price_book",
    "Price Book",
    "fy",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", category: "Fundamentals" },
    "price_sales",
    "Price Sales",
    "fy",
    3,
  ),
  {
    accessorKey: "beta_1_year",
    header: "Beta 1Y",
    meta: { format: "numeric", category: "Technicals" },
  },
  {
    accessorKey: "beta_2_year",
    header: "Beta 2Y",
    meta: { format: "numeric", category: "Technicals" },
  },
  {
    accessorKey: "beta_5_year",
    header: "Beta 5Y",
    meta: { format: "numeric", category: "Technicals" },
  },
  {
    accessorKey: "days_since_latest_earning",
    header: "Beta 5Y",
    meta: { format: "numeric", category: "Earnings" },
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
    header: "Close",
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
];

columns = columns.map((col) => {
  return {
    ...col,
    cell: (props) => <FormattedCell cell={props} />,
  };
});

columns = columns.filter(
  (c) => c.meta?.category === "Price & Volume" || c.header === "Symbol",
);
