import { MarketDataFeeder, Mode, ModeCode } from "./market_data_feeder";
import { Streamer } from "./streamer";

export class MarketDataStreamer extends Streamer {
  private readonly subscriptions = {
    [Mode.LTPC]: new Set(),
    [Mode.FULL]: new Set(),
    [Mode.OPTION]: new Set(),
  } as Record<ModeCode, Set<string>>;
  private readonly _marketFeeder: MarketDataFeeder;
  private _url?: string;

  constructor(
    private instrumentKeys: string[] = [],
    private mode: ModeCode = "ltpc",
  ) {
    super();
    this.subscriptions = {
      [Mode.LTPC]: new Set(),
      [Mode.FULL]: new Set(),
      [Mode.OPTION]: new Set(),
    };
    if (!Object.values(Mode).includes(mode)) {
      throw new Error("Invalid mode provided " + mode);
    }
    // Populate initial subscriptions if provided
    instrumentKeys.forEach((key) => this.subscriptions[mode].add(key));
    this._marketFeeder = new MarketDataFeeder();
  }

  subscriptionEventListeners() {
    this.feeder?.on("open", () => {
      Object.entries(this.subscriptions).forEach(([mode, keys]) => {
        if (keys.size > 0) {
          this.subscribe(Array.from(keys), mode as ModeCode);
        }
      });
    });
  }

  async connect(url: string) {
    this._url = url;
    this.setupEventListeners();
    this.subscriptionEventListeners();
    await this.feeder.connect(this._url);
  }

  disconnect() {
    this.feeder?.disconnect();
    this.clearSubscriptions();
  }

  subscribe(instrumentKeys: string[], mode: ModeCode) {
    this.feeder?.subscribe(instrumentKeys, mode);
    this.subscriptions[mode] = new Set([
      ...this.subscriptions[mode],
      ...instrumentKeys,
    ]);
  }

  unsubscribe(instrumentKeys: string[]) {
    this.feeder?.unsubscribe(instrumentKeys);
    Object.values(this.subscriptions).forEach((set) => {
      instrumentKeys.forEach((key) => set.delete(key));
    });
  }

  changeMode(instrumentKeys: string[], newMode: ModeCode) {
    this.feeder?.changeMode(instrumentKeys, newMode);

    Object.keys(this.subscriptions).forEach((mode) => {
      instrumentKeys.forEach((key) => {
        this.subscriptions[mode as ModeCode]?.delete(key);
      });
    });

    // Add keys to the new mode
    this.subscriptions[newMode] = new Set([
      ...this.subscriptions[newMode],
      ...instrumentKeys,
    ]);

    this.mode = newMode;
  }

  clearSubscriptions() {
    this.subscriptions[Mode.LTPC].clear();
    this.subscriptions[Mode.FULL].clear();
    this.subscriptions[Mode.OPTION].clear();
  }

  get feeder(): MarketDataFeeder {
    return this._marketFeeder;
  }

  get url() {
    return this._url!;
  }
}
