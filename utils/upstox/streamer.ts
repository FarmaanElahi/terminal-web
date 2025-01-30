import { EventEmitter } from "eventemitter3";
import Feeder from "@/utils/upstox/feeder";

/**
 * Interface for classes that manage a WebSocket connection.
 */
export abstract class Streamer extends EventEmitter {
  Event = Object.freeze({
    OPEN: "open",
    CLOSE: "close",
    MESSAGE: "message",
    ERROR: "error",
    RECONNECTING: "reconnecting",
    AUTO_RECONNECT_STOPPED: "autoReconnectStopped",
  });

  private enableAutoReconnect = true;
  private interval = 1;
  private retryCount: number = 5;
  // Timeout Id
  private reconnectInterval?: number;
  private reconnectOpenListener?: () => void;
  private reconnectCloseListener?: () => void;

  protected constructor() {
    super();
    this.prepareAutoReconnect();
    if (new.target === Streamer) {
      throw new TypeError("Cannot construct Streamer instances directly");
    }
  }

  setupEventListeners() {
    this.feeder.on("open", () => this.emit(this.Event.OPEN));
    this.feeder.on("data", (data) => {
      this.emit(this.Event.MESSAGE, data);
    });
    this.feeder.on("error", (error) => this.emit(this.Event.ERROR, error));
    this.feeder.on("close", () => this.emit(this.Event.CLOSE));
  }

  prepareAutoReconnect() {
    let counter = 0;

    const attemptReconnect = async () => {
      if (!this.enableAutoReconnect) {
        clearInterval(this.reconnectInterval);
        return;
      }

      if (this.feeder.shouldReconnect()) {
        this.emit(
          this.Event.RECONNECTING,
          `Auto reconnect attempt ${counter + 1}/${this.retryCount}`,
        );
        await this.connect();
        counter++;
      }

      if (counter >= this.retryCount) {
        clearInterval(this.reconnectInterval);
        this.feeder.clearSubscriptions();
        this.emit(
          this.Event.AUTO_RECONNECT_STOPPED,
          `retryCount of ${this.retryCount} exhausted.`,
        );
        return;
      }
    };

    // Remove existing listeners if they exist
    if (this.reconnectOpenListener) {
      this.removeListener("open", this.reconnectOpenListener);
    }
    if (this.reconnectCloseListener) {
      this.removeListener("close", this.reconnectCloseListener);
    }

    // Define new listeners
    this.reconnectOpenListener = () => {
      clearInterval(this.reconnectInterval);
      counter = 0;
    };
    this.reconnectCloseListener = () => {
      this.reconnectInterval = setInterval(
        attemptReconnect,
        this.interval * 1000,
      ) as unknown as number;
    };

    // Attach the new listeners
    this.on("open", this.reconnectOpenListener);
    this.on("close", this.reconnectCloseListener);
  }

  autoReconnect(enable: boolean, interval = 1, retryCount = 5) {
    this.enableAutoReconnect = enable;
    this.interval = interval;
    this.retryCount = retryCount;

    if (!enable) {
      this.emit(this.Event.AUTO_RECONNECT_STOPPED, "Stopped by client.");
      return;
    }

    this.prepareAutoReconnect();
  }

  abstract connect(): Promise<void>;

  abstract get feeder(): Feeder;
}
