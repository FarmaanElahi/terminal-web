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

interface GlobalFeedParam {
  feed: "trending" | "suggested" | "popular";
  limit: number;
}

interface SymbolFeedParam {
  feed: "symbol";
  filter: "trending" | "popular";
  symbol: string;
  limit: number;
}

type Param = GlobalFeedParam | SymbolFeedParam;

export async function fetchStockTwit(params: Param) {
  const { url, q } = toRequestParam(params);
  return await axios
    .get<StockTwitFeed>(url, {
      params: q,
      headers: DEFAULT_HEADERS,
    })
    .then((r) => r.data);
}

function toRequestParam(params: Param) {
  if (params.feed === "symbol") {
    const { symbol } = params;
    const parts = symbol.split(":");
    const stockTwitSymbol =
      parts.length === 1
        ? [parts[0], "NSE"].join(".")
        : parts.reverse().join(".");

    if (params.filter === "trending") {
      const url = `https://api.stocktwits.com/api/2/streams/symbol/${stockTwitSymbol}.json`;
      const q = {
        filter: "all",
        limit: params.limit,
      };
      return { url, q };
    }

    const url = `https://api.stocktwits.com/api/2/trending_messages/symbol/${stockTwitSymbol}.json`;
    const q = {
      filter: "top",
      limit: params.limit,
    };
    return { url, q };
  }

  if (params.feed === "suggested") {
    const url = "https://api.stocktwits.com/api/2/streams/suggested.json";
    const q = {
      filter: "top",
      limit: params.limit,
    };
    return { url, q };
  }

  if (params.feed === "trending") {
    const url = "https://api.stocktwits.com/api/2/streams/trending.json";
    const q = {
      filter: "all",
      limit: params.limit,
    };
    return { url, q };
  }
  if (params.feed === "popular") {
    const url =
      "https://api.stocktwits.com/api/2/trending_messages/symbol_trending";
    const q = {
      filter: "all",
      limit: params.limit,
    };
    return { url, q };
  }
  console.error("Invalid feed param", params);
  throw new Error("Invalid feed param " + params.feed);
}
