import React, { ReactNode } from "react";
import { ChartContextProvider } from "@/lib/state/charts";
import { ChartLoader } from "@/components/chart/chart_loader";
import { ReactQueryProvider } from "@/lib/client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ChartLoader>
        <ChartContextProvider>
          <SidebarProvider defaultOpen={false} className="h-full">
            <AppSidebar />
            <SidebarInset className="overflow-auto">{children}</SidebarInset>
          </SidebarProvider>
        </ChartContextProvider>
      </ChartLoader>
    </ReactQueryProvider>
  );
}
