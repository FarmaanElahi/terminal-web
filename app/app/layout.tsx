import React, { ReactNode } from "react";
import { ChartLoader } from "@/components/chart/chart_loader";
import { ReactQueryProvider } from "@/components/query-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ChartLoader>
        <SidebarProvider defaultOpen={false} className="h-full">
          <AppSidebar />
          <SidebarInset className="overflow-auto">{children}</SidebarInset>
        </SidebarProvider>
      </ChartLoader>
    </ReactQueryProvider>
  );
}
