"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import Image from "next/image";
import { DateTime } from "luxon";

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
  const { sign, maximumFractionDigits } = meta;
  const numberFormater = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: (maximumFractionDigits as number) ?? 2,
  });
  const result = [numberFormater.format(value), sign].filter((s) => s).join("");
  return <span>{result}</span>;
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
  { accessorKey: "isin", header: "ISIN" },
  {
    accessorKey: "name",
    header: "Symbol",
    meta: { format: "textlogo", logoCol: "logo" },
  },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "exchange",
    header: "Exchange",
    meta: { format: "textlogo", logoCol: "exchange_logo" },
  },
  { accessorKey: "timezone", header: "Timezone" },
  {
    accessorKey: "currency",
    header: "Currency",
    meta: { format: "textlogo", logoCol: "currency_logo" },
  },

  { accessorKey: "sector", header: "Sector" },
  { accessorKey: "group", header: "Group" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "sub_industry", header: "Sub Industry" },
  {
    accessorKey: "country",
    header: "Country",
    meta: {
      format: "textlogo",
      logoCol: "country_code",
      logoPrefix: "country",
    },
  },
  { accessorKey: "location", header: "City" },
  { accessorKey: "employees", header: "Employee Count" },
  {
    accessorKey: "ipo_date",
    header: "IPO Date",
    meta: { format: "date" },
  },
  {
    accessorKey: "most_recent_split",
    header: "Recent Split",
    meta: { format: "date" },
  },
  {
    accessorKey: "mcap",
    header: "Market Cap",
    meta: { format: "currency" },
  },
  {
    accessorKey: "shares_float",
    header: "Shares Float",
    meta: { format: "numeric", maximumFractionDigits: 0 },
  },
  {
    accessorKey: "total_shares_outstanding",
    header: "Total Outstanding Shares",
    meta: { format: "numeric", maximumFractionDigits: 0 },
  },
  {
    accessorKey: "price_revenue_ttm",
    header: "Price Revenue TTM",
    meta: { format: "numeric" },
  },
  ...getPastColumn(
    { format: "numeric", sign: "%" },
    "revenue_surprise",
    "Revenue Surprise",
    "fq",
    11,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%" },
    "revenue_surprise",
    "Revenue Surprise",
    "fy",
    3,
  ),
  ...getPastColumn({ format: "currency" }, "revenue", "Revenue", "fq", 11),
  ...getPastColumn({ format: "currency" }, "revenue", "Revenue", "fy", 3),
  ...getFutureCol(
    { format: "currency" },
    "revenue_forecast",
    "Revenue Forecast",
    "fq",
    11,
  ),
  ...getFutureCol(
    { format: "currency" },
    "revenue_forecast",
    "Revenue Forecast",
    "fy",
    3,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%" },
    "revenue_growth",
    "Revenue Growth",
    "fq",
    11,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%" },
    "revenue_growth_yoy",
    "Revenue Growth",
    "fq",
    7,
  ),
  ...getPastColumn(
    { format: "numeric", sign: "%" },
    "revenue_growth",
    "Revenue Growth",
    "fy",
    3,
  ),
  {
    accessorKey: "revenue_avg_growth_fq_2",
    header: "Avg Revenue Growth 2Q",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "revenue_avg_growth_fq_3",
    header: "Avg Revenue Growth 3Q",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "revenue_avg_growth_fy_2",
    header: "Avg Revenue Growth 2Y",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "revenue_avg_growth_fy_3",
    header: "Avg Revenue Growth 3Y",
    meta: { format: "numeric", sign: "%" },
  },

  ...getFutureCol(
    { format: "number", sign: "%" },
    "revenue_forecast_growth",
    "Revenue Forecast Growth",
    "fq",
    3,
  ),
  ...getFutureCol(
    { format: "number", sign: "%" },
    "revenue_forecast_growth",
    "Revenue Forecast Growth",
    "fy",
    2,
  ),

  {
    accessorKey: "revenue_forecast_growth_avg_fq_2",
    header: "Avg Revenue Forecasted Growth 2Q",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fq_3",
    header: "Avg Revenue Forecasted Growth 3Q",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fy_2",
    header: "Avg Revenue Forecasted Growth 2Y",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "revenue_forecast_growth_avg_fy_3",
    header: "Avg Revenue Forecasted Growth 3Y",
    meta: { format: "numeric", sign: "%" },
  },
  {
    accessorKey: "earnings_release_date",
    header: "Earnings Date",
    meta: { format: "date" },
  },
];

columns = columns.map((col) => {
  return {
    ...col,
    cell: (props) => <FormattedCell cell={props} />,
  };
});
