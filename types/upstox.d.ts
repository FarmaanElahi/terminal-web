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

type OnComplete<RES> = (error: unknown | undefined, data: RES) => void;

declare module "upstox-js-sdk" {
  declare class ApiClient {
    static instance: ApiClient;
  }

  declare class HistoryApi {
    constructor(client: ApiClient);

    getHistoricalCandleData1(
      instrumentKey: string,
      interval: string,
      toDate: string,
      fromDate: string,
      apiVersion: string,
      onComplete: OnComplete<GetHistoricalCandleResponse>,
    );

    getIntraDayCandleData(
      instrumentKey: string,
      interval: str,
      apiVersion: string,
      onComplete: OnComplete<GetIntraDayCandleResponse>,
    );
  }

  export type GetHistoricalCandleResponse =
    UpstoxAPIResponse<HistoricalCandleData>;
  export type GetIntraDayCandleResponse = UpstoxAPIResponse<IntraDayCandleData>;
}
