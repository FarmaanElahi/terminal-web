import { CustomIndicator, PineJS } from "./pinejs";
import { RelativeStrength } from "@/components/chart/indicators/relative_strength";
import { MarketCycleCount } from "@/components/chart/indicators/market-cycle-count";
import { EnhancedVolume } from "@/components/chart/indicators/enhanced-volume";
import { TechnicalPatterns } from "@/components/chart/indicators/technical-patterns";
import { ADR } from "@/components/chart/indicators/adr";
import { RMV } from "@/components/chart/indicators/rmv";
import { RSLine } from "@/components/chart/indicators/rs_line";
import { PriceVolume } from "@/components/chart/indicators/price_volume";
import { RME } from "@/components/chart/indicators/rme";

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
    RME(PineJS),
    RSLine(PineJS),
    PriceVolume(PineJS),
  ]);
}
