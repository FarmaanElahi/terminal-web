import { NextRequest, NextResponse } from "next/server";
import { TokenResponse } from "@/types/upstox";
import { saveIntegration } from "@/server/integration";
import { upstoxProfile } from "@/utils/upstox/upstox_utils";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TokenResponse;
  console.log("Token received: ", body);
  const profile = await upstoxProfile(body.access_token);
  await saveIntegration("upstox", body.access_token, {
    id: profile.userId as string,
    profile: profile,
  });
  return NextResponse.json({ status: "ok" });
}
