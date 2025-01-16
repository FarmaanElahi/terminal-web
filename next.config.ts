import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/external/charting_library/:path*",
        destination:
          "https://charting-library.tradingview-widget.com/charting_library/:path*",
      },
      {
        source: "/external/logos/:path*",
        destination: "https://s3-symbol-logo.tradingview.com/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/dashboard",
        permanent: true, // Set to true if this redirect is permanent
      },
    ];
  },
};

export default nextConfig;
