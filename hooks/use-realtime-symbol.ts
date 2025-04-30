// hooks/use-realtime-symbol.ts
import { useEffect, useRef, useState } from "react";
import { MarketDataStreamer } from "@/utils/upstox/market_data_streamer";
import * as MarketV3 from "@/utils/upstox/market_v3";
import type { Symbol } from "@/types/symbol";
import IFeed = MarketV3.com.upstox.marketdatafeeder.rpc.proto.IFeed;

/**
 * Extract and transform market data from a feed into symbol properties
 * @param feed The market data feed
 * @param symbol
 * @returns An object with extracted symbol properties
 */
function extractMarketDataFromFeed(
  feed: IFeed,
  symbol: Symbol,
): Partial<Symbol> {
  const change: Partial<Symbol> = {};

  const ltpc = feed.ff?.marketFF?.ltpc ?? feed.ff?.indexFF?.ltpc;
  const dayClose = ltpc?.ltp;
  const prevDayClose = symbol.prev_day_close;
  if (dayClose !== null) change["day_close"] = dayClose;
  if (prevDayClose && dayClose) {
    const ch = dayClose - prevDayClose;
    change["price_change_today_pct"] = (ch / prevDayClose) * 100;
  }
  // TODO:
  // price_change_from_open_pct
  // price_change_from_high_pct
  return change;
}

/**
 * Merge original symbol data with market data updates
 * @param originalSymbol The original symbol object
 * @param marketData The extracted market data
 * @returns A new symbol object with merged data
 */
function mergeSymbolWithMarketData(
  originalSymbol: Symbol,
  marketData: Partial<Symbol>,
): Symbol {
  return {
    ...originalSymbol,
    ...marketData,
  };
}

/**
 * Hook to subscribe to real-time market data for symbols and merge with original data
 *
 * @param symbols List of symbols to subscribe to
 * @returns Object containing all updated symbols, recently updated symbols, and connection status
 */
export function useRealtimeSymbol(symbols: Symbol[] | undefined) {
  const streamerRef = useRef(MarketDataStreamer.getInstance());
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());
  const [allSymbols, setAllSymbols] = useState<Symbol[]>([]);
  const [updatedSymbols, setUpdatedSymbols] = useState<Symbol[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const originalSymbolsRef = useRef<Record<string, Symbol>>({});

  // Keep track of the original symbols for merging with updates
  useEffect(() => {
    if (!symbols) return;

    const symbolMap: Record<string, Symbol> = {};
    symbols.forEach((symbol) => {
      if (symbol.ticker) {
        symbolMap[symbol.ticker] = symbol;
      }
    });

    originalSymbolsRef.current = symbolMap;

    // Initialize updated symbols with the original data
    setAllSymbols(symbols);
    setUpdatedSymbols([]);
  }, [symbols]);

  // Track connection status
  useEffect(() => {
    const streamer = streamerRef.current;

    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);

    streamer.on("open", handleOpen);
    streamer.on("close", handleClose);

    // Initial state
    setIsConnected(streamer.feeder.ws?.readyState === WebSocket.OPEN);

    return () => {
      streamer.off("open", handleOpen);
      streamer.off("close", handleClose);
    };
  }, []);

  // Effect to manage subscriptions when symbols change
  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const streamer = streamerRef.current;
    const currentSymbols = new Set(
      symbols.map((s) => s.ticker).filter(Boolean),
    );
    const subscribedSymbols = subscribedSymbolsRef.current;

    // Symbols to subscribe to (new ones)
    const symbolsToSubscribe = symbols.filter(
      (s) => s.ticker && !subscribedSymbols.has(s.ticker),
    );

    // Symbols to unsubscribe from (no longer in the list)
    const symbolsToUnsubscribe = Array.from(subscribedSymbols)
      .filter((ticker) => !currentSymbols.has(ticker))
      .map((ticker) => {
        // Create a minimal symbol object with just the ticker
        return { ticker } as Symbol;
      });

    // Subscribe to new symbols
    if (symbolsToSubscribe.length > 0) {
      streamer.subscribe(symbolsToSubscribe, "full");
      symbolsToSubscribe.forEach((s) => {
        if (s.ticker) subscribedSymbols.add(s.ticker);
      });
    }

    // Unsubscribe from removed symbols
    if (symbolsToUnsubscribe.length > 0) {
      streamer.unsubscribe(symbolsToUnsubscribe);
      symbolsToUnsubscribe.forEach((s) => {
        if (s.ticker) subscribedSymbols.delete(s.ticker);
      });
    }

    // Cleanup function to unsubscribe from all symbols when component unmounts
    return () => {
      if (subscribedSymbols.size > 0) {
        const allSymbols = Array.from(subscribedSymbols).map(
          (ticker) => ({ ticker }) as Symbol,
        );
        streamer.unsubscribe(allSymbols);
        subscribedSymbols.clear();
      }
    };
  }, [symbols]);

  // Effect to handle market data updates
  useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const streamer = streamerRef.current;
    const handleMarketData = ({ feeds }: { feeds: Record<string, IFeed> }) => {
      if (!feeds || Object.keys(feeds).length === 0) return;

      const originalSymbols = originalSymbolsRef.current;
      const subscribedSymbols = subscribedSymbolsRef.current;
      const updatedSymbolsInThisUpdate: Symbol[] = [];

      // Create a new map of all updated symbols
      const allSymbolsMap = { ...originalSymbols };

      // Process each feed update
      Object.entries(feeds).forEach(([ticker, feed]) => {
        // Skip if we don't have this ticker in our list
        if (!subscribedSymbols.has(ticker) || !originalSymbols[ticker]) return;

        // Extract market data from the feed
        const symbol = originalSymbols[ticker];
        const updates = extractMarketDataFromFeed(feed, symbol);

        // Skip if no meaningful data was extracted
        if (Object.keys(updates).length === 0) return;

        // Merge the original symbol with market data
        const updatedSymbol = mergeSymbolWithMarketData(symbol, updates);

        // Update the complete symbols map
        allSymbolsMap[ticker] = updatedSymbol;

        // Add to the list of symbols updated in this refresh
        updatedSymbolsInThisUpdate.push(updatedSymbol);
      });

      // Only update state if we actually have updates
      if (updatedSymbolsInThisUpdate.length > 0) {
        setAllSymbols(Object.values(allSymbolsMap));
        setUpdatedSymbols(updatedSymbolsInThisUpdate);
      }
    };

    // Subscribe to market data events
    streamer.on("message", handleMarketData);

    // Cleanup function
    return () => {
      streamer.off("message", handleMarketData);
    };
  }, [symbols]);

  return {
    allSymbols, // All symbols with latest data
    updatedSymbols, // Only symbols that were updated in the latest refresh
    isConnected,
  };
}
