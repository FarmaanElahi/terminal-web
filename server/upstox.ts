"use server";

import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/encryption";
import { WebsocketApi } from "upstox-js-sdk";

export async function getUpstoxMarketFeedUrl(): Promise<string> {
  const client = await createClient();
  const integration = await client
    .from("user_integrations")
    .select("access_token")
    .eq("type", "upstox")
    .maybeSingle();

  if (!integration?.data?.access_token) {
    throw new Error("No upstox found token");
  }
  // Decrypt the token
  const token = decrypt(integration?.data.access_token);

  const wsApi = new WebsocketApi();
  if (wsApi.apiClient) {
    wsApi.apiClient.authentications.OAUTH2.accessToken = token;
  }
  const response = await new Promise((resolve, reject) => {
    wsApi.getMarketDataFeedAuthorize("v2", (err, data1) =>
      err ? reject(err) : resolve(data1),
    );
  });
  // eslint-disable-next-line
  // @ts-ignore
  return response.data.authorizedRedirectUri;
}
