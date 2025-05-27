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
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AlertBuilderProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  alertParams?: AlertParams;
  existingAlert?: Alert;
  onSave?: (alert: Alert) => void;
}

interface ConstantAlertParams {
  type: "constant";
  symbol: string;
  params: { constant: number };
}

interface TrenldineAlertParams {
  type: "trend_line";
  symbol: string;
  params: { trend_line: { price: number; time: number }[] };
}

type ParamsType =
  | ConstantAlertParams["params"]
  | TrenldineAlertParams["params"];
export type AlertParams = ConstantAlertParams | TrenldineAlertParams;

export function AlertBuilder({
  open,
  onOpenChange,
  alertParams,
  existingAlert,
  onSave,
}: AlertBuilderProps) {
  const [symbol, setSymbol] = useState("");
  const [alertType, setAlertType] = useState<"simple">("simple");
  const [active, setActive] = useState(true);
  const [lhsType, setLhsType] = useState<"last_price">("last_price");
  const [rhsType, setRhsType] = useState<"constant" | "trend_line">("constant");
  const [operator, setOperator] = useState<string>(">");
  const [rhsAttr, setRhsAttr] = useState<ParamsType | undefined>(undefined);
  const [notes, setNotes] = useState<string>("");

  const { mutate: createAlert, isPending: isCreating } = useCreateAlert(
    (alert) => {
      toast(
        `Alert created for ${alert.symbol}${rhsAttr ? ` at ${rhsAttr}` : ""}`,
      );
      onOpenChange(false);
      onSave?.(alert);
    },
  );

  const { mutate: updateAlert, isPending: isUpdating } = useUpdateAlert(
    (alert) => {
      toast(
        `Alert updated for ${alert.symbol}${rhsAttr ? ` at ${rhsAttr}` : ""}`,
      );
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
        setActive(existingAlert.is_active);

        // Handle price from rhs_attr depending on the format
        setRhsAttr(existingAlert.rhs_attr as ParamsType);
        setNotes(existingAlert.notes || "");
      } else if (alertParams) {
        // Initialize with provided values or defaults
        setSymbol(alertParams.symbol || "");
        setAlertType("simple");
        setLhsType("last_price");
        setRhsType(alertParams.type);
        setOperator(">");
        setRhsAttr(alertParams.params);
        setNotes("");
        setActive(true);
      }
    }
  }, [open, existingAlert, alertParams]);

  const handleSave = () => {
    if (!symbol) {
      toast.error("Symbol is required");
      return;
    }

    const alertData: Partial<InsertAlert> = {
      symbol,
      type: alertType,
      lhs_type: lhsType,
      rhs_type: rhsType,
      operator,
      notes: notes || null,
      rhs_attr: rhsAttr,
      is_active: active,
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

  if (!alertParams && !existingAlert) return <></>;

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
              disabled={!!alertParams?.symbol}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symbol" className="text-right">
              Active
            </Label>
            <Switch
              className="outline-0"
              checked={active}
              onCheckedChange={setActive}
            />
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
                  value={(rhsAttr as ConstantAlertParams["params"])?.[
                    "constant"
                  ]?.toString()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRhsAttr({ constant: parseFloat(val) });
                  }}
                  className="col-span-3"
                  placeholder="Enter alert price"
                  step="0.01"
                />
              </div>
            </>
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
