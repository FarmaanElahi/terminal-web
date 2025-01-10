import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/external/charting_library/:path*",
        destination:
          "https://trading-terminal.tradingview-widget.com/charting_library/:path*",
      },
      {
        source: "/external/logos/:path*",
        destination: "https://s3-symbol-logo.tradingview.com/:path*",
      },
    ];
  },
};

export default nextConfig;
