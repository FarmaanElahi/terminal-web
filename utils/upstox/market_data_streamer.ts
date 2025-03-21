// utils/upstox/market_data_streamer.ts
import { MarketDataFeeder, Mode, ModeCode } from "./market_data_feeder";
import { Streamer } from "./streamer";
import { getUpstoxMarketFeedUrl } from "@/server/upstox";
import * as MarketV3 from "@/utils/upstox/market_v3";
import IFeed = MarketV3.com.upstox.marketdatafeeder.rpc.proto.IFeed;
import FeedResponse = MarketV3.com.upstox.marketdatafeeder.rpc.proto.FeedResponse;

type SubscriptionState = {
  isSubscribed: boolean;
  listeners: Map<string, number>; // instrumentKey -> reference count
};

export class MarketDataStreamer extends Streamer {
  private readonly subscriptionState: Record<ModeCode, SubscriptionState> = {
    [Mode.LTPC]: { isSubscribed: false, listeners: new Map() },
    [Mode.FULL]: { isSubscribed: false, listeners: new Map() },
    [Mode.OPTION]: { isSubscribed: false, listeners: new Map() },
  };

  private readonly _marketFeeder: MarketDataFeeder;
  private _url?: string;
  private pendingSubscriptions: Map<ModeCode, Set<string>> = new Map();
  private pendingUnsubscriptions: Set<string> = new Set();
  private _mode: ModeCode;
  private _isConnecting: boolean = false;

  // Store accumulated feed data
  private _feeds: Record<string, IFeed> = {};

  constructor(instrumentKeys: string[] = [], mode: ModeCode = "ltpc") {
    super();

    if (!Object.values(Mode).includes(mode)) {
      throw new Error("Invalid mode provided " + mode);
    }

    this._mode = mode;

    // Initialize pending subscriptions map for all modes
    Object.values(Mode).forEach((mode) => {
      this.pendingSubscriptions.set(mode as ModeCode, new Set());
    });

    // Populate initial subscriptions if provided
    instrumentKeys.forEach((key) => {
      this.addSubscription(key, mode);
    });

    this._marketFeeder = new MarketDataFeeder();

    // Set up feed data accumulation
    this._marketFeeder.on("data", (response: FeedResponse) => {
      this.accumulateFeeds(response);
    });
  }

  /**
   * Accumulate feed data from multiple responses
   * @param response The feed response from Upstox
   */
  private accumulateFeeds(response: FeedResponse): void {
    if (!response.feeds) return;

    // Merge the new feeds with the existing ones
    const updatedFeeds = { ...this._feeds };

    Object.entries(response.feeds).forEach(([instrumentKey, feed]) => {
      updatedFeeds[instrumentKey] = feed;
    });

    this._feeds = updatedFeeds;

    // Emit the accumulated feeds in the message event
    this.emit(this.Event.MESSAGE, { feeds: this._feeds });
  }

  private subscriptionEventListeners() {
    this.feeder?.on("open", () => {
      // Process any pending subscriptions when connection opens
      this._isConnecting = false;
      this.processPendingSubscriptions();
      this.processPendingUnsubscriptions();
    });
  }

  /**
   * Connect to the Upstox market feed using the authentication URL
   */
  public async connectNow() {
    const url = await getUpstoxMarketFeedUrl();
    return this.connect(url);
  }

  /**
   * Connect to the Upstox market feed with a provided URL
   * @param url WebSocket connection URL
   */
  public async connect(url: string) {
    this._url = url;
    this._isConnecting = true;
    this.setupEventListeners();
    this.subscriptionEventListeners();
    await this.feeder.connect(this._url);
  }

  /**
   * Disconnect from the Upstox market feed and clear all subscriptions
   */
  public disconnect() {
    this.feeder?.disconnect();
    this.clearSubscriptions();
    this._feeds = {}; // Clear accumulated feeds
    return this; // For method chaining
  }

  private addSubscription(instrumentKey: string, mode: ModeCode) {
    const state = this.subscriptionState[mode];
    const currentCount = state.listeners.get(instrumentKey) || 0;
    state.listeners.set(instrumentKey, currentCount + 1);

    // If this is the first listener for this instrument in this mode,
    // add it to pending subscriptions
    if (currentCount === 0) {
      this.pendingSubscriptions.get(mode)!.add(instrumentKey);

      // Remove from pending unsubscriptions if it exists
      this.pendingUnsubscriptions.delete(instrumentKey);
    }

    // Process subscriptions if we're connected
    if (this.isConnected) {
      this.processPendingSubscriptions();
    }
  }

