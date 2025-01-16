import { ReactNode } from "react";
import { ChartContextProvider } from "@/lib/state/charts";
import { ChartLoader } from "@/components/chart/chart_loader";
import { ReactQueryProvider } from "@/lib/client";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ChartLoader>
        <ChartContextProvider>{children}</ChartContextProvider>
      </ChartLoader>
    </ReactQueryProvider>
  );
}
