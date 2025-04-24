import { createClient } from "@/utils/supabase/server";
import { decrypt, encrypt } from "@/utils/encryption";
import { kiteProfile } from "@/utils/kite/client";
import { Json } from "@/types/generated/supabase";
import { UpstoxClient } from "@/utils/upstox/client";

export type Integrations = "upstox" | "kite";

export interface TradingAccount {
  type: Integrations;
  active: boolean;
  name: string;
  token?: string;
  broker: string;
}

export async function saveIntegration(
  type: Integrations,
  access_token: string,
  provider: { id: string; profile: Record<string, unknown> },
) {
  const client = await createClient();
  const encryptedToken = encrypt(access_token);
  const { error } = await client.from("user_integrations").upsert({
    type,
    access_token: encryptedToken,
    provider_id: provider.id,
    provider_profile: (provider.profile ?? {}) as Json,
  });
  if (error) {
    return new Error(`Failed to save integration for ${type}`);
  }
}

export async function getAllTradingAccounts() {
  const client = await createClient();
  const integration = await client.from("user_integrations").select();
  const statusPromise =
    integration.data?.map(async (value) => {
      const type = value.type as Integrations;
      const token = value.access_token;
      return await getTradingAccount(type, token ? decrypt(token) : null);
    }) ?? [];

  return Promise.all(statusPromise);
}

async function getTradingAccount(
  type: Integrations,
  access_token: string | null,
): Promise<TradingAccount> {
  {
    if (!access_token) {
      return { type, active: false, name: "", broker: "" };
    }

    try {
      if (type === "kite") {
        const profile = await kiteProfile(access_token);
        return {
          type,
          active: true,
          name: profile.user_name,
          broker: profile.broker,
          token: access_token,
        };
      }

      if (type === "upstox") {
        const profile = await new UpstoxClient(access_token).profile();
        return {
          type,
          active: true,
          name: profile.data.user_name,
          broker: profile.data.broker,
          token: access_token,
        };
      }
      throw new Error("Invalid Integration");
    } catch {
      return { type, active: false, name: "", broker: "" };
    }
  }
}
