import { EventEmitter } from "eventemitter3";

interface ScreenerSubscribeRequest {
  t: "SCREENER_SUBSCRIBE";
  session_id: string;
  query?: string;
}

interface ScreenerPatchRequest {
  t: "SCREENER_PATCH";
  session_id: string;
  filters?: Array<unknown>;
  sort?: Array<unknown>;
  columns?: string[];
  range?: [number, number];
}

interface ScreenerUnSubscribeRequest {
  t: "SCREENER_UNSUBSCRIBE";
  session_id: string;
}

export type RealtimeRequest =
  | ScreenerSubscribeRequest
  | ScreenerUnSubscribeRequest
  | ScreenerPatchRequest;

interface ScreenerSubscribedResponse {
  t: "SCREENER_SUBSCRIBED";
  session_id: string;
}

interface ScreenerPatchedResponse {
  t: "SCREENER_PATCHED";
  session_id: string;
}

interface ScreenerFullResponse {
  t: "SCREENER_FULL_RESPONSE";
  session_id: string;
  c: string[];
  d: Array<Array<string | number | boolean>>;
  total: number;
  range: [number, number];
}

interface ScreenerPartialResponse {
  t: "SCREENER_PARTIAL_RESPONSE";
  session_id: string;
  d: Record<string, unknown>[];
}

interface ScreenerMetaUpdate {
  t: "SCREENER_META_UPDATE";
  session_id: string;
  total: number;
  filtered: number;
}

export type RealtimeResponse =
  | ScreenerSubscribedResponse
  | ScreenerPatchedResponse
  | ScreenerFullResponse
  | ScreenerMetaUpdate
  | ScreenerPartialResponse;

// Define the type mapping for event names to their respective response types
export type EventTypeMap = {
  SCREENER_SUBSCRIBED: ScreenerSubscribedResponse;
  SCREENER_PATCHED: ScreenerPatchedResponse;
  SCREENER_META_UPDATE: ScreenerMetaUpdate;
  SCREENER_FULL_RESPONSE: ScreenerFullResponse;
  SCREENER_PARTIAL_RESPONSE: ScreenerPartialResponse;
};

export class RealtimeConnection {
  private socket?: WebSocket;
  private readonly ee: EventEmitter = new EventEmitter();
  private readonly messageQueue: Array<RealtimeRequest> = [];
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private readonly reconnectDelay: number = 1000;

  constructor(private readonly url: string) {}

  connect() {
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING ||
      this.isConnecting
    ) {
      return;
    }

    this.isConnecting = true;
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("open", () => this.onOpen());
    this.socket.addEventListener("error", (ev) => this.onError(ev));
    this.socket.addEventListener("close", (ev) => this.onClose(ev));
    this.socket.addEventListener("message", (ev) => this.onMessage(ev));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
      this.reconnectAttempts = 0;
    }
  }

  private onOpen() {
    console.log("Connected to realtime server");
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.flushMessages();
  }

  private onError(ev: Event) {
    console.error("WebSocket error:", ev);
    this.isConnecting = false;
  }

  private onClose(ev: CloseEvent) {
    console.log(`WebSocket closed: ${ev.code} ${ev.reason}`);
    this.isConnecting = false;
    this.socket = undefined;

    // Attempt reconnection if not explicitly disconnected
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => this.connect(), delay);
    } else {
      console.error(
        "Max reconnection attempts reached. Please reconnect manually.",
      );
    }
  }

  private onMessage(ev: MessageEvent) {
    try {
      const data = JSON.parse(ev.data) as RealtimeResponse;
      if (data && data.t) {
        this.ee.emit(data.t, data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  sendMessage(request: RealtimeRequest) {
    this.messageQueue.push(request);
    setTimeout(() => this.flushMessages());

    // Auto-connect if not connected
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.connect();
    }
  }

  private flushMessages() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          this.socket.send(JSON.stringify(message));
        }
      }
    }
  }

  // Type-safe event listeners
  on<K extends keyof EventTypeMap>(
    eventName: K,
    callback: (event: EventTypeMap[K]) => void,
  ): void {
    this.ee.on(eventName, callback);
  }

  off<K extends keyof EventTypeMap>(
    eventName: K,
    callback: (event: EventTypeMap[K]) => void,
  ): void {
    this.ee.off(eventName, callback);
  }

  once<K extends keyof EventTypeMap>(
    eventName: K,
    callback: (event: EventTypeMap[K]) => void,
  ): void {
    this.ee.once(eventName, callback);
  }

  waitFor<K extends keyof EventTypeMap>(
    eventName: K,
    filter: (event: EventTypeMap[K]) => boolean,
  ): Promise<EventTypeMap[K]> {
    return new Promise((resolve) => {
      const eventCallback = (value: EventTypeMap[K]) => {
        if (filter(value)) {
          this.ee.off(eventName, eventCallback);
          resolve(value);
        }
      };
      this.ee.on(eventName, eventCallback);
    });
  }
}
