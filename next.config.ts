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
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/dashboard",
        permanent: true, // Set to true if this redirect is permanent
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/external/charting_library", // Specify the route or pattern
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // Example header
          },
        ],
      },
      {
        source: "/external/charting_library", // Specify the route or pattern
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000", // Example header
          },
        ],
      },
    ];
  },
};

export default nextConfig;
