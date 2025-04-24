import { redirect } from "next/navigation";
import { kiteGenerateSession, kiteLoginUrl } from "@/utils/kite/client";
import { saveIntegration } from "@/server/integration";
import { cookies } from "next/headers";

interface SearchParams {
  request_token?: string;
  checksum?: string;
  action?: string;
  status?: "success";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const c = await cookies();
  c.get("check");

  const { request_token, action } = await searchParams;
  // This is a login initiate request
  if (action !== "login" && !request_token) {
    redirect(kiteLoginUrl());
  }

  if (request_token) {
    const session = await kiteGenerateSession(request_token);
    await saveIntegration("kite", session.access_token, {
      id: session.user_id,
      profile: session,
    });
    redirect("/integration");
  }

  // Verify the token
  return <h1>Invalid Request</h1>;
}
