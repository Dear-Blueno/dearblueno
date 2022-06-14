/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // update later to remove brown? not sure.
    domains: [
      "lh3.googleusercontent.com",
      "www.brown.edu",
      "awards.cs.brown.edu",
    ],
  },
};

module.exports = nextConfig;
