import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
}

export const metadata: Metadata = {
  title: {
    default: "Toilet Book — Find Clean Bathrooms Near You | Rate & Review Restrooms",
    template: "%s | Toilet Book — Bathroom Ratings & Reviews",
  },
  description:
    "Toilet Book is the world's #1 crowdsourced bathroom rating app. Find clean, accessible restrooms near you. Rate toilets, read reviews, discover adult changing stations, family bathrooms and gender neutral bathrooms everywhere you go.",
  keywords: [
    "bathroom rating", "bathroom ratings", "bathroom review", "bathroom reviews",
    "find clean bathroom", "find clean restroom", "find bathrooms near me",
    "restroom finder", "public bathroom finder", "toilet rating", "toilet ratings",
    "toilet review", "rate a toilet", "clean bathroom near me", "best bathrooms",
    "worst bathrooms", "adult changing station", "adult changing stations near me",
    "adult changing table", "family bathroom", "family bathroom near me",
    "gender neutral bathroom", "gender neutral restroom", "accessible bathroom",
    "accessible restroom", "disability bathroom", "bathroom accessibility",
    "airport bathroom rating", "restaurant bathroom rating", "hotel bathroom rating",
    "gym bathroom rating", "mall bathroom rating", "public restroom rating",
    "restroom review app", "bathroom review app", "toilet review app",
    "FLUSH token", "toilet book app", "bathroom community", "restroom community",
    "rate public bathrooms", "bathroom quality rating", "clean restroom finder",
  ],
  verification: {
    google: "google286b91d01f006f38.html",
  },
  metadataBase: new URL("https://toilet-book.com"),
  alternates: { canonical: "https://toilet-book.com" },
  openGraph: {
    type: "website",
    url: "https://toilet-book.com",
    siteName: "Toilet Book",
    title: "Toilet Book — Find Clean Bathrooms Near You",
    description:
      "Rate toilets. Read reviews. Find clean, accessible bathrooms everywhere — including adult changing stations, family bathrooms and gender neutral restrooms. Join the world's #1 bathroom rating community.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Toilet Book — The world's #1 crowdsourced bathroom rating platform" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@toiletbook",
    title: "Toilet Book — Find Clean Bathrooms Near You",
    description: "Rate toilets. Find clean bathrooms. Discover adult changing stations. Join the world's #1 bathroom rating community.",
    images: ["/opengraph-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Toilet Book" },
  formatDetection: { telephone: false },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png", shortcut: "/favicon.ico" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "travel",
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://toilet-book.com/#website",
      "url": "https://toilet-book.com",
      "name": "Toilet Book",
      "description": "The world's #1 crowdsourced bathroom rating and review platform",
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://toilet-book.com/search?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://toilet-book.com/#organization",
      "name": "Toilet Book",
      "url": "https://toilet-book.com",
      "logo": { "@type": "ImageObject", "url": "https://toilet-book.com/apple-icon.png" },
      "description": "Toilet Book is a crowdsourced restroom rating platform. Users rate and review bathrooms worldwide, documenting cleanliness, accessibility, adult changing stations, family bathrooms, and gender neutral facilities.",
    },
    {
      "@type": "MobileApplication",
      "name": "Toilet Book",
      "operatingSystem": "iOS, Android",
      "applicationCategory": "TravelApplication",
      "description": "Find clean bathrooms near you. Rate toilets, discover adult changing stations, family bathrooms and gender neutral restrooms. Earn FLUSH tokens for every review.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Toilet Book" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
