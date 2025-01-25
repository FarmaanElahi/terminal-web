import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import { ApiClient } from "upstox-js-sdk";

export const queryClient = new QueryClient();
export const webClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const supabase = createClient();
export const upstox = ApiClient.instance;
