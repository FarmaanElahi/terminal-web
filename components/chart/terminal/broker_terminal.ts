import {
  AccountManagerInfo,
  AccountMetainfo,
  Execution,
  IBrokerConnectionAdapterHost,
  IBrokerTerminal,
  InstrumentInfo,
  ISubscription,
  IWatchedValue,
  Order,
  Position,
  Side,
} from "@/components/chart/terminal/ibroker_terminal";
import { TradingAccount } from "@/server/integration";
import { kiteHolding, kiteMargin, kitePosition } from "@/server/terminal";

type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type Holding = Awaited<ReturnType<typeof kiteHolding>>[number] & {
  id: string;
  invested: number;
  currValue: number;
  overallPnlPct: number;
};

export class TerminalBroker implements IBrokerTerminal {
  private readonly activeAccount: TradingAccount;
  private readonly balance: IWatchedValue<number>;
  private readonly equity: IWatchedValue<number>;
  private readonly holdingChangeDelegate: ISubscription;
  private holding: Holding[] = [];

  constructor(
    private host: IBrokerConnectionAdapterHost,
    tradingAccounts: TradingAccount[],
  ) {
    this.activeAccount = tradingAccounts.find(
      (value) => value.type === "kite",
    )!;
    this.balance = host.factory.createWatchedValue(0);
    this.equity = host.factory.createWatchedValue(0);
    this.holdingChangeDelegate = host.factory.createDelegate();
    void this.refreshHolding();
    void this.refreshAccount();
  }

  async accountsMetainfo(): Promise<AccountMetainfo[]> {
    return [
      {
        id: this.activeAccount.accountId,
        name: this.activeAccount.name.split(" ")?.[0] ?? "Error",
      },
    ];
  }

  accountManagerInfo(): AccountManagerInfo {
    return {
      accountTitle: "Trading Sample",
      pages: [
        {
          id: "holdings",
          title: "Holdings",
          tables: [
            {
              id: "holdings",
              columns: [
                {
                  label: "Symbol",
                  formatter: "text",
                  id: "name",
                  dataFields: ["ticker"],
                },
                {
                  label: "Net Quantity",
                  id: "qty",
                  dataFields: ["quantity"],
                  formatter: "formatQuantity",
                },
                {
                  label: "Avg. Price",
                  id: "avgPrice",
                  dataFields: ["average_price"],
                  formatter: "formatPrice",
                },
                {
                  label: "LTP",
                  id: "ltp",
                  dataFields: ["last_price"],
                  formatter: "formatPrice",
                },
                // Custom
                {
                  label: "Investment",
                  id: "investment",
                  dataFields: ["invested"],
                  formatter: "formatPrice",
                },
                // Custom
                {
                  label: "Current Value",
                  id: "currValue",
                  dataFields: ["currValue"],
                  formatter: "formatPrice",
                },
                {
                  label: "Day P&L",
                  id: "dayPnl",
                  dataFields: ["day_change"],
                  formatter: "profit",
                },
                {
                  label: "Day %",
                  id: "dayPct",
                  dataFields: ["day_change_percentage"],
                  formatter: "profit",
                },
                {
                  label: "Overall P&L",
                  id: "pnl",
                  dataFields: ["pnl"],
                  formatter: "profit",
                },
                // Custom
                {
                  label: "Overall %",
                  id: "overallPnlPct",
                  dataFields: ["overallPnlPct"],
                  formatter: "profit",
                },
                {
                  label: "Demat Qty",
                  id: "dematQty",
                  dataFields: ["realised_quantity"],
                  formatter: "formatQuantity",
                },
                {
                  label: "T1 Qty",
                  id: "t1Qty",
                  dataFields: ["t1_quantity"],
                  formatter: "formatQuantity",
                },
              ],
              getData: (p) => {
                console.log("Get data....", p);
                return Promise.resolve(this.holding);
              },
              changeDelegate: this.holdingChangeDelegate,
            },
          ],
        },
      ],
      summary: [
        {
          text: "Balance",
          wValue: this.balance,
          isDefault: true,
          formatter: "fixed",
        },
        {
          text: "Equity",
          wValue: this.equity,
          isDefault: true,
          formatter: "fixed",
        },
      ],
      orderColumns: [],
      positionColumns: [{ id: "sy", label: "Symbol", dataFields: ["id"] }],
      contextMenuActions: () => Promise.resolve(),
    };
  }

  orders(): Promise<Order[]> {
    return Promise.resolve([]);
  }

  async positions(): Promise<Position[]> {
    const positions = await kitePosition(this.currentAccount());
    console.log(positions);
    return positions.net.map((value) => ({
      avgPrice: value.average_price,
      qty: value.quantity,
      symbol: value.tradingsymbol,
      id: value.tradingsymbol,
      side: Side.BUY,
    }));
  }

  async symbolInfo(symbol: string): Promise<InstrumentInfo> {
    console.log("Get symbol info", symbol);
    return {
      qty: { min: 1, max: 1000000, step: 1, uiStep: 1, default: 1 },
      currency: "INR",
      description: "",
      type: "stock",
      minTick: 0.01,
      pipSize: 1,
      pipValue: 1,
    };
  }

  executions(): Promise<Execution[]> {
    return Promise.resolve([]);
  }

  currentAccount() {
    return this.activeAccount.accountId;
  }

  async isTradable() {
    return true;
  }

  async refreshHolding() {
    const holding = await kiteHolding(this.currentAccount());
    this.holding = holding.map((h) => ({
      ...h,
      id: h.isin,
      // Hardcoded NSE since we don't have BSE Data
      ticker: ["NSE", h.tradingsymbol].join(":"),
      invested: h.average_price * h.quantity,
      currValue: h.last_price * h.quantity,
      overallPnlPct: (h.pnl / (h.average_price * h.quantity)) * 100,
    }));
    this.holding.forEach((h) => this.holdingChangeDelegate.fire(h));
    setTimeout(() => this.refreshHolding(), 10000);
  }

  async refreshAccount() {
    const margin = await kiteMargin(this.currentAccount());
    console.log(margin);
    this.balance.setValue(margin?.available?.live_balance ?? 0);
    this.equity.setValue(margin?.utilised.exposure ?? 0);
    setTimeout(() => this.refreshAccount(), 10000);
  }
}
