import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();
export const webClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
