interface UpstoxAPIResponse<T> {
  status: "success" | "error";
  data: T;
}

interface HistoricalCandleData {
  candles: [string, number, number, number, number, number, number][];
}

interface IntraDayCandleData {
  candles: [string, number, number, number, number, number, number][];
}

interface WebsocketAuthRedirectResponseData {
  authorizedRedirectUri: string;
}

interface GetTokenData {
  access_token: string;
}

interface ProfileData {
  email: string;
  user_name: string;
  user_id: string;
  broker: string;
}

export interface FullMarketQuote {
  status: string;
  data: Record<string, MarketQuote>;
}

export interface MarketQuote {
  ohlc: Ohlc;
  depth: Depth;
  timestamp: string;
  instrument_token: string;
  symbol: string;
  last_price: number;
  volume: number;
  average_price: number;
  oi: number;
  net_change: number;
  total_buy_quantity: number;
  total_sell_quantity: number;
  lower_circuit_limit: number;
  upper_circuit_limit: number;
  last_trade_time: string;
  oi_day_high: number;
  oi_day_low: number;
}

export interface Ohlc {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Depth {
  buy: Buy[];
  sell: Sell[];
}

export interface Buy {
  quantity: number;
  price: number;
  orders: number;
}

export interface Sell {
  quantity: number;
  price: number;
  orders: number;
}

export class UpstoxClient {
  private readonly headers = new Headers();
  private static readonly clientId = process.env
    .NEXT_UPSTOX_CLIENT_ID as string;
  private static readonly clientSecret = process.env
    .NEXT_UPSTOX_CLIENT_SECRET as string;
  private static readonly redirectUri = process.env
    .NEXT_UPSTOX_REDIRECT_URI as string;

  constructor(private readonly access_token?: string) {
    if (access_token) {
      this.headers.append("Authorization", `Bearer ${this.access_token}`);
    }
  }

  async getIntraDayCandleData(options: {
    instrumentKey: string;
    interval: string;
  }): Promise<UpstoxAPIResponse<IntraDayCandleData>> {
    const r = await fetch(
      `https://api.upstox.com/v2/historical-candle/intraday/${options.instrumentKey}/${options.interval}`,
    );
    return await r.json();
  }

  async getHistoricalCandleData(options: {
    instrumentKey: string;
    interval: string;
    toDate: string;
    fromDate?: string;
  }): Promise<UpstoxAPIResponse<HistoricalCandleData>> {
    return fetch(
      `https://api.upstox.com/v2/historical-candle/${options.instrumentKey}/${options.interval}/${options.toDate}/${options.fromDate}`,
    ).then((r) => r.json());
  }

  async profile(): Promise<UpstoxAPIResponse<ProfileData>> {
    return fetch("https://api.upstox.com/v2/user/profile", {
      headers: this.headers,
    }).then((r) => r.json());
  }

  async marketDataWebsocketUrl(): Promise<
    UpstoxAPIResponse<WebsocketAuthRedirectResponseData>
  > {
    return fetch("https://api.upstox.com/v2/feed/market-data-feed/authorize", {
      headers: this.headers,
    }).then((r) => r.json());
  }

  async fullMarketQuotes(instrumentKey: string[]) {
    return fetch(
      "https://api.upstox.com/v2/market-quote/quotes?instrument_key=" +
        instrumentKey.join(","),
      { headers: this.headers },
    ).then((r) => r.json() as Promise<FullMarketQuote>);
  }

  public static loginUrl() {
    // Code will only run on the server
    const state = [...Array(20)]
      .map(() => Math.random().toString(36).substring(2, 7))
      .join(" ");

    const url = new URL("https://api.upstox.com/v2/login/authorization/dialog");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", UpstoxClient.clientId);
    url.searchParams.set("redirect_uri", UpstoxClient.redirectUri);
    url.searchParams.set("state", state);

    return { url: url.toString(), state };
  }

  public static async getToken(code: string) {
    const response = await fetch(
      "https://api.upstox.com/v2/login/authorization/token",
      {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: UpstoxClient.clientId,
          client_secret: UpstoxClient.clientSecret,
          redirect_uri: UpstoxClient.redirectUri,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      },
    ).then((r) => r.json() as Promise<GetTokenData>);
    return response.access_token;
  }
}
