import {
  AccountManagerInfo,
  AccountMetainfo,
  Execution,
  IBrokerConnectionAdapterHost,
  IBrokerTerminal,
  InstrumentInfo,
  INumberFormatter,
  ISubscription,
  IWatchedValue,
  Order,
  Position,
  Side,
  TradeContext,
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
                  id: "symbol",
                  // Make this look like a symbol
                  formatter: "symbol",
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
                  formatter: "fixedInCurrency",
                },
                // Custom
                {
                  label: "Current Value",
                  id: "currValue",
                  dataFields: ["currValue"],
                  formatter: "fixedInCurrency",
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
              getData: () => Promise.resolve(this.holding),
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
          formatter: "fixedInCurrency",
        },
        {
          text: "Equity",
          wValue: this.equity,
          isDefault: true,
          formatter: "fixedInCurrency",
        },
      ],
      orderColumns: [],
      positionColumns: [
        {
          label: "Symbol",
          id: "symbol",
          // Make this look like a symbol
          formatter: "symbol",
          dataFields: ["ticker"],
        },
        {
          label: "Exchange",
          id: "exchange",
          dataFields: ["exchange"],
          formatter: "fixed",
        },
        {
          label: "Side",
          id: "side",
          dataFields: ["side"],
          formatter: "fixed",
        },
        {
          label: "Product",
          id: "product",
          dataFields: ["product"],
          formatter: "fixed",
        },
        {
          label: "Net Qty",
          id: "qty",
          dataFields: ["qty"],
          formatter: "formatQuantity",
        },
        {
          label: "Avg Traded Price",
          id: "avgPrice",
          dataFields: ["avgPrice"],
          formatter: "formatPrice",
        },
        {
          label: "LTP",
          id: "ltp",
          dataFields: ["ltp"],
          formatter: "formatPrice",
        },
        {
          label: "Realised P&L",
          id: "realisedPnl",
          dataFields: ["realisedPnl"],
          formatter: "fixedInCurrency",
        },
        {
          label: "Unrealised P&L",
          id: "unrealisedPnl",
          dataFields: ["unrealisedPnl"],
          formatter: "fixedInCurrency",
        },
      ],
      contextMenuActions: () => Promise.resolve([]),
    };
  }

  orders(): Promise<Order[]> {
    return Promise.resolve([]);
  }

  async positions(): Promise<Position[]> {
    const positions = await kitePosition(this.currentAccount());
    return positions.net.map((p) => ({
      id: [p.exchange, p.tradingsymbol].join(":"),
      ticker: [p.exchange, p.tradingsymbol].join(":"),
      exchange: p.exchange,
      side: Side.BUY,
      product: p.product,
      avgPrice: p.average_price,
      qty: p.quantity,
      ltp: p.last_price,
      realisedPnl: p.realised,
      unrealisedPnl: p.unrealised,
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

  formatter(
    symbol: string,
    alignToMinMove: boolean,
  ): Promise<INumberFormatter> {
    console.log("get format");
    return this.host.defaultFormatter(symbol, alignToMinMove);
  }

  async chartContextMenuActions(t: TradeContext) {
    return await this.host.defaultContextMenuActions(t);
  }

  async isTradable() {
    return true;
  }

  cancelOrders() {}

  async refreshHolding() {
    const holding = await kiteHolding(this.currentAccount());
    this.holding = holding.map((h) => ({
      ...h,
      id: h.isin,
      // Hardcoded NSE since we don't have BSE Data
      ticker: [h.exchange, h.tradingsymbol].join(":"),
      invested: h.average_price * h.quantity,
      currValue: h.last_price * h.quantity,
      overallPnlPct: (h.pnl / (h.average_price * h.quantity)) * 100,
    }));
    this.holding.forEach((h) => this.holdingChangeDelegate.fire(h));
    setTimeout(() => this.refreshHolding(), 30000);
  }

  async refreshAccount() {
    const margin = await kiteMargin(this.currentAccount());
    console.log(margin);
    this.balance.setValue(margin?.available?.live_balance ?? 0);
    this.equity.setValue(margin?.utilised.exposure ?? 0);
    setTimeout(() => this.refreshAccount(), 30000);
  }
}
