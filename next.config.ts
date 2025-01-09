import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/external/charting_library/:path*", // Proxy all requests under /charting_library/
        destination:
          "https://charting-library.tradingview-widget.com/charting_library/:path*",
      },
    ];
  },
};

export default nextConfig;
