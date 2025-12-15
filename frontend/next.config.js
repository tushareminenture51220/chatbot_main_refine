/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //basePath: "/emchatapp",
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: "url-loader",
      },
    });

    return config;
  },
};

module.exports = nextConfig;
