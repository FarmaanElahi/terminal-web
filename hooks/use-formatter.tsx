import { useCallback } from "react";

const percentFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  compactDisplay: "short",
  style: "percent",
});

export function usePercentFormatter(asRatio = true) {
  return useCallback(
    (value: number) => percentFormatter.format(asRatio ? value / 100 : value),
    [asRatio],
  );
}
