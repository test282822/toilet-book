import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",  // internal analytics — not for public indexing
        ],
      },
    ],
    sitemap: "https://toilet-book.com/sitemap.xml",
    host:    "https://toilet-book.com",
  }
}
