"use client";

import { TradingAccount } from "@/server/integration";
import { createContext, ReactNode, useContext } from "react";

interface AppInfo {
  tradingAccounts: TradingAccount[];
}

const AppInfoContext = createContext<AppInfo | null>(null);

export function AppInfoProvider({
  children,
  ...rest
}: { children: ReactNode } & AppInfo) {
  return (
    <AppInfoContext.Provider value={rest}>{children}</AppInfoContext.Provider>
  );
}

export function useAppInfo() {
  const context = useContext(AppInfoContext);
  if (!context) {
    throw new Error("useAppInfo must be used within a AppInfoProvider");
  }
  return context;
}
