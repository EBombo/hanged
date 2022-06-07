const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";

module.exports = withBundleAnalyzer({
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    if (isProd)
      config.optimization = {
        sideEffects: true,
        runtimeChunk: "single",
        minimize: true,
        minimizer: [],
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 200000,
          maxSize: 250000,
        },
      };

    return config;
  },
  assetPrefix: process.env.NEXT_PUBLIC_DOMAIN ?? "",
  async headers() {
    return [
      {
        source: "/:all*(jpg|jpeg|gif|png|svg|ico)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:all*(eot|otf|ttf|ttc|woff|font.css)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:all*(js|css|json)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
});
