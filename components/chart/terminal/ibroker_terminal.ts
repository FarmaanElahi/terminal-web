/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AccountManagerSummaryField {
  text: string;
  wValue: IWatchedValue;
  formatter?: string;
  isDefault?: boolean;
  informerMessage?: string;
}

type AccountManagerColumn = "id" | "symbol" | "side" | "qty" | "avgPrice";

interface PageColumn {
  id: string;
  label: string;
  alignment?: "left" | "right";
  help?: string;
  formatter?: string;
  dataFields: (AccountManagerColumn | string)[];
}

export interface ISubscription {
  subscribe: () => void;
  unsubscribe: () => void;
  fire: (value: any) => void;
}

interface AccountManagerTable {
  id: string;
  title?: string;
  changeDelegate: ISubscription;
  deleteDelegate?: ISubscription;
  columns: PageColumn[];
  getData: (paginationLastId?: string | number) => Promise<Array<unknown>>;
}

interface AccountManagerPage {
  id: string;
  title: string;
  displayCounterInTab?: boolean;
  tables: AccountManagerTable[];
}

export interface AccountManagerInfo {
  accountTitle: string;
  summary: AccountManagerSummaryField[];
  orderColumns: PageColumn[];
  positionColumns: PageColumn[];
  pages: AccountManagerPage[];
  contextMenuActions?: () => Promise<[]>;
}

export interface AccountMetainfo {
  currency?: string;
  currencySign?: string;
  id: string;
  name: string;
}

export enum Side {
  BUY = 1,
  SELL = -1,
}

export enum OrderStatus {
  Canceled = 1,
  Filled = 2,
  Inactive = 3,
  Placing = 4,
  Rejected = 5,
}

export enum OrderType {
  Limit = 1,
  Market = 2,
  Stop = 3,
  StopLimit = 4,
}

export interface PlacedOrder {
  id: string;
  avgPrice?: number;
  qty: string;
  side: Side;
  status: OrderStatus;
  symbol: string;
  type: OrderType;
}

export interface BracketOrder {
  avgPrice?: number;
  qty: string;
  filledQty?: number;
  id: string;
  limitPrice?: number;
  side?: Side;
  status: OrderStatus;
  symbol: string;
}

export type Order = PlacedOrder | BracketOrder;

export interface Position {
  id: string;
  ticker: string;
  exchange: string;
  side: Side;
  product: string;
  avgPrice: number;
  qty: number;
}

export interface Execution {
  netAmount?: number;
  qty: number;
  side: Side;
  symbol: string;
  time: number;
  commission?: number;
}

export interface InstrumentInfo {
  description: string;
  pipSize: number;
  pipValue: number;
  minTick: number;
  brokerSymbol?: string;
  currency: string;
  type?: string;
  qty: {
    min: number;
    max: number;
    step: number;
    uiStep?: number;
    default: number;
  };
}

export interface TradeContext {
  displaySymbol: string;
  last: number;
  symbol: string;
  value: number;
}

export interface IWatchedValue<T = any> {
  value: T;
  setValue: (value: T, forceUpdate?: boolean) => void;
}

export interface ActionDescription {
  checkable?: boolean;
  checked?: boolean;
  checkedStateSource: () => boolean;
  enabled: boolean;
  externalLink: boolean;
  icon: string;
  separator: boolean;
  shortcut: boolean;
  text: string;
  tooltip?: string;
}

export interface INumberFormatter {
  pa: () => void;
}

export interface ActionDescriptionWithCallback extends ActionDescription {
  action: (a: ActionDescription) => void;
}

export type ActionMetaInfo = ActionDescriptionWithCallback;

export interface IBrokerTerminal {
  accountManagerInfo(): AccountManagerInfo;

  accountsMetainfo: () => Promise<AccountMetainfo[]>;

  currentAccount?(): string;

  chartContextMenuActions: (t: TradeContext) => Promise<ActionMetaInfo[]>;

  isTradable(symbol: string): Promise<boolean>;

  orders(): Promise<Order[]>;

  positions(): Promise<Position[]>;

  executions(): Promise<Execution[]>;

  symbolInfo(symbol: string): Promise<InstrumentInfo>;

  formatter: (
    symbol: string,
    alignToMinMove: boolean,
  ) => Promise<INumberFormatter>;
}

export interface IBrokerConnectionAdapterFactory {
  createWatchedValue<T>(value?: T): IWatchedValue<T>;

  createDelegate(): ISubscription;
}

export interface IBrokerConnectionAdapterHost {
  getQty(symbol: string): Promise<number>;

  factory: IBrokerConnectionAdapterFactory;

  defaultContextMenuActions(
    t: TradeContext,
    p?: unknown,
  ): Promise<ActionMetaInfo[]>;

  defaultFormatter: (
    symbol: string,
    alignToMinMove: boolean,
  ) => Promise<INumberFormatter>;
}
