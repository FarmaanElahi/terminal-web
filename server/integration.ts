import { createClient } from "@/utils/supabase/server";
import { decrypt, encrypt } from "@/utils/encryption";
import { kiteProfile } from "@/utils/kite/client";
import { Json } from "@/types/generated/supabase";
import { UpstoxClient } from "@/utils/upstox/client";

export type Integrations = "upstox" | "kite";

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

export async function getAllLiveIntegration() {
  const client = await createClient();
  const integration = await client.from("user_integrations").select();
  const statusPromise =
    integration.data?.map(async (value) => {
      const type = value.type as Integrations;
      const token = value.access_token;
      return await checkIntegrationStatus(type, token ? decrypt(token) : null);
    }) ?? [];

  return Promise.all(statusPromise);
}

async function checkIntegrationStatus(
  type: Integrations,
  access_token: string | null,
) {
  {
    if (!access_token) {
      return { type, active: false, name: "" };
    }

    try {
      if (type === "kite") {
        const profile = await kiteProfile(access_token);
        return {
          type,
          active: true,
          name: profile.user_name,
          integrationName: "Kite Zerodha",
        };
      }

      if (type === "upstox") {
        const profile = await new UpstoxClient(access_token).profile();
        return {
          type,
          active: true,
          name: profile.data.user_name,
          integrationName: "Upstox",
        };
      }
      throw new Error("Invalid Integration");
    } catch {
      return { type, active: false, name: "" };
    }
  }
}
