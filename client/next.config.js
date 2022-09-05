/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "www.brown.edu",
      "awards.cs.brown.edu",
      "i.imgur.com",
    ],
  },
};

module.exports = nextConfig;
