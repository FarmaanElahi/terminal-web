"use server";

import axios from "axios";
import type { StockTwitFeed } from "@/types/stocktwits";

const DEFAULT_HEADERS = {
  accept: "application/json",
  origin: "https://stocktwits.com",
  referer: "https://stocktwits.com/",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

export async function fetchStockTwit(
  symbol: string | "trending" | "suggested",
  params?: { filter: "top"; limit?: number },
) {
  const url = `https://api.stocktwits.com/api/2/streams/${toSymbol(symbol)}.json`;
  return await axios
    .get<StockTwitFeed>(url, {
      params,
      headers: DEFAULT_HEADERS,
    })
    .then((r) => r.data);
}

function toSymbol(symbol: string) {
  if (["trending", "suggested"].includes(symbol)) return symbol;

  const parts = symbol.split(":");
  const s =
    parts.length === 1
      ? [parts[0], "NSE"].join(".")
      : parts.reverse().join(".");

  return ["symbol", s].join("/");
}
