import { ReactNode } from "react";
import { ReactQueryProvider } from "@/lib/client";
import { ChartManagerContextProvider } from "@/components/chart/chart_context";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ChartManagerContextProvider>
        <div className="h-full">{children}</div>
      </ChartManagerContextProvider>
      {/*<SidebarProvider>*/}
      {/*<AppSidebar />*/}
      {/*</SidebarProvider>*/}
    </ReactQueryProvider>
  );
}