  private removeSubscription(instrumentKey: string) {
    let removedFromAnyMode = false;

    // Check all modes for this instrument
    Object.entries(this.subscriptionState).forEach(([, state]) => {
      const currentCount = state.listeners.get(instrumentKey) || 0;

      if (currentCount > 0) {
        const newCount = currentCount - 1;

        if (newCount === 0) {
          // Last listener for this instrument in this mode
          state.listeners.delete(instrumentKey);
          this.pendingUnsubscriptions.add(instrumentKey);
          removedFromAnyMode = true;
        } else {
          state.listeners.set(instrumentKey, newCount);
        }
      }
    });

    // Process unsubscriptions if necessary and we're connected
    if (removedFromAnyMode && this.isConnected) {
      this.processPendingUnsubscriptions();

      // Remove from accumulated feeds if no longer subscribed
      if (this._feeds[instrumentKey]) {
        const updatedFeeds = { ...this._feeds };
        delete updatedFeeds[instrumentKey];
        this._feeds = updatedFeeds;

        // Emit the updated feeds
        this.emit(this.Event.MESSAGE, { feeds: this._feeds });
      }
    }
  }

  private processPendingSubscriptions() {
    let hasProcessed = false;

    for (const [mode, instruments] of this.pendingSubscriptions.entries()) {
      if (instruments.size > 0) {
        const instrumentsArray = Array.from(instruments);
        this.feeder?.subscribe(instrumentsArray, mode);
        this.subscriptionState[mode].isSubscribed = true;
        instruments.clear();
        hasProcessed = true;
      }
    }

    return hasProcessed;
  }

  private processPendingUnsubscriptions() {
    if (this.pendingUnsubscriptions.size > 0) {
      const instrumentsToUnsubscribe = Array.from(this.pendingUnsubscriptions);
      this.feeder?.unsubscribe(instrumentsToUnsubscribe);
      this.pendingUnsubscriptions.clear();
      return true;
    }
    return false;
  }

  /**
   * Subscribe to market data for the given instrument keys
   * @param instrumentKeys Array of instrument keys to subscribe to
   * @param mode The subscription mode (ltpc, full, option_greeks)
   */
  public subscribe(instrumentKeys: string[], mode: ModeCode) {
    instrumentKeys.forEach((key) => this.addSubscription(key, mode));
    return this; // For method chaining
  }

  /**
   * Unsubscribe from market data for the given instrument keys
   * @param instrumentKeys Array of instrument keys to unsubscribe from
   */
  public unsubscribe(instrumentKeys: string[]) {
    instrumentKeys.forEach((key) => this.removeSubscription(key));
    return this; // For method chaining
  }

  /**
   * Change the subscription mode for the given instrument keys
   * @param instrumentKeys Array of instrument keys to change mode for
   * @param newMode The new subscription mode
   */
  public changeMode(instrumentKeys: string[], newMode: ModeCode) {
    // First remove the subscriptions from any existing modes
    instrumentKeys.forEach((key) => this.removeSubscription(key));

    // Then add them to the new mode
    instrumentKeys.forEach((key) => this.addSubscription(key, newMode));

    this._mode = newMode;
    return this; // For method chaining
  }

  /**
   * Clear all subscriptions
   */
  public clearSubscriptions() {
    // Reset all subscription state
    Object.values(this.subscriptionState).forEach((state) => {
      state.isSubscribed = false;
      state.listeners.clear();
    });

    // Clear all pending operations
    Object.values(Mode).forEach((mode) => {
      this.pendingSubscriptions.get(mode as ModeCode)?.clear();
    });
    this.pendingUnsubscriptions.clear();

    return this; // For method chaining
  }

  /**
   * Get the current feed data for all subscribed instruments
   */
  public get feeds(): Record<string, IFeed> {
    return { ...this._feeds };
  }

  /**
   * Check if there are any pending subscription operations
   */
  private get hasPendingOperations(): boolean {
    for (const instruments of this.pendingSubscriptions.values()) {
      if (instruments.size > 0) return true;
    }
    return this.pendingUnsubscriptions.size > 0;
  }

  /**
   * Check if the WebSocket connection is established and ready
   */
  private get isConnected(): boolean {
    return (
      !this._isConnecting &&
      this.feeder?.ws !== null &&
      this.feeder.ws.readyState === WebSocket.OPEN
    );
  }

  /**
   * Get the current mode
   */
  public get mode(): ModeCode {
    return this._mode;
  }

  /**
   * Get the market data feeder instance
   */
  public get feeder(): MarketDataFeeder {
    return this._marketFeeder;
  }

  /**
   * Get the connection URL
   */
  public get url(): string {
    return this._url!;
  }

  /**
   * Get a snapshot of the current subscription state
   * Useful for debugging or status reporting
   */
  public getSubscriptionStatus(): Record<
    ModeCode,
    {
      isSubscribed: boolean;
      instrumentCount: number;
      instruments: string[];
    }
  > {
    const status: Record<string, {
      isSubscribed: boolean;
      instrumentCount: number;
      instruments: string[];
    }> = {};

    Object.entries(this.subscriptionState).forEach(([mode, state]) => {
      status[mode as ModeCode] = {
        isSubscribed: state.isSubscribed,
        instrumentCount: state.listeners.size,
        instruments: Array.from(state.listeners.keys()),
      };
    });

    return status;
  }
}
