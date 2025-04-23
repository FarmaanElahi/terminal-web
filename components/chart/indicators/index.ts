import { CustomIndicator, PineJS } from "./pinejs";
import { RelativeStrength } from "@/components/chart/indicators/relative_strength";
import { MarketCycleCount } from "@/components/chart/indicators/market-cycle-count";
import { EnhancedVolume } from "@/components/chart/indicators/enhanced-volume";
import { TechnicalPatterns } from "@/components/chart/indicators/technical-patterns";
import { ADR } from "@/components/chart/indicators/adr";
import { RMV } from "@/components/chart/indicators/rmv";

export function getIndicators(PineJS: PineJS): Promise<CustomIndicator[]> {
  // eslint-disable-next-line
  // @ts-ignore
  return Promise.resolve([
    RelativeStrength(PineJS),
    MarketCycleCount(PineJS),
    EnhancedVolume(PineJS),
    TechnicalPatterns(PineJS),
    ADR(PineJS),
    RMV(PineJS),
  ]);
}
