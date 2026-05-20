import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["santiyeilan.local"],
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.googleapis.com https://*.firebase.com https://*.firebaseapp.com https://*.firebaseio.com wss://*.firebaseio.com https://formsubmit.co",
      "frame-src https://accounts.google.com https://*.firebaseapp.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
};

export default nextConfig;
