import { TradingView } from "@/components/chart/charting";

let tradingViewLoaded = false;
let tradingViewPromise: Promise<TradingView>;

export function getTradingView() {
  if (tradingViewLoaded) {
    // Library is already loaded
    return Promise.resolve(window.TradingView);
  }

  if (!tradingViewPromise) {
    // Library is not loaded, create a promise to load it
    tradingViewPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = process.env.NEXT_PUBLIC_CHART_SCRIPT_URL as string; // Adjust to your proxied path
      // script.async = true;

      script.onload = () => {
        tradingViewLoaded = true;
        resolve(window.TradingView);
      };

      script.onerror = () => {
        console.error("Failed to load TradingView library");
        reject(new Error("Failed to load TradingView library"));
      };

      document.head.appendChild(script);
    });
  }

  return tradingViewPromise;
}
