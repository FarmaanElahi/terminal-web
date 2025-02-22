import React, { useMemo, useRef, useState } from "react";
import { useGroupSymbol } from "@/lib/state/grouper";
import { useSymbolQuote } from "@/lib/state/symbol";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ActionH } from "@/types/supabase";

export function Stats() {
  const [freq, setFreq] = useState<"fq" | "fy">("fq");
  return (
    <div className="relative w-full h-full">
      <StatsTable freq={freq} />
      <StatsColumn freq={freq} setFreq={setFreq} />
    </div>
  );
}

export const StatsTable = ({ freq }: { freq: "fq" | "fy" }) => {
  const symbol = useGroupSymbol();
  const { data: quote } = useSymbolQuote(symbol);
  const moneyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      compactDisplay: "short",
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    });
  }, []);

  const percentFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      notation: "compact",
      compactDisplay: "short",
      style: "percent",
      maximumFractionDigits: 2,
    });
  }, []);

  const data = useMemo(() => {
    if (!quote) return { noData: true } as const;

    const sales = ((freq === "fq"
      ? quote.revenue_action_fq_h
      : quote.revenue_action_fy_h) ?? []) as unknown as ActionH[];

    const salesGrowth = sales.map((a, index) => {
      const current = a?.Actual ?? a.Estimate;
      const previous = sales[index - 1]?.Actual ?? sales[index - 1]?.Estimate;
      if (!current || !previous) return 0;

      return ((current - previous) / previous) * 100;
    });

    const earnings = ((freq === "fq"
      ? quote.earning_action_fq_h
      : quote.earning_action_fy_h) ?? []) as unknown as ActionH[];

    const earningsGrowth = earnings.map((a, index) => {
      const current = a?.Actual ?? a.Estimate;
      const previous = earnings[index - 1]?.Actual;
      if (!current || !previous) return 0;
      return ((current - previous) / previous) * 100;
    });

    const salesAcceleration = findContinuousTrends(salesGrowth);
    const earningAcceleration = findContinuousTrends(earningsGrowth);

    const tableData = earnings.map((e, index) => ({
      period: e.FiscalPeriod,
      salesActual: sales[index]?.Actual,
      salesEstimate: sales[index]?.Estimate,
      salesSurprise: sales[index]?.Surprise,
      salesReported: sales[index]?.IsReported,
      salesGrowth: salesGrowth[index],
      salesAcceleration: salesAcceleration[index],
      earningActual: e.Actual,
      earningEstimate: e.Estimate,
      earningSurprise: e.Surprise,
      earningReported: e.IsReported,
      earningGrowth: earningsGrowth[index],
      earningAcceleration: earningAcceleration[index],
    }));
    const firstEstimateIndex = tableData.findIndex((r) => !r.salesReported);

    return {
      noData: false,
      tableData,
      firstEstimateIndex,
    } as const;
  }, [quote, freq]);

  const tableRef = useRef<HTMLTableElement>(null);

  if (data.noData) {
    return null;
  }

  const { tableData, firstEstimateIndex } = data;
  return (
    <div className="w-full overflow-auto h-full transition-colors cursor-default border ms-2  relative">
      <Table ref={tableRef} className="w-full table-auto h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead
              key={"Period"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10"
            >
              Period
            </TableHead>

            {tableData.map((c, index) => (
              <TableHead
                key={c.period}
                className={cn("text-left px-6 text-nowrap", {
                  "border-l-2 border-muted": firstEstimateIndex === index,
                })}
              >
                {c.period}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              key={"Sales"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10 border-r"
            >
              Sales
            </TableCell>
            {tableData.map((c, index) => {
              const value = c.salesReported ? c.salesActual : c.salesEstimate;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
              const salesAcceleration = c.salesAcceleration;
              const formattedActual = c.salesActual
                ? moneyFormatter.format(c.salesActual)
                : "-";
              const formattedEstimate = c.salesEstimate
                ? moneyFormatter.format(c.salesEstimate)
                : "-";
              const formattedSurpriseAbs =
                c.salesActual && c.salesEstimate
                  ? moneyFormatter.format(c.salesActual - c.salesEstimate)
                  : "-";
              const formattedGrowth = c.salesGrowth
                ? percentFormatter.format(c.salesGrowth / 100)
                : "-";

              const formattedSurrpise = c.salesSurprise
                ? percentFormatter.format(c.salesSurprise / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish": c.salesGrowth > 0,
                      "text-bearish": c.salesGrowth < 0,
                    })}
                  >
                    {formattedGrowth}
                  </div>
                </>
              );

              const detail = (
                <div>
                  <div className="bg-muted p-2">Sales</div>
                  <div className="p-2 space-y-2">
                    <div className="space-x-2">
                      <span className="font-bold">Actual:</span>
                      <span>{formattedActual}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Growth%:</span>
                      <span className="font-bold">{formattedGrowth}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Estimate:</span>
                      <span>{formattedEstimate}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise:</span>
                      <span className="font-bold">{formattedSurpriseAbs}</span>
                    </div>

                    <div className="space-x-2">
                      <span className="font-bold">Surprise%:</span>
                      <span className="font-bold">{formattedSurrpise}</span>
                    </div>
                  </div>
                </div>
              );

              return (
                <TableCell
                  key={index}
                  className={cn("text-left px-6 text-nowrap", {
                    "border-l-2 border-l-muted": firstEstimateIndex === index,
                    "border-b-bullish": salesAcceleration === 1,
                    "border-b-bearish": salesAcceleration === -1,
                    "border-b": salesAcceleration,
                  })}
                >
                  <HoverCard openDelay={50} closeDelay={50}>
                    <HoverCardTrigger>{overview}</HoverCardTrigger>
                    <HoverCardContent className="p-0">
                      {detail}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow>
            <TableCell
              key={"Earning"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10 border-r"
            >
              Earning
            </TableCell>
            {tableData.map((c, index) => {
              const value = c.earningReported
                ? c.earningActual
                : c.earningEstimate;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
              const earningAcceleration = c.earningAcceleration;
              const formattedActual = c.earningActual
                ? moneyFormatter.format(c.earningActual)
                : "-";
              const formattedEstimate = c.earningEstimate
                ? moneyFormatter.format(c.earningEstimate)
                : "-";
              const formattedSurpriseAbs =
                c.earningActual && c.earningEstimate
                  ? moneyFormatter.format(c.earningActual - c.earningEstimate)
                  : "-";

              const formattedGrowth = c.earningGrowth
                ? percentFormatter.format(c.earningGrowth / 100)
                : "-";

              const formattedSurprise = c.earningSurprise
                ? percentFormatter.format(c.earningSurprise / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish": c.earningGrowth > 0,
                      "text-bearish": c.earningGrowth < 0,
                    })}
                  >
                    {formattedGrowth}
                  </div>
                </>
              );

              const detail = (
                <div>
                  <div className="bg-muted p-2">Earning</div>

                  <div className="p-2 space-y-2">
                    <div className="space-x-2">
                      <span className="font-bold">Actual:</span>
                      <span>{formattedActual}</span>
                    </div>

                    <div className="space-x-2">
                      <span className="font-bold">Growth%:</span>
                      <span className="font-bold">{formattedGrowth}</span>
                    </div>

                    <div className="space-x-2">
                      <span className="font-bold">Estimate:</span>
                      <span>{formattedEstimate}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise:</span>
                      <span className="font-bold">{formattedSurpriseAbs}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="font-bold">Surprise%:</span>
                      <span className="font-bold">{formattedSurprise}</span>
                    </div>
                  </div>
                </div>
              );

              return (
                <TableCell
                  key={index}
                  className={cn("text-left px-6 text-nowrap border-l-muted", {
                    "border-l-2 border-l-muted": firstEstimateIndex === index,
                    "border-b-bullish": earningAcceleration === 1,
                    "border-b-bearish": earningAcceleration === -1,
                    "border-b": earningAcceleration,
                  })}
                >
                  <HoverCard openDelay={50} closeDelay={50}>
                    <HoverCardTrigger>{overview}</HoverCardTrigger>
                    <HoverCardContent className="p-0">
                      {detail}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

function StatsColumn({
  freq,
  setFreq,
}: {
  freq: "fq" | "fy";
  setFreq: (freq: "fq" | "fy") => void;
}) {
  return (
    <div className="absolute top-0 end-0 z-40 bg-muted flex border-t">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="rounded-none h-10  bg-transparent hover:bg-transparent"
            variant="ghost"
          >
            <Settings className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex items-center space-x-2">
            <Label htmlFor="stats-frequency">Yearly</Label>
            <Switch
              id={"stats-frequency"}
              checked={freq === "fy"}
              onCheckedChange={() =>
                setFreq(freq === "fq" ? "fy" : freq === "fy" ? "fq" : "fq")
              }
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function findContinuousTrends(values: number[], loopback = 1) {
  const ranges = Array(values.length).fill(0);
  if (values.length < 3) return ranges;

  const accelerationTruthy = values.map((value, i) =>
    value && values[i - loopback] ? value > values[i - loopback] : false,
  );
  const decelerationTruthy = values.map((value, i) =>
    value && values[i - loopback] ? value < values[i - loopback] : false,
  );

  const accelerationRanges = findTrueRanges(accelerationTruthy);
  accelerationRanges.forEach((value) => {
    ranges.fill(1, value.start, value.end + 1);
  });
  const decelerationRanges = findTrueRanges(decelerationTruthy);
  decelerationRanges.forEach((value) => {
    ranges.fill(-1, value.start, value.end + 1);
  });
  return ranges;
}

interface BooleanRange {
  start: number;
  end: number;
}

function findTrueRanges(values: boolean[]): BooleanRange[] {
  const ranges: BooleanRange[] = [];
  let start: number | null = null;

  for (let i = 0; i < values.length; i++) {
    if (values[i]) {
      // Mark the start of a new range if not already marked
      if (start === null) {
        start = i;
      }
    } else {
      // End of a range
      if (start !== null) {
        ranges.push({ start, end: i - 1 });
        start = null; // Reset start
      }
    }
  }

  // Handle the case where the array ends with a contiguous range of `true`
  if (start !== null) {
    ranges.push({ start, end: values.length - 1 });
  }
  return ranges.filter((r) => r.end - r.start >= 2);
}
