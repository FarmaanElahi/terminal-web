import { NextRequest, NextResponse } from "next/server";
import { TokenResponse } from "@/types/upstox";
import { createClient } from "@/utils/supabase/server";
import { encrypt } from "@/utils/encryption";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TokenResponse;
  console.log("Token received: ", body);

  const client = await createClient();
  const encryptedToken = encrypt(body.access_token);
  const { error } = await client
    .from("user_integrations")
    .upsert({ id: 1, type: "upstox", access_token: encryptedToken });
  if (error) {
    console.error("Failed to update the token");
  } else {
    console.log("Upstox token refresh");
  }

  return NextResponse.json({ status: "ok" });
}
