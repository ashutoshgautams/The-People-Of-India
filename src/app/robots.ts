import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin is claim-gated anyway; keep crawlers out of app-only surfaces.
        disallow: ["/admin"],
      },
    ],
    sitemap: "https://thepeopleofindia.org/sitemap.xml",
  };
}
