/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
      {
        source: "/:path((?!api/).*)",
        destination: "/:path",
      },
    ];
  },
};

module.exports = nextConfig;
