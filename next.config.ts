import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    // One canonical host. Vercel also needs www.pdfquickly.com added as a domain for this to fire.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pdfquickly.com" }],
        destination: "https://pdfquickly.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
