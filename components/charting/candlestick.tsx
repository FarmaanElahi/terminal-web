import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  open: number;
  high: number;
  low: number;
  close: number;
  totalHeight?: number;
}

export function Candlestick(props: Props) {
  const { open, high, low, close, totalHeight = 20 } = props;

  // Determine the candle's body color (green for bullish, red for bearish)
  const isBullish = close >= open;
  const bodyColor = isBullish ? "bg-bullish" : "bg-bearish";

  // Calculate the total chart height and scale the OHLC values
  const scale = totalHeight / (high - low);

  // Calculate positions and dimensions for the wick and body
  const wickHeight = (high - low) * scale;
  const bodyHeight = Math.abs(close - open) * scale;
  const bodyPosition = isBullish
    ? (high - close) * scale
    : (high - open) * scale;

  return (
    <div
      className="relative inline-flex justify-center"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Wick */}
      <div
        className="absolute bg-gray-400"
        style={{
          height: `${wickHeight}px`,
          width: "1px",
          top: "0",
        }}
      ></div>

      {/* Candle body */}
      <div
        className={`rounded absolute ${bodyColor}`}
        style={{
          height: `${bodyHeight}px`,
          width: "4px",
          top: `${bodyPosition}px`,
        }}
      ></div>
    </div>
  );
}
