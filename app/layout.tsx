import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ThemeProvider }          from "@/components/layout/ThemeProvider"
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar"
import { PWAInstallBanner }       from "@/components/layout/PWAInstallBanner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://toilet-book.com"),

  // ── Primary title & description ────────────────────────────────
  title: {
    default:  "Toilet Book — Rate Public Toilets & Find Clean Bathrooms Near You",
    template: "%s | Toilet Book",
  },
  description:
    "Toilet Book is the world's first community-powered public toilet rating platform. Find clean bathrooms near you, rate restrooms, report accessibility features, and earn FLUSH crypto rewards. 47,000+ toilets mapped worldwide.",

  // ── Keywords ───────────────────────────────────────────────────
  keywords: [
    "public toilet rating",
    "rate public toilets",
    "bathroom rating app",
    "restroom rating",
    "toilet reviews",
    "find clean bathrooms near me",
    "public restroom finder",
    "toilet finder app",
    "bathroom finder near me",
    "adult changing station finder",
    "accessible bathroom finder",
    "family bathroom near me",
    "gender neutral bathroom finder",
    "wheelchair accessible toilet",
    "public toilets near me",
    "clean public bathrooms",
    "best public restrooms",
    "restaurant bathroom rating",
    "Toilet Book",
    "toilet-book.com",
    "FLUSH token",
    "toilet crypto rewards",
    "earn crypto reviewing toilets",
    "crowdsourced toilet ratings",
    "community toilet map",
    "public toilet map",
    "bathroom cleanliness rating",
    "restroom quality review",
  ],

  // ── Open Graph ─────────────────────────────────────────────────
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

  // ── Twitter / X card ───────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       "Toilet Book — Rate Toilets. Earn Crypto.",
    description:
      "The world's first community toilet rating platform with crypto rewards. Find clean bathrooms near you. 47,000+ locations mapped.",
    images:   ["/og-image.png"],
    creator:  "@toiletbook",
  },

  // ── Canonical ──────────────────────────────────────────────────
  alternates: {
    canonical: "https://toilet-book.com",
  },

  // ── Robots ─────────────────────────────────────────────────────
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // ── Icons — using exact favicon.io filenames ───────────────────
  icons: {
    icon: [
      { url: "/favicon.ico",        sizes: "any" },
      { url: "/favicon-16x16.png",  sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png",  sizes: "32x32", type: "image/png" },
    ],
    apple:   "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  // ── PWA manifest ───────────────────────────────────────────────
  manifest: "/manifest.json",
}

// ── JSON-LD Structured Data ────────────────────────────────────────
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
      "@type":               "MobileApplication",
      "name":                "Toilet Book",
      "url":                 "https://toilet-book.com",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem":     "Any",
      "description":
        "Rate public toilets, find clean bathrooms near you, report accessibility features, and earn FLUSH crypto rewards.",
      "offers": {
        "@type":         "Offer",
        "price":         "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type":  "Organization",
      "@id":    "https://toilet-book.com/#organization",
      "name":   "Toilet Book",
      "url":    "https://toilet-book.com",
      "logo":   "https://toilet-book.com/android-chrome-512x512.png",
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
        {/* ── Favicons — favicon.io package ── */}
        <link rel="icon"               href="/favicon.ico"       sizes="any" />
        <link rel="icon"               href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon"               href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon"   href="/apple-touch-icon.png" />
        <link rel="shortcut icon"      href="/favicon.ico" />

        {/* ── PWA ── */}
        <link rel="manifest"           href="/manifest.json" />
        <meta name="theme-color"       content="#0ea5e9" />
        <meta name="mobile-web-app-capable"            content="yes" />
        <meta name="apple-mobile-web-app-capable"      content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title"        content="Toilet Book" />

        {/* ── JSON-LD structured data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Performance preconnects ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://dltanpkvuxomubasfepm.supabase.co" />
      </head>
      < className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ServiceWorkerRegistrar />
          <PWAInstallBanner />
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
        <Analytics />
      <SpeedInsights />
      </body>
    </html>
  )
}
