import {
  AccountManagerInfo,
  AccountMetainfo,
  IBrokerConnectionAdapterHost,
  IBrokerTerminal,
} from "@/components/chart/terminal/ibroker_terminal";
import { TradingAccount } from "@/server/integration";
import { KiteConnect } from "kiteconnect";
import { createKiteConnect } from "@/utils/kite/client";

export class TerminalBroker implements IBrokerTerminal {
  private activeAccount!: string;
  private readonly kite: KiteConnect;

  constructor(
    private host: IBrokerConnectionAdapterHost,
    private readonly tradingAccount: TradingAccount[],
  ) {
    const token = tradingAccount.find((value) => value?.type === "kite")
      ?.token as string;
    this.kite = createKiteConnect(token);
  }

  async accountsMetainfo(): Promise<AccountMetainfo[]> {
    return this.tradingAccount.map((value) => ({
      currency: "INR",
      currencySign: "₹",
      accountId: [value.type, value.name].join("-"),
      name: [value.type, value.name].join("-"),
    }));
  }

  async accountManagerInfo(): Promise<AccountManagerInfo> {
    const meta = this.tradingAccount
      .map((value) => ({
        currency: "INR",
        currencySign: "₹",
        accountId: [value.type, value.name].join("-"),
        name: [value.type, value.name].join("-"),
      }))
      .find((value) => value.accountId === this.activeAccount);
    if (!meta) throw new Error("Invalid Account");

    return { accountTitle: meta?.name };
  }

  currentAccount(): string {
    return this.activeAccount;
  }

  setCurrentAccount(accountId: string): void {
    this.activeAccount = accountId;
  }

  async isTradable() {
    return true;
  }
}
