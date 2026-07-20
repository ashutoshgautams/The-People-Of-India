import type { MetadataRoute } from "next";

const BASE = "https://thepeopleofindia.org";

// Static routes only — post pages are client-rendered from Firestore, and
// search engines discover them through the feed pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/for-the-people`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/by-the-people`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/founders`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/write`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/guidelines`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
