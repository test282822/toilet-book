import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://toilet-book.com"),

  // ── Primary title & description ──────────────────────────────
  title: {
    default:  "Toilet Book — Rate Public Toilets & Find Clean Bathrooms Near You",
    template: "%s | Toilet Book",
  },
  description:
    "Toilet Book is the world's first community-powered public toilet rating platform. Find clean bathrooms near you, rate restrooms, report accessibility features, and earn FLUSH crypto rewards. 47,000+ toilets mapped worldwide.",

  // ── Keywords — targeting real search intent ───────────────────
  keywords: [
    // Core intent
    "public toilet rating",
    "rate public toilets",
    "bathroom rating app",
    "restroom rating",
    "toilet reviews",
    "find clean bathrooms near me",
    "public restroom finder",
    "toilet finder app",
    "bathroom finder near me",

    // Accessibility intent
    "adult changing station finder",
    "accessible bathroom finder",
    "family bathroom near me",
    "gender neutral bathroom finder",
    "wheelchair accessible toilet",

    // Location intent
    "public toilets near me",
    "clean public bathrooms",
    "best public restrooms",
    "worst public bathrooms",
    "restaurant bathroom rating",

    // Platform brand
    "Toilet Book",
    "toilet-book.com",
    "FLUSH token",
    "toilet crypto rewards",
    "earn crypto reviewing toilets",

    // Long tail
    "crowdsourced toilet ratings",
    "community toilet map",
    "public toilet map",
    "bathroom cleanliness rating",
    "restroom quality review",
  ],

  // ── Open Graph (Facebook, LinkedIn, iMessage previews) ───────
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://toilet-book.com",
    siteName:    "Toilet Book",
    title:       "Toilet Book — Rate Toilets. Earn Crypto. Help Everyone Find a Clean Bathroom.",
    description:
      "Community-powered toilet ratings with crypto rewards. Find clean bathrooms near you, rate restrooms, report accessibility features. 47,000+ locations mapped. Earn FLUSH tokens.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "Toilet Book — Rate public toilets and earn FLUSH crypto rewards",
      },
    ],
  },

  // ── Twitter / X card ─────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       "Toilet Book — Rate Toilets. Earn Crypto.",
    description:
      "The world's first community toilet rating platform with crypto rewards. Find clean bathrooms near you. 47,000+ locations mapped.",
    images:      ["/og-image.png"],
    creator:     "@toiletbook",
  },

  // ── Canonical & alternate ─────────────────────────────────────
  alternates: {
    canonical: "https://toilet-book.com",
  },

  // ── Robots ───────────────────────────────────────────────────
  robots: {
    index:                    true,
    follow:                   true,
    googleBot: {
      index:                  true,
      follow:                 true,
      "max-video-preview":    -1,
      "max-image-preview":    "large",
      "max-snippet":          -1,
    },
  },

  // ── App & favicon ─────────────────────────────────────────────
  icons: {
    icon:        "/favicon.ico",
    shortcut:    "/favicon.ico",
    apple:       "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",

  // ── Verification — already done via file, keeping for safety ─
  // verification: { google: "YOUR_CODE_HERE" },

  // ── Structured data injected via JSON-LD below ───────────────
}

// ── JSON-LD Structured Data — helps Google understand the site ──
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":       "WebSite",
      "@id":         "https://toilet-book.com/#website",
      "url":         "https://toilet-book.com",
      "name":        "Toilet Book",
      "description": "The world's first community-powered public toilet rating platform with crypto rewards.",
      "potentialAction": {
        "@type":       "SearchAction",
        "target":      "https://toilet-book.com/map?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type":         "MobileApplication",
      "name":          "Toilet Book",
      "url":           "https://toilet-book.com",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Any",
      "description":   "Rate public toilets, find clean bathrooms near you, report accessibility features, and earn FLUSH crypto rewards.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type":     "Organization",
      "@id":       "https://toilet-book.com/#organization",
      "name":      "Toilet Book",
      "url":       "https://toilet-book.com",
      "logo":      "https://toilet-book.com/logo.png",
      "contactPoint": {
        "@type":             "ContactPoint",
        "email":             "toiletbookmain@gmail.com",
        "contactType":       "customer support",
        "availableLanguage": "English",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://dltanpkvuxomubasfepm.supabase.co" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                background:   "#0f172a",
                color:        "#f1f5f9",
                border:       "1px solid rgba(255,255,255,0.1)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
