import { kiteGenerateSession, kiteLoginUrl } from "@/utils/kite/client";
import { saveIntegration } from "@/server/integration";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const request_token = url.searchParams.get("request_token");
  const action = url.searchParams.get("action");
  // This is a login initiate request
  if (action !== "login" && !request_token) {
    return NextResponse.redirect(kiteLoginUrl());
  }

  if (request_token) {
    const session = await kiteGenerateSession(request_token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access_token, public_token, refresh_token, ...profile } = session;
    await saveIntegration("kite", session.access_token, {
      id: session.user_id,
      profile,
    });

    return NextResponse.redirect(new URL("/integration", request.url));
  }
  return NextResponse.json({ status: "failed" }, { status: 400 });
}
