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

interface ProfileData {
  email: string;
  name: string;
  userId: string;
}

export class UpstoxClient {
  private readonly headers = new Headers();

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
}
