import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

export const queryClient = new QueryClient();
export const webClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const client = createClient();
