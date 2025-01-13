import { ReactNode } from "react";
import { ReactQueryProvider } from "@/lib/client";
import { ChartContextProvider } from "@/lib/state/charts";
import { ChartLoader } from "@/components/chart/chart_loader";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ChartLoader>
        <ChartContextProvider>
          <div className="h-full">{children}</div>
        </ChartContextProvider>
      </ChartLoader>
      {/*<SidebarProvider>*/}
      {/*<AppSidebar />*/}
      {/*</SidebarProvider>*/}
    </ReactQueryProvider>
  );
}
