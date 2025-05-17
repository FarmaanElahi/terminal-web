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
import { useCreateAlert, useUpdateAlert } from "@/lib/state/symbol";
import type { Json } from "@/types/generated/supabase";
import { toast } from "sonner";

interface AlertBuilderProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  initialSymbol?: string;
  alertPrice?: number;
  initialType?: "price" | "trendline";
  existingAlert?: Alert;
  onSave?: (alert: Alert) => void;
}

export function AlertBuilder({
  open,
  onOpenChange,
  initialSymbol = "",
  initialType = "price",
  existingAlert,
  alertPrice,
  onSave,
}: AlertBuilderProps) {
  const [symbol, setSymbol] = useState("");
  const [alertType, setAlertType] = useState<"simple">("simple");
  const [lhsType, setLhsType] = useState<"last_price">("last_price");
  const [rhsType, setRhsType] = useState<"constant" | "trend_line">("constant");
  const [operator, setOperator] = useState<string>(">");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string>("");

  const { mutate: createAlert, isPending: isCreating } = useCreateAlert(
    (alert) => {
      toast(`Alert created for ${alert.symbol}${price ? ` at ${price}` : ""}`);
      onOpenChange(false);
      onSave?.(alert);
    },
  );

  const { mutate: updateAlert, isPending: isUpdating } = useUpdateAlert(
    (alert) => {
      toast(`Alert updated for ${alert.symbol}${price ? ` at ${price}` : ""}`);
      onOpenChange(false);
      onSave?.(alert);
    },
  );

  const isPending = isCreating || isUpdating;

  // Reset and initialize form values when the dialog opens or props change
  useEffect(() => {
    if (open) {
      // Set values from existing alert if available
      if (existingAlert) {
        setSymbol(existingAlert.symbol);
        setAlertType(existingAlert.type || "simple");
        setLhsType(existingAlert.lhs_type);
        setRhsType(existingAlert.rhs_type);
        setOperator(existingAlert.operator);

        // Handle price from rhs_attr depending on the format
        const rhsAttr = existingAlert.rhs_attr;
        if (typeof rhsAttr === "object" && rhsAttr !== null) {
          if ("constant" in rhsAttr) {
            setPrice((rhsAttr as Record<string, number>)["constant"]);
          } else if ("value" in rhsAttr) {
            setPrice((rhsAttr as Record<string, number>)["value"]);
          }
        }

        setNotes(existingAlert.notes || "");
      } else {
        // Initialize with provided values or defaults
        setSymbol(initialSymbol || "");
        setAlertType("simple");
        setLhsType("last_price");
        setRhsType(initialType === "price" ? "constant" : "trend_line");
        setOperator(">");
        setPrice(alertPrice);
        setNotes("");
      }
    }
  }, [open, existingAlert, initialSymbol, initialType, alertPrice]);

  const handleSave = () => {
    if (!symbol) {
      toast.error("Symbol is required");
      return;
    }

    if (rhsType === "constant" && (price === undefined || isNaN(price))) {
      toast.error("Valid price is required");
      return;
    }

    const alertData: Partial<InsertAlert> = {
      symbol,
      type: alertType,
      lhs_type: lhsType,
      rhs_type: rhsType,
      operator,
      notes: notes || null,
      rhs_attr:
        rhsType === "constant"
          ? ({ constant: price } as Json)
          : ({ trend_line_id: "placeholder" } as Json), // Would need an actual trendline ID in real usage
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  value={price !== undefined ? price.toString() : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPrice(val ? parseFloat(val) : undefined);
                  }}
                  className="col-span-3"
                  placeholder="Enter alert price"
                  step="0.01"
                />
              </div>
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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
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
