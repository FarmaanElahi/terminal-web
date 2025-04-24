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
}

type OnComplete<RES> = (error: unknown | undefined, data: RES) => void;

declare module "upstox-js-sdk" {
  declare class ApiClient {
    static instance: ApiClient;
    authentications: Record<"OAUTH2", { accessToken: string }>;

    callApi<T>(
      path: string,
      httpMethod: string,
      pathParams: Record<string, unknown>,
      queryParams: Record<string, unknown>,
      headerParams: Record<string, unknown>,
      formParams: Record<string, unknown>,
      bodyParam: Record<string, unknown> | null,
      authNames: string[],
      contentTypes: string[],
      accepts: string[],
      returnType: T,
      cb: (err: unknown, data: T, response: unknown) => void
    );
  }

  declare class WebsocketAuthRedirectResponse
    implements UpstoxAPIResponse<WebsocketAuthRedirectResponseData> {
  }

  declare class WebsocketApi {
    readonly apiClient: ApiClient;

    constructor(apiClient?: ApiClient);

    getMarketDataFeedAuthorizeV3(
      onComplete: OnComplete<WebsocketAuthRedirectResponse>
    );

    getMarketDataFeedAuthorize(
      apiVersion: "v2" | "v3",
      onComplete: OnComplete<WebsocketAuthRedirectResponse>
    );
  }

  declare class GetProfileResponse
    implements UpstoxAPIResponse<ProfileData> {
  }

  declare class UserApi {
    readonly apiClient: ApiClient;

    constructor(apiClient?: ApiClient)

    getProfile(apiVersion: "v2", onComplete: OnComplete<GetProfileResponse>)
  }

  declare class HistoryApi {
    readonly apiClient: ApiClient;

    constructor(apiClient?: ApiClient);

    getHistoricalCandleData1(
      instrumentKey: string,
      interval: string,
      toDate: string,
      fromDate: string,
      apiVersion: string,
      onComplete: OnComplete<GetHistoricalCandleResponse>
    );

    getIntraDayCandleData(
      instrumentKey: string,
      interval: str,
      apiVersion: string,
      onComplete: OnComplete<GetIntraDayCandleResponse>
    );
  }

  export type GetHistoricalCandleResponse =
    UpstoxAPIResponse<HistoricalCandleData>;
  export type GetIntraDayCandleResponse = UpstoxAPIResponse<IntraDayCandleData>;

  export type GetIntraDayCandleResponse = UpstoxAPIResponse<IntraDayCandleData>;
}
