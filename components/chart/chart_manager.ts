import { ChartStorage } from "@/components/chart/chart_storage";
import { LogoProvider } from "@/components/chart/logo_provider";
import { Client } from "@/utils/supabase/client";
import { DatafeedUpstox } from "@/components/chart/datafeed_upstox";
import type { TradingAccount } from "@/server/integration";
import { UpstoxClient } from "@/utils/upstox/client";

export class ChartManager {
  readonly chartStorage: ChartStorage;
  readonly logoProvider: LogoProvider;
  readonly datafeed: DatafeedUpstox;

  constructor(
    private readonly client: Client,
    upstox: UpstoxClient,
    readonly accounts: TradingAccount[],
  ) {
    this.logoProvider = new LogoProvider();
    this.datafeed = new DatafeedUpstox(this.logoProvider, upstox);
    this.chartStorage = new ChartStorage(this.client);
  }
}
