
/** @type {import("next").NextConfig} */
module.exports = {
  experimental: { appDir: true },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    config.resolve.fallback = { fs: false };
    return config
  },

}

// module.exports = nextConfig
