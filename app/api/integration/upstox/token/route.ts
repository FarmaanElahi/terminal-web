import { NextRequest, NextResponse } from "next/server";
import { TokenResponse } from "@/types/upstox";
import { saveIntegration } from "@/server/integration";
import { UpstoxClient } from "@/utils/upstox/client";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TokenResponse;
  console.log("Token received: ", body);
  const profile = await new UpstoxClient(body.access_token).profile();
  await saveIntegration("upstox", body.access_token, {
    id: profile.data.user_id,
    profile: profile.data as unknown as Record<string, unknown>,
  });
  return NextResponse.json({ status: "ok" });
}
