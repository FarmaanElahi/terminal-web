import { ReactNode } from "react";
import { ChartContextProvider } from "@/lib/state/charts";
import { ChartLoader } from "@/components/chart/chart_loader";
import { ReactQueryProvider } from "@/lib/client";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ChartLoader>
        <ChartContextProvider>
          <div className="h-full">{children}</div>
        </ChartContextProvider>
      </ChartLoader>
    </ReactQueryProvider>
  );
}
