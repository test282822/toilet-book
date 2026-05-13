import { MetadataRoute } from "next"

const BASE = "https://toilet-book.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}`,          lastModified: now, changeFrequency: "daily",   priority: 1.0  },
    { url: `${BASE}/map`,      lastModified: now, changeFrequency: "always",  priority: 0.95 },
    { url: `${BASE}/points`,   lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${BASE}/signup`,   lastModified: now, changeFrequency: "monthly", priority: 0.8  },
    { url: `${BASE}/shop`,     lastModified: now, changeFrequency: "weekly",  priority: 0.7  },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.6  },
    { url: `${BASE}/login`,    lastModified: now, changeFrequency: "monthly", priority: 0.5  },
    { url: `${BASE}/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.5  },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "monthly", priority: 0.4  },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "monthly", priority: 0.4  },
    // SEO content pages
    { url: `${BASE}/best-toilets-in-florida`,          lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/most-accessible-public-bathrooms`, lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/best-airport-bathrooms`,           lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/find-public-bathrooms-near-me`,    lastModified: now, changeFrequency: "daily",   priority: 0.9  },
    { url: `${BASE}/adult-changing-stations-near-me`,  lastModified: now, changeFrequency: "weekly",  priority: 0.88 },
    // Install page
    { url: `${BASE}/install`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Business pages
    { url: `${BASE}/spotlight`,                        lastModified: now, changeFrequency: "monthly", priority: 0.7  },
  ]
}
