import { ChartContextProvider } from "@/lib/state/charts";
import { ChartLoader } from "@/components/chart/chart_loader";
import { ReactNode } from "react";
import { GroupSymbolProvider } from "@/lib/state/grouper";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ChartLoader>
      <ChartContextProvider>
        <GroupSymbolProvider>{children}</GroupSymbolProvider>
      </ChartContextProvider>
    </ChartLoader>
  );
}
