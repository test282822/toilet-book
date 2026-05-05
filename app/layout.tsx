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
  title: { default: "Toilet Book", template: "%s · Toilet Book" },
  description: "Rate, review and discover toilets everywhere. The world's #1 toilet rating community.",
  metadataBase: new URL("https://toilet-book.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Toilet Book",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Toilet Book",
    description: "Find clean, accessible bathrooms near you. Rate toilets. Earn FLUSH tokens.",
    url: "https://toilet-book.com",
    siteName: "Toilet Book",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toilet Book",
    description: "Find clean, accessible bathrooms near you.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Toilet Book" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
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
