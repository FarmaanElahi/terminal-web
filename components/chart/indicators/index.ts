import { CustomIndicator, PineJS } from "./pinejs";
import { RelativeStrength } from "@/components/chart/indicators/relative_strength";

export function getIndicators(PineJS: PineJS): Promise<CustomIndicator[]> {
  // eslint-disable-next-line
  // @ts-ignore
  return Promise.resolve([RelativeStrength(PineJS)]);
}
