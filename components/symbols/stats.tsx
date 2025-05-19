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
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

    const base: unknown[][] = transpose(
      freq === "fq" ? JSON.parse(quote.quarterly!) : JSON.parse(quote.yearly!),
    );

    // These are time period. The first cell name is Date
    const columns =
      (base[0]?.slice(1) as string[]).map((value) => {
        if (freq === "fq") {
          const year = value.substring(0, 4);
          const month = value.substring(4, 6);
          if (month === "03") return `${year}-Q4`;
          if (month === "06") return `${year}-Q1`;
          if (month === "09") return `${year}-Q2`;
          if (month === "12") return `${year}-Q3`;
          return `${year} -`;
        }
        return value.substring(0, 4);
      }) ?? [];

    const revenue =
      base.find((value) => value?.[0] === "Revenue")?.slice(1) ?? [];

    const revenueGrowthYoY =
      base.find((value) => value?.[0] === "Revenue Growth YoY")?.slice(1) ?? [];

    const revenueGrowthQoQ =
      base.find((value) => value[0] === "Revenue Growth QoQ")?.slice(1) ?? [];

    const revenueAcceleration = findContinuousTrends(
      revenueGrowthQoQ as number[],
    );

    const revenueList = revenue.map((value, index) => ({
      value: value as number,
      growthQoQ: revenueGrowthQoQ[index] as number,
      growthYoY: revenueGrowthYoY[index] as number,
      acceleration: revenueAcceleration[index] === 1,
      deceleration: revenueAcceleration[index] === -1,
    }));

    const earnings = base.find((value) => value?.[0] === "EPS")?.slice(1) ?? [];

    const earningsGrowthYoY =
      base.find((value) => value?.[0] === "EPS Growth YoY")?.slice(1) ?? [];

    const earningsGrowthQoQ =
      base.find((value) => value?.[0] === "EPS Growth QoQ")?.slice(1) ?? [];

    const earningsAcceleration = findContinuousTrends(
      earningsGrowthQoQ as number[],
    );
    const earningsList = earnings.map((value, index) => ({
      value: value as number,
      growthQoQ: earningsGrowthQoQ[index] as number,
      growthYoY: earningsGrowthYoY[index] as number,
      acceleration: earningsAcceleration[index] === 1,
      deceleration: earningsAcceleration[index] === -1,
    }));

    return { columns, revenueList, earningsList };
  }, [quote, freq]);

  const tableRef = useRef<HTMLTableElement>(null);

  if (data.noData) {
    return null;
  }

  const { columns, revenueList, earningsList } = data;
  return (
    <div className="w-full overflow-auto h-full transition-colors cursor-default border relative">
      <Table ref={tableRef} className="w-full table-auto h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead
              key={"Period"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10"
            >
              Period
            </TableHead>

            {columns.map((c) => (
              <TableHead key={c} className={cn("text-left px-6 text-nowrap")}>
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              key={"Sales"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10 border-r space-y-2"
            >
              <div className="font-bold">Sales</div>
              <div className="text-xs">QoQ</div>
              <div className="text-xs">YoY</div>
            </TableCell>
            {revenueList.map((c, index) => {
              const value = c.value;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
              const formattedQoQGrowth = c.growthQoQ
                ? percentFormatter.format(c.growthQoQ / 100)
                : "-";
              const formattedYoYGrowth = c.growthYoY
                ? percentFormatter.format(c.growthYoY / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish": c.growthQoQ > 0,
                      "text-bearish": c.growthQoQ < 0,
                    })}
                  >
                    {formattedQoQGrowth}
                  </div>
                  <div
                    className={cn({
                      "text-bullish": c.growthQoQ > 0,
                      "text-bearish": c.growthQoQ < 0,
                    })}
                  >
                    {formattedYoYGrowth}
                  </div>
                </>
              );

              return (
                <TableCell
                  key={index}
                  className={cn("text-left px-6 text-nowrap space-y-2", {
                    "border-b-bullish": c.acceleration,
                    "border-b-bearish": c.deceleration,
                    "border-b": c.acceleration || c.deceleration,
                  })}
                >
                  {overview}
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow>
            <TableCell
              key={"Earnings"}
              className="text-left px-6 text-nowrap sticky left-0 bg-background z-10 border-r space-y-2"
            >
              <div className="font-bold">Earnings</div>
              <div className="text-xs">QoQ</div>
              <div className="text-xs">YoY</div>
            </TableCell>
            {earningsList.map((c, index) => {
              const value = c.value;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
              const formattedQoQGrowth = c.growthQoQ
                ? percentFormatter.format(c.growthQoQ / 100)
                : "-";
              const formattedYoYGrowth = c.growthYoY
                ? percentFormatter.format(c.growthYoY / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish": c.growthQoQ > 0,
                      "text-bearish": c.growthQoQ < 0,
                    })}
                  >
                    {formattedQoQGrowth}
                  </div>
                  <div
                    className={cn({
                      "text-bullish": c.growthQoQ > 0,
                      "text-bearish": c.growthQoQ < 0,
                    })}
                  >
                    {formattedYoYGrowth}
                  </div>
                </>
              );

              return (
                <TableCell
                  key={index}
                  className={cn("text-left px-6 text-nowrap space-y-2", {
                    "border-b-bullish": c.acceleration,
                    "border-b-bearish": c.deceleration,
                    "border-b": c.acceleration || c.deceleration,
                  })}
                >
                  {overview}
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

function transpose(matrix: unknown[][]) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
