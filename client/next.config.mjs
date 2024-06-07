/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icons8.com",
      },
      {
        protocol: "http",
        hostname: "www.w3.org",
      },
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "flowbite.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
};

export default nextConfig;
