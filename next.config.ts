import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "Über uns" was replaced by "Das Konzept" (incl. the founders section).
  async redirects() {
    return [{ source: "/:lang(de|en)/about", destination: "/:lang/concept", permanent: true }];
  },
};

export default nextConfig;
