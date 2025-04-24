import { saveIntegration } from "@/server/integration";
import { UpstoxClient } from "@/utils/upstox/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const c = await cookies();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // This is a login initiate request
  if (!code || !state) {
    const { url, state } = UpstoxClient.loginUrl();
    c.set("login_state", state);
    return NextResponse.redirect(url);
  }

  const cookie_state = c.get("login_state");
  if (!cookie_state) {
    return NextResponse.json({ status: "Invalid state" }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ status: "Invalid code" }, { status: 400 });
  }

  const token = await UpstoxClient.getToken(code);
  const profile = await new UpstoxClient(token).profile();
  await saveIntegration("upstox", token, {
    id: profile.data.userId,
    profile: profile.data as unknown as Record<string, unknown>,
  });

  return NextResponse.redirect(new URL("/integration", request.url));
}
