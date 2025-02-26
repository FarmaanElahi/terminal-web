"use client";

import React, { useState } from "react";
import { Dashboard } from "./dashboard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface DashboardConfig {
  id: string;
  name: string;
}

export function DashboardManager() {
  const [dashboards, setDashboards] = useLocalStorage<DashboardConfig[]>(
    "dashboards",
    [],
  );
  const [activeDashboard, setActiveDashboard] = useLocalStorage<string>(
    "active-dashboard",
    "",
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  const handleCreateDashboard = () => {
    const newDashboard: DashboardConfig = {
      id: `dashboard-${Date.now()}`,
      name: newDashboardName,
    };
    setDashboards([...dashboards, newDashboard]);
    setActiveDashboard(newDashboard.id);
    setIsCreating(false);
    setNewDashboardName("");
  };

  const activeDashboardConfig = dashboards.find(
    (d) => d.id === activeDashboard,
  );

  return (
    <>
      <div className="flex items-center space-x-4 p-4 border-b">
        <select
          value={activeDashboard}
          onChange={(e) => setActiveDashboard(e.target.value)}
          className="p-2 rounded border"
        >
          {dashboards.map((dashboard) => (
            <option key={dashboard.id} value={dashboard.id}>
              {dashboard.name}
            </option>
          ))}
        </select>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Dashboard
        </Button>
      </div>

      <div className="flex-1">
        {activeDashboardConfig && (
          <Dashboard
            id={activeDashboardConfig.id}
            name={activeDashboardConfig.name}
          />
        )}
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Dashboard Name"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
            />
            <Button onClick={handleCreateDashboard}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
