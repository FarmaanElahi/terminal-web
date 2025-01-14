import { CellContext } from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import { Check, Flag, X } from "lucide-react";
import { ReactNode } from "react";
import { Candlestick } from "@/components/charting/candlestick";
import { DateTime } from "luxon";
import Image from "next/image";
import { cn } from "@/lib/utils";

function BooleanCell(props: { cell: CellContext<Symbol, unknown> }) {
  const value = props.cell.getValue();

  return value ? <Check className="size-4" /> : <X className="size-4" />;
}

function CandleStickCell(props: { cell: CellContext<Symbol, unknown> }) {
  const [open_col, high_col, low_col, close_col] = (
    props.cell.column.columnDef.meta as Record<string, string>
  ).cols;
  let candlestick: ReactNode;
  if (open_col && high_col && low_col && close_col) {
    const open = (props.cell.row.original as Record<string, number>)[open_col];
    const high = (props.cell.row.original as Record<string, number>)[high_col];
    const low = (props.cell.row.original as Record<string, number>)[low_col];
    const close = (props.cell.row.original as Record<string, number>)[
      close_col
    ];
    if (open && high_col && low_col && close_col) {
      candlestick = (
        <Candlestick open={open} high={high} low={low} close={close} />
      );
    }
  }

  const rangeValue = props.cell.getValue() as number;

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
  const {
    sign,
    maximumFractionDigits,
    colorize,
    bold,
    colorizeLevel = 0,
  } = meta;
  const numberFormater = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: (maximumFractionDigits as number) ?? 2,
  });
  const result = [numberFormater.format(value), sign].filter((s) => s).join("");
  return (
    <span
      className={cn({
        "text-bullish": colorize && value > (colorizeLevel as number),
        "text-bearish": colorize && value < (colorizeLevel as number),
        "font-bold": bold,
      })}
    >
      {result}
    </span>
  );
}

function VolumeCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  const { activityLevel } = cell.column.columnDef.meta as Record<
    string,
    number
  >;

  const showIndicator =
    activityLevel !== undefined &&
    activityLevel !== null &&
    typeof value === "number" &&
    value >= activityLevel;

  return (
    <div className="inline-flex gap-1">
      <span
        className={cn("text-volume-activity", { "opacity-0": !showIndicator })}
      >
        •
      </span>
      <NumericCell cell={cell} />
    </div>
  );
}

function CurrencyCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const currencyCode = cell.row.original.currency as string;
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    currencyDisplay: "symbol",
    currency: currencyCode,
    style: "currency",
    notation: value > 1_00_00_000 ? "compact" : "standard",
  });

  const amount = formatter.format(value);

  return <span>{amount}</span>;
}

function PriceCell({ cell }: { cell: CellContext<Symbol, unknown> }) {
  const value = cell.getValue();
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const {
    colorize,
    bold,
    colorizeLevel = 0,
  } = cell.column.columnDef.meta as Record<string, unknown>;
  const currencyCode = cell.row.original.currency as string;
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    currencyDisplay: "symbol",
    currency: currencyCode,
    style: "currency",
  });

  const num = formatter.format(value);
  return (
    <span
      className={cn({
        "text-bullish": colorize && value > (colorizeLevel as number),
        "text-bearish": colorize && value < (colorizeLevel as number),
        "font-bold": bold,
      })}
    >
      {num}
    </span>
  );
}

export function FormattedCell({
  cell,
}: {
  cell: CellContext<Symbol, unknown>;
}) {
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
  if (format === "candlestick") {
    return <CandleStickCell cell={cell} />;
  }
  if (format === "boolean") {
    return <BooleanCell cell={cell} />;
  }
  if (format === "volume") {
    return <VolumeCell cell={cell} />;
  }
  return <span>{String(value)}</span>;
}
