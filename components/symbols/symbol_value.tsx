import type { Symbol } from "@/types/symbol";
import { Check, Flag, X } from "lucide-react";
import { ReactNode } from "react";
import { Candlestick } from "@/components/charting/candlestick";
import { DateTime } from "luxon";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

interface LogoTextCellProps extends FormattedValueProps {
  logoCol?: string;
  logoPrefix?: string;
}

export function LogoTextCell(props: LogoTextCellProps) {
  const { value, data, logoPrefix, logoCol } = props;
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
