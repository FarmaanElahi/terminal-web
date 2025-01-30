import { QueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { ApiClient } from "upstox-js-sdk";

export const queryClient = new QueryClient();
export const supabase = createClient();

export function refreshUpstoxToken(token: string) {
  ApiClient.instance.authentications.OAUTH2.accessToken = token;
}
