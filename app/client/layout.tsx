import React, { ReactNode } from "react";
import { ChartLoader } from "@/components/chart/chart_loader";
import { ReactQueryProvider } from "@/components/query-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DuckDBProvider } from "@/utils/duckdb";
import { AppInfoProvider } from "@/hooks/use-app-info";
import { getAllTradingAccounts } from "@/server/integration";
import { ChartProvider } from "@/lib/state/charts";

export default async function Layout({ children }: { children: ReactNode }) {
  const [tradingAccounts] = await Promise.all([getAllTradingAccounts()]);
  return (
    <DuckDBProvider>
      <AppInfoProvider tradingAccounts={tradingAccounts}>
        <ReactQueryProvider>
          <ChartProvider>
            <ChartLoader>
              <SidebarProvider defaultOpen={false} className="h-full">
                <AppSidebar />
                <SidebarInset className="overflow-auto">
                  {children}
                </SidebarInset>
              </SidebarProvider>
            </ChartLoader>
          </ChartProvider>
        </ReactQueryProvider>
      </AppInfoProvider>
    </DuckDBProvider>
  );
}
