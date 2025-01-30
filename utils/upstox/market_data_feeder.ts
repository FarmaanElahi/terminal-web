import {
  ApiClient,
  WebsocketApi,
  WebsocketAuthRedirectResponse,
} from "upstox-js-sdk";
import Feeder from "./feeder";
import * as MarketV3Proto from "@/utils/upstox/market_v3";
import { v4 as uuidv4 } from "uuid";

const FeedResponse =
  MarketV3Proto.com.upstox.marketdatafeeder.rpc.proto.FeedResponse;

export const Mode = Object.freeze({
  LTPC: "ltpc",
  FULL: "full",
  OPTION: "option_greeks",
});

export type ModeCode = (typeof Mode)[keyof typeof Mode];

const Method = Object.freeze({
  SUBSCRIBE: "sub",
  CHANGE_METHOD: "change_mode",
  UNSUBSCRIBE: "unsub",
});
type MethodCode = (typeof Method)[keyof typeof Method];

export class MarketDataFeeder extends Feeder {
  ws: WebSocket | null = null;
  userClosedWebSocket = false;
  closingCode = -1;
  private readonly apiClient = ApiClient.instance;
  private readonly wsApi = new WebsocketApi();
  private queued: Array<Buffer<ArrayBuffer>> = [];

  constructor(
    private instrumentKeys: string[] = [],
    private mode: ModeCode = "full",
  ) {
    super();
  }

  async connect() {
    // Skip if its already connected
    if (
      this.ws &&
      (this.ws.readyState == WebSocket.CONNECTING ||
        this.ws.readyState == WebSocket.OPEN)
    )
      return;

    this.ws = await this.connectWebSocket();
    this.onOpen();
    this.onMessage();
    this.onClose();
    this.onError();
  }

  shouldReconnect() {
    return (
      this.ws === null ||
      (!this.userClosedWebSocket && this.ws.readyState !== WebSocket.OPEN)
    );
  }

  onOpen() {
    this.ws?.addEventListener("open", () => {
      this.emit("open");
      this.sendQueued();
    });
  }

  private sendQueued() {
    while (this.queued.length !== 0) {
      const q = this.queued.shift();
      if (q) this.ws?.send(q);
    }
  }

  onMessage() {
    this.ws?.addEventListener("message", async (ev) => {
      const decodedData = await this.decodeProtobuf(ev.data);
      this.emit("data", decodedData);
    });
  }

  onClose() {
    this.ws?.addEventListener("close", (ev) => {
      this.closingCode = ev.code;
      if (ev.code === 1000) {
        this.userClosedWebSocket = true;
      }
    });
  }

  onError() {
    this.ws?.addEventListener("error", (ev) => {
      this.emit("error", ev);
    });
  }

  disconnect() {
    this.ws?.close(1000);
    this.queued = [];
  }

  subscribe(instrumentKeys: string[], mode: ModeCode) {
    const req = this.buildRequest(instrumentKeys, Method.SUBSCRIBE, mode);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(req);
    } else {
      this.queued.push(req);
    }
  }

  unsubscribe(instrumentKeys: string[]) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(this.buildRequest(instrumentKeys, Method.UNSUBSCRIBE));
    }
  }

  changeMode(instrumentKeys: string[], newMode: ModeCode) {
    const req = this.buildRequest(instrumentKeys, Method.SUBSCRIBE, newMode);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(req);
    } else {
      this.queued.push(req);
    }
  }

  // Function to establish WebSocket connection
  async connectWebSocket() {
    const response = await new Promise<WebsocketAuthRedirectResponse>(
      (resolve, reject) => {
        this.wsApi.getMarketDataFeedAuthorize("v2", (err, data1) =>
          err ? reject(err) : resolve(data1),
        );
      },
    );
    // eslint-disable-next-line
    // @ts-ignore
    const url = response.data.authorizedRedirectUri;
    if (!url) {
      console.error("Not authorized redirect_uri");
      return null;
    }
    return new WebSocket(url);
  }

  // Function to decode protobuf message
  async decodeProtobuf(blob: unknown) {
    const arrayBuffer = await blobToArrayBuffer(blob);
    const buffer = Buffer.from(arrayBuffer);
    return FeedResponse.decode(buffer);
  }

  buildRequest(instrumentKeys: string[], method: MethodCode, mode?: ModeCode) {
    const requestObj = {
      guid: uuidv4(),
      method,
      data: {
        instrumentKeys,
      },
    };

    // Only add 'mode' to 'data' if it is not undefined
    if (mode !== undefined) {
      (requestObj.data as unknown as Record<string, unknown>).mode = mode;
    }

    return Buffer.from(JSON.stringify(requestObj));
  }
}

// Helper functions for handling Blob and ArrayBuffer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blobToArrayBuffer = async (blob: any): Promise<Uint8Array> => {
  if ("arrayBuffer" in blob) return (await blob.arrayBuffer()) as Uint8Array;
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as unknown as Uint8Array);
    reader.onerror = () => reject();
    reader.readAsArrayBuffer(blob);
  });
};
