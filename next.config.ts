import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // https://media.stocktwits-cdn.com/api/3/media/1615954/default.png
      {
        protocol: "https",
        hostname: "*.stocktwits-cdn.com",
      },
    ],
  },
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
    ];
  },
};

export default nextConfig;
