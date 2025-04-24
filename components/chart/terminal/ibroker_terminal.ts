export interface AccountManagerInfo {
  accountTitle: string;
}

export interface AccountMetainfo {
  currency: string;
  currencySign: string;
  accountId: string;
  name: string;
}

export interface IBrokerTerminal {
  accountManagerInfo(): Promise<AccountManagerInfo>;

  accountsMetainfo: () => Promise<AccountMetainfo[]>;

  currentAccount(): string;

  isTradable(symbol: string): Promise<boolean>;
}

export interface IBrokerConnectionAdapterHost {
  getQty(symbol: string): Promise<number>;
}
