import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "firebasestorage.googleapis.com" }],
  },

  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // }
};

export default withNextIntl(nextConfig);
