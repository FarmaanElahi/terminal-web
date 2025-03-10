"use client";

import { DashboardManager } from "@/components/dashboard/dashboard-manager";
import { GroupSymbolProvider } from "@/lib/state/grouper";
import "@/components/grid/grid_init";

export default function Page() {
  return (
    <GroupSymbolProvider>
      <DashboardManager />
    </GroupSymbolProvider>
  );
}
