"use client";

import { useQuery } from "@tanstack/react-query";
import { queryClient, supabase, upstox } from "@/lib/state/supabase";
import { DateTime, FixedOffsetZone } from "luxon";
import {
  GetHistoricalCandleResponse,
  GetIntraDayCandleResponse,
  HistoryApi,
} from "upstox-js-sdk";
import { LibrarySymbolInfo } from "@/components/chart/types";

//##################### SYMBOL QUOTE #####################
async function symbolQuoteQueryFn(ticker: string) {
  const { data, error } = await supabase
    .from("symbols")
    .select()
    .eq("ticker", ticker)
    .maybeSingle();

  if (error || !data) throw new Error("Unable to resolve symbol");
  return data;
}

export function symbolQuote(symbol: string) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_quote", symbol],
    queryFn: async () => symbolQuoteQueryFn(symbol),
  });
}

export function useSymbolQuote(symbolName?: string) {
  return useQuery({
    enabled: !!symbolName,
    queryKey: ["symbol_quote", symbolName],
    queryFn: async () => symbolQuoteQueryFn(symbolName!),
  });
}

//##################### SYMBOL QUOTE #####################

//##################### SYMBOL RESOLVE #####################
async function symbolResolveFn(ticker: string) {
  const { data, error } = await supabase
    .from("symbols")
    .select(
      `ticker,name,description,type,logo,exchange,exchange_logo,subsessions,timezone,currency,industry,sector,session_holidays,isin`,
    )
    .eq("ticker", ticker)
    .maybeSingle();

  if (error || !data) throw new Error("Unable to resolve symbol");
  return data;
}

export function symbolResolve(symbol: string) {
  return symbolResolveFn(symbol);
}

//##################### SYMBOL QUOTE #####################

//##################### SYMBOL SEARCH #####################

interface SymbolSearchOptions {
  exchange?: string;
  type?: string;
  signal?: AbortSignal;
  limit?: number;
}

async function symbolSearchQueryFn(q: string, option?: SymbolSearchOptions) {
  let query = supabase
    .from("symbols")
    .select("ticker,name,description,type,logo,exchange,exchange_logo")
    .ilike("name", `%${q}%`)
    .limit(option?.limit ?? 50);

  if (option?.exchange) query = query.eq("exchange", option.exchange);
  if (option?.type) query = query = query.eq("type", option.type);
  if (option?.signal) query = query.abortSignal(option.signal);

  const { data, error } = await query;
  if (error || !data) throw new Error("Error");
  return data;
}

export function symbolSearch(
  q: string,
  options?: Omit<SymbolSearchOptions, "signal">,
) {
  return queryClient.fetchQuery({
    queryKey: ["symbol_search", q, options],
    queryFn: async ({ signal }) =>
      symbolSearchQueryFn(q, { ...options, signal }),
  });
}

export function useSymbolSearch(
  q: string,
  options?: Omit<SymbolSearchOptions, "signal">,
) {
  return useQuery({
    queryKey: ["symbol_search", q, options],
    enabled: !!q,
    queryFn: async ({ signal }) =>
      symbolSearchQueryFn(q, { ...options, signal }),
  });
}

//##################### SYMBOL SEARCH #####################

//##################### SYMBOL CANDLE #####################

const upstoxHistory = new HistoryApi(upstox);

export async function symbolCandle(
  symbolInfo: LibrarySymbolInfo,
  interval: "day",
  to: DateTime,
  from: DateTime,
  firstRequest: boolean,
) {
  const instrumentKey = toUpstoxInstrumentKey(symbolInfo);
  const timeIndex = 0;
  const openIndex = 1;
  const highIndex = 2;
  const lowIndex = 3;
  const closeIndex = 4;
  const volumeIndex = 5;

  const historyPromise = new Promise<GetHistoricalCandleResponse>(
    (resolve, reject) => {
      upstoxHistory.getHistoricalCandleData1(
        instrumentKey,
        interval,
        to.toFormat("yyyy-MM-dd"),
        from.toFormat("yyyy-MM-dd"),
        "v2",
        (error, data) => {
          if (error) return reject(error);
          return resolve(data);
        },
      );
    },
  );

  const intradayCandle = [] as GetHistoricalCandleResponse["data"]["candles"];
  if (firstRequest) {
    const intraday = await new Promise<GetIntraDayCandleResponse>(
      (resolve, reject) => {
        upstoxHistory.getIntraDayCandleData(
          instrumentKey,
          "30minute",
          "v2",
          (error, data) => {
            if (error) return reject(error);
            return resolve(data);
          },
        );
      },
    );

    const { candles } = intraday.data;
    if (candles.length > 0) {
      const time = candles[0][timeIndex];
      const open = candles[0][openIndex];
      const high = Math.max(...candles.map((c) => c[highIndex]));
      const low = Math.min(...candles.map((c) => c[lowIndex]));
      const close = candles[candles.length - 1][closeIndex];
      const volume = candles
        .map((c) => c[volumeIndex])
        .reduce((a, b) => a + b, 0);
      intradayCandle.push([time, open, high, low, close, volume, 0]);
    }
  }

  const candles = await historyPromise.then((h) => h.data.candles);
  candles.push(...intradayCandle);

  return candles
    .map(([ts, open, high, low, close, volume]) => {
      const utc = FixedOffsetZone.utcInstance;
      const time = DateTime.fromISO(ts.split("+")[0], { zone: utc })
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toMillis();
      return { time, open, high, low, close, volume };
    })
    .reverse();
}

function toUpstoxInstrumentKey(symbol: LibrarySymbolInfo) {
  const { type, exchange, isin, ticker } = symbol;
  switch (type) {
    case "index": {
      if (!ticker || !exchange) {
        throw new Error("Unable to generate upstox instrument key");
      }
      if (ticker.includes("CNX")) {
        const new_name = ticker.replace("CNX", "NIFTY");
        return [`${exchange}_INDEX`, new_name].join("|");
      }
      return [`${exchange}_INDEX`, "Nifty 50"].join("|");
    }
    case "stock": {
      if (!isin) {
        throw new Error("Unable to generate upstox instrument key");
      }
      return [`${exchange}_EQ`, isin].join("|");
    }

    case "fund": {
      if (!isin) {
        throw new Error("Unable to generate upstox instrument key");
      }
      return [`${exchange}_EQ`, isin].join("|");
    }
    default:
      throw new Error("Not supported symbol type");
  }
}

//##################### SYMBOL CANDLE #####################