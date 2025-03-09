import { ScreenerProvider } from "@/hooks/use-active-screener";
import { Screener } from "@/components/screener/screener";
import { ScreenSelector } from "@/components/screener/screen-selector";

export function ScreenerApp() {
  return (
    <ScreenerProvider>
      <ScreenSelector />
      <Screener />
    </ScreenerProvider>
  );
}
