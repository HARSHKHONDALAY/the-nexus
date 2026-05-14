
const cdnHostname = (() => {
  const url = process.env.NEXT_PUBLIC_CDN_URL;
  if (!url) return null;

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig = {
  allowedDevOrigins: ["192.168.2.117", "192.168.2.146"],
  poweredByHeader: false,
  compress: true,

  // Production optimization
  experimental: {
    optimizePackageImports: [
      "@react-three/fiber",
      "@react-three/drei",
      "three",
      "framer-motion",
      "gsap",
    ],
  },

  turbopack: {},

  // Image optimization for production
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: cdnHostname
      ? [
          {
            protocol: "https",
            hostname: cdnHostname,
            pathname: "/**",
          },
        ]
      : [],
  },

  // Bundle optimization
  webpack: (config: { optimization?: { usedExports?: boolean; sideEffects?: boolean; splitChunks?: { chunks: string; cacheGroups?: Record<string, { test?: RegExp; name?: string; chunks: string }> } } }, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    // Reduce bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },

          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three",
            chunks: "all",
          },

          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap)[\\/]/,
            name: "animations",
            chunks: "all",
          },
        },
      },
    };

    return config;
  },

  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: false,
      },

      {
        source: "/home",
        destination: "/",
        permanent: true,
      },

      {
        source: "/join",
        destination: "/events",
        permanent: true,
      },

      {
        source: "/moment",
        destination: "/moments",
        permanent: true,
      },

      {
        source: "/worlds",
        destination: "/events",
        permanent: true,
      },

      {
        source: "/worlds/chess-nexus",
        destination: "/events/checkmate-chaos",
        permanent: true,
      },

      {
        source: "/worlds/art-nexus",
        destination: "/events/texture-painting",
        permanent: true,
      },
    ];
  },

  async headers() {
    const securityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },

      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },

      {
        key: "X-Frame-Options",
        value: "DENY",
      },

      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },

      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self)",
      },

      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },

      {
        source: "/branding/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/events/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;