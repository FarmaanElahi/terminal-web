import { EventEmitter } from "eventemitter3";

/**
 * Interface representing a data feeder.
 * Implementations should provide functionality for connecting to a data source,
 * handling connection events, and streaming data.
 */
export default abstract class Feeder extends EventEmitter {
  protected constructor() {
    super();
  }

  /**
   * Establishes a connection to the data source.
   */
  abstract connect(url: string): Promise<void>;

  /**
   * Determines if a reconnection is necessary.
   */
  abstract shouldReconnect(): boolean;

  /**
   * Handles incoming messages from the WebSocket connection.
   */
  abstract onMessage(): void;

  /**
   * Handles the closing of the WebSocket connection.
   */
  abstract onClose(): void;

  /**
   * Handles errors from the WebSocket connection.
   */
  abstract onError(): void;

  /**
   * Disconnects from the data source.
   */
  abstract disconnect(): void;

  abstract clearSubscriptions(): void;
}
