import type { Symbol } from "@/types/symbol";
import { Check, Flag, X } from "lucide-react";
import { ReactNode } from "react";
import { Candlestick } from "@/components/charting/candlestick";
import { DateTime } from "luxon";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FormattedValueProps {
  id: string;
  value?: unknown;
  meta?: Record<string, unknown>;
  symbol: Symbol;
}

export function FormattedValue(props: FormattedValueProps) {
  const { defaultValue, format } = props.meta ?? {};
  const value = (props.value as string) || (defaultValue as string) || "-";
  if (format === "symbol") {
    return <SymbolCell {...props} />;
  }
  if (format === "date") {
    return <DateCell {...props} />;
  }
  if (format === "textlogo") {
    return <LogoTextCell {...props} />;
  }
  if (format === "currency") {
    return <CurrencyCell {...props} />;
  }
  if (format === "numeric") {
    return <NumericCell {...props} />;
  }
  if (format === "price") {
    return <PriceCell {...props} />;
  }
  if (format === "candlestick") {
    return <CandleStickCell {...props} />;
  }
  if (format === "boolean") {
    return <BooleanCell {...props} />;
  }
  if (format === "volume") {
    return <VolumeCell {...props} />;
  }
  return <span className="truncate">{String(value)}</span>;
}

function BooleanCell(props: FormattedValueProps) {
  const { value } = props;

  return value ? <Check className="size-4" /> : <X className="size-4" />;
}

function CandleStickCell(props: FormattedValueProps) {
  const { meta = {}, symbol, value: cellValue } = props;
  const [open_col, high_col, low_col, close_col] = meta.cols as string[];
  let candlestick: ReactNode;
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

function SymbolCell(props: FormattedValueProps) {
  const { symbol, value } = props;
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

function LogoTextCell(props: FormattedValueProps) {
  const { value, meta = {}, symbol } = props;
  const { logoCol, logoPrefix } = meta;
  const text = value as string;
  let logo = logoCol ? (symbol[logoCol as keyof Symbol] as string) : undefined;
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

function DateCell(props: FormattedValueProps) {
  const { value } = props;

  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }
  const str = DateTime.fromMillis(value).toFormat("dd/MM/yyyy");
  return <span>{str}</span>;
}

function NumericCell(props: FormattedValueProps) {
  const { value, meta = {} } = props;
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

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

function VolumeCell(props: FormattedValueProps) {
  const { value, meta = {} } = props;
  const { activityLevel } = meta;

  const showIndicator =
    activityLevel !== undefined &&
    activityLevel !== null &&
    typeof value === "number" &&
    value >= (activityLevel as number);

  return (
    <div className="inline-flex gap-1">
      <span
        className={cn("text-volume-activity", { "opacity-0": !showIndicator })}
      >
        •
      </span>
      <NumericCell {...props} />
    </div>
  );
}

function CurrencyCell(props: FormattedValueProps) {
  const { value, symbol } = props;
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const currencyCode = symbol.currency as string;
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: value > 1_00_00_000 ? 2 : 0,
    minimumFractionDigits: 0,
    currencyDisplay: "symbol",
    notation: value > 1_00_00_000 ? "compact" : "standard",
    ...(currencyCode
      ? {
          currency: currencyCode,
          style: "currency",
        }
      : {}),
  });

  const amount = formatter.format(value);

  return <span>{amount}</span>;
}

function PriceCell(props: FormattedValueProps) {
  const { value, meta = {}, symbol } = props;
  if (!value || typeof value !== "number") {
    return <span>-</span>;
  }

  const { colorize, bold, colorizeLevel = 0 } = meta;
  const currencyCode = symbol.currency as string;
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
