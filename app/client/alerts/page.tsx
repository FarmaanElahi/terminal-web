"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Pencil, PlusCircle, Trash } from "lucide-react";
import { AlertBuilder } from "@/components/alerts/alert_builder";
import {
  useAlerts,
  useDeleteAlert,
  useToggleAlertActive,
} from "@/lib/state/symbol";
import { Alert } from "@/types/supabase";
import { DateTime } from "luxon";

export default function AlertsPage() {
  const { data: alerts = [], isLoading } = useAlerts();
  const [isAlertBuilderOpen, setIsAlertBuilderOpen] = useState(false);
  const [initialAlertType, setInitialAlertType] = useState<
    "price" | "trendline"
  >("price");
  const [initialSymbol, setInitialSymbol] = useState<string>("");
  const [editingAlert, setEditingAlert] = useState<Alert | undefined>();

  const { mutate: deleteAlert } = useDeleteAlert();
  const { mutate: toggleAlertActive } = useToggleAlertActive();

  const openAlertBuilder = (type: "price" | "trendline", symbol?: string) => {
    setInitialAlertType(type);
    setInitialSymbol(symbol || "");
    setEditingAlert(undefined);
    setIsAlertBuilderOpen(true);
  };

  const openEditAlert = (alert: Alert) => {
    setEditingAlert(alert);
    setIsAlertBuilderOpen(true);
  };

  const closeAlertBuilder = () => {
    setIsAlertBuilderOpen(false);
    setEditingAlert(undefined);
  };

  const handleToggleActive = (alert: Alert) => {
    toggleAlertActive({
      id: alert.id,
      isActive: !alert.is_active,
    });
  };

  const formatAlertDescription = (alert: Alert) => {
    const condition = alert.operator === ">" ? "Above" : "Below";

    if (alert.rhs_type === "constant") {
      const price =
        typeof alert.rhs_attr === "object" && "value" in (alert.rhs_attr ?? {})
          ? (alert.rhs_attr as { value: number }).value
          : 0;
      return `${condition} ${price.toFixed(2)}`;
    } else {
      return `${condition} Trendline`;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <div className="space-x-2">
          <Button onClick={() => openAlertBuilder("price")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Price Alert
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-8 text-center">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="mt-4 text-lg font-semibold">No alerts yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Create a price or trendline alert to get notified when conditions
              are met.
            </p>
            <div className="space-x-2">
              <Button onClick={() => openAlertBuilder("price")}>
                Create Price Alert
              </Button>
              <Button
                variant="outline"
                onClick={() => openAlertBuilder("trendline")}
              >
                Create Trendline Alert
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <div className="font-medium">{alert.symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatAlertDescription(alert)}
                  </div>
                  {alert.notes && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Note: {alert.notes}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    Created {DateTime.fromISO(alert.created_at).toRelative()}{" "}
                    {alert.triggered_count > 0 &&
                      ` • Triggered ${alert.triggered_count} times`}
                    {alert.last_triggered_at &&
                      ` • Last triggered on ${DateTime.fromISO(alert.last_triggered_at).toFormat("dd LLL yyyy hh:mm")}`}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(alert)}
                    title={alert.is_active ? "Disable alert" : "Enable alert"}
                  >
                    {alert.is_active ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditAlert(alert)}
                    title="Edit alert"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                    title="Delete alert"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertBuilder
        open={isAlertBuilderOpen}
        onClose={closeAlertBuilder}
        initialType={initialAlertType}
        initialSymbol={initialSymbol}
        existingAlert={editingAlert}
      />
    </div>
  );
}
