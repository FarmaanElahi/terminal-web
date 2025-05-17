"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Alert, InsertAlert } from "@/types/supabase";
import {
  useCreateAlert,
  useSymbolQuote,
  useUpdateAlert,
} from "@/lib/state/symbol";
import type { Json } from "@/types/generated/supabase";

interface AlertBuilderProps {
  open: boolean;
  onClose: () => void;
  initialSymbol?: string;
  initialType?: "price" | "trendline";
  existingAlert?: Alert;
  onSave?: (alert: Alert) => void;
}

export function AlertBuilder({
  open,
  onClose,
  initialSymbol = "",
  initialType = "price",
  existingAlert,
  onSave,
}: AlertBuilderProps) {
  const [symbol, setSymbol] = useState(
    initialSymbol || existingAlert?.symbol || "",
  );
  const alertType = existingAlert?.type || "simple";
  const [lhsType] = useState<"last_price">("last_price");
  const [rhsType, setRhsType] = useState<"constant" | "trend_line">(
    existingAlert?.rhs_type ||
      (initialType === "price" ? "constant" : "trend_line"),
  );
  const [operator, setOperator] = useState<string>(
    existingAlert?.operator || ">",
  );
  const [price, setPrice] = useState<number>(
    existingAlert?.rhs_attr &&
      typeof existingAlert.rhs_attr === "object" &&
      "value" in existingAlert.rhs_attr
      ? (existingAlert.rhs_attr as { value: number }).value
      : 0,
  );
  const [notes, setNotes] = useState<string>(existingAlert?.notes || "");

  const { data: symbolData } = useSymbolQuote(symbol);
  const { mutate: createAlert, isPending: isCreating } = useCreateAlert(onSave);
  const { mutate: updateAlert, isPending: isUpdating } = useUpdateAlert(onSave);

  const isPending = isCreating || isUpdating;

  // When symbol data loads, set initial price if not set
  useEffect(() => {
    if (symbolData?.day_close && !existingAlert && price === 0) {
      setPrice(symbolData.day_close);
    }
  }, [symbolData, existingAlert, price]);

  const handleSave = () => {
    if (!symbol) return;

    const alertData: Partial<InsertAlert> = {
      symbol,
      type: alertType,
      lhs_type: lhsType,
      rhs_type: rhsType,
      operator,
      notes: notes || null,
      rhs_attr: { value: price } as Json,
    };

    if (existingAlert) {
      updateAlert({
        id: existingAlert.id,
        payload: alertData,
      });
    } else {
      createAlert(alertData as InsertAlert);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingAlert ? "Edit" : "Create"}{" "}
            {rhsType === "constant" ? "Price" : "Trendline"} Alert
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="symbol" className="text-right">
              Symbol
            </label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="col-span-3"
              placeholder="Enter symbol (e.g. AAPL)"
              disabled={!!initialSymbol || !!existingAlert}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="alertType" className="text-right">
              Alert Type
            </label>
            <Select
              value={rhsType}
              onValueChange={(value: "constant" | "trend_line") =>
                setRhsType(value)
              }
              disabled={!!existingAlert} // Type cannot be changed after creation
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="constant">Price Alert</SelectItem>
                <SelectItem value="trend_line">Trendline Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {rhsType === "constant" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="condition" className="text-right">
                  Condition
                </label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">">Price Above</SelectItem>
                    <SelectItem value="<">Price Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="price" className="text-right">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="col-span-3"
                  placeholder="Enter alert price"
                  step="0.01"
                />
              </div>

              {symbolData?.day_close && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right text-sm text-muted-foreground">
                    Current
                  </div>
                  <div className="col-span-3 text-sm">
                    {symbolData.day_close.toFixed(2)}
                  </div>
                </div>
              )}
            </>
          )}

          {rhsType === "trend_line" && (
            <div className="col-span-4 text-sm text-muted-foreground">
              Trendline alerts will trigger when the price crosses the trendline
              you have drawn on the chart.
              <br />
              <br />
              Set the condition for when the alert should trigger:
            </div>
          )}

          {rhsType === "trend_line" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="condition" className="text-right">
                Condition
              </label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">Above Trendline</SelectItem>
                  <SelectItem value="<">Below Trendline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right">
              Notes
            </label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {existingAlert ? "Update" : "Create"} Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
