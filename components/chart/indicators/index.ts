import { CustomIndicator, PineJS } from "./pinejs";
import { RelativeStrength } from "@/components/chart/indicators/relative_strength";
import { MarketCycleCount } from "@/components/chart/indicators/market-cycle-count";

export function getIndicators(PineJS: PineJS): Promise<CustomIndicator[]> {
  // eslint-disable-next-line
  // @ts-ignore
  return Promise.resolve([RelativeStrength(PineJS), MarketCycleCount(PineJS)]);
}
