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

export const StatsTable = () => {
  const [freq] = useState<"fq" | "fy">("fq");
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

    const sales =
      (freq === "fq" ? quote.revenue_action_fq_h : quote.revenue_action_fy_h) ??
      [];
    const earnings =
      (freq === "fq" ? quote.earning_action_fq_h : quote.earning_action_fy_h) ??
      [];

    const tableData = earnings.map((e, index) => ({
      period: e.FiscalPeriod,
      salesActual: sales[index]?.Actual,
      salesEstimate: sales[index]?.Estimate,
      salesSurprise: sales[index]?.Surprise,
      salesReported: sales[index]?.IsReported,
      earningActual: e.Actual,
      earningEstimate: e.Estimate,
      earningSurprise: e.Surprise,
      earningReported: e.IsReported,
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
    <div className="w-full overflow-auto h-full transition-colors cursor-default border ms-2 ">
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
              const value =
                firstEstimateIndex >= index ? c.salesEstimate : c.salesActual;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
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
              const formattedSurprise = c.salesSurprise
                ? percentFormatter.format(c.salesSurprise / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish": c.salesSurprise && c.salesSurprise > 0,
                      "text-bearish": c.salesSurprise && c.salesSurprise < 0,
                    })}
                  >
                    {formattedSurprise}
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
                  className={cn("text-left px-6 text-nowrap", {
                    "border-l-2 border-muted": firstEstimateIndex === index,
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
              const value =
                firstEstimateIndex >= index
                  ? c.earningEstimate
                  : c.earningActual;
              const formattedValue = value ? moneyFormatter.format(value) : "-";
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
              const formattedSurprise = c.earningSurprise
                ? percentFormatter.format(c.earningSurprise / 100)
                : "-";

              const overview = (
                <>
                  <div>{formattedValue}</div>
                  <div
                    className={cn({
                      "text-bullish":
                        c.earningSurprise && c.earningSurprise > 0,
                      "text-bearish":
                        c.earningSurprise && c.earningSurprise < 0,
                    })}
                  >
                    {formattedSurprise}
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
                  className={cn("text-left px-6 text-nowrap", {
                    "border-l-2 border-muted": firstEstimateIndex === index,
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
