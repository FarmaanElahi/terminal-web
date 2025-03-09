import { ScreenerProvider } from "@/hooks/use-active-screener";
import { Screener } from "@/components/screener/screener";
import { ScreenSelector } from "@/components/screener/screen-selector";
import { WidgetProps } from "@/components/dashboard/widgets/widget-props";

export function ScreenerApp(props: WidgetProps) {
  return (
    <ScreenerProvider
      defaultActiveScreenId={
        props.layout?.settings?.activeScreenId as string | undefined
      }
      onActiveScreenIdChange={(screenerId) =>
        props.updateSettings({
          ...props.layout?.settings,
          activeScreenId: screenerId,
        })
      }
    >
      <ScreenSelector />
      <Screener />
    </ScreenerProvider>
  );
}
