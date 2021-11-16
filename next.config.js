const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isLocal = process.env.REF_ENV === "local";

module.exports = withBundleAnalyzer({
  future: {
    webpack5: true,
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    return config;
  },
  assetPrefix: isLocal ? "" : "https://hanged-red.ebombo.io",
});
