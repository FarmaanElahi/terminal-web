"use client";

import { DashboardManager } from "@/components/dashboard/dashboard-manager";
import { GrouperProvider, GroupSymbolProvider } from "@/lib/state/grouper";
import { ScreenerProvider } from "@/hooks/use-active-screener";
import "@/components/grid/grid_init";

export default function Page() {
  return (
    <GroupSymbolProvider>
      <GrouperProvider group={1}>
        <ScreenerProvider>
          <DashboardManager />;
        </ScreenerProvider>
      </GrouperProvider>
    </GroupSymbolProvider>
  );
}
