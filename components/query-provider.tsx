"use client";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Query client init");
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
