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
  let token: string;
  try {
    token = decrypt(integration?.data.access_token);
  } catch (e) {
    console.error("Failed to decreypt token", e);
    throw new Error("Unable to decrypt token");
  }

  const wsApi = new WebsocketApi();
  if (wsApi.apiClient) {
    wsApi.apiClient.authentications.OAUTH2.accessToken = token;
  }
  const response = await new Promise((resolve, reject) => {
    wsApi.getMarketDataFeedAuthorize("v2", (err, data1) =>
      err ? reject(err) : resolve(data1),
    );
  }).catch((reason) => {
    console.error("Failed to get feed url", reason, token);
    throw new Error("Failed to get feed url");
  });
  // eslint-disable-next-line
  // @ts-ignore
  return response.data.authorizedRedirectUri;
}
