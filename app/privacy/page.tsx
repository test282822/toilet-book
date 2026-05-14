import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy — Toilet Book",
  description: "Toilet Book privacy policy — how we collect, use, and protect your data including location, photos, and FLUSH token wallet information.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://toilet-book.com/privacy" },
}

const LAST_UPDATED = "May 2026"

const SECTIONS = [
  {
    id: "1",
    title: "1. Information We Collect",
    content: [
      {
        sub: "1.1 Information you provide directly",
        text: `When you create an account you provide your email address, username, and password. You may optionally provide a display name, profile photo, and bio. If you register for the FLUSH token whitelist you provide your Solana wallet address. If you contact us you provide your name and email.`,
      },
      {
        sub: "1.2 Review and rating data",
        text: `When you post a review you provide a star rating (1–5), venue name (optional), facility information (adult changing station, family bathroom, gender-neutral availability), and optionally a photo taken with your device camera or chosen from your gallery. Reviews are public and associated with your username.`,
      },
      {
        sub: "1.3 Location and GPS data — important notice",
        text: `When you use the "Find toilets near me" feature or submit a review, your device may share your GPS coordinates with us. By enabling location services and submitting a review, you consent to your GPS coordinates being used in the following ways:

• Linking your review to a toilet pin on the map
• Contributing to our global aggregate location database
• Improving the accuracy of toilet locations worldwide

GPS data submitted with reviews is associated with the toilet location — not your personal identity — in our public database. It is used to build a community-powered global map of public restrooms.

Do not submit location data for a toilet you do not want appearing on our publicly accessible, globally aggregated map. If you wish to submit a review without location data, you may deny location permission and submit without GPS.

We do not track your movement, store your location history, or collect location data when you are not actively using a feature that requires it.`,
      },
      {
        sub: "1.4 Photos and media",
        text: `Photos you upload are stored in our Supabase cloud storage. Photos submitted from mobile devices (including via the Toilet Book flip phone interface) are uploaded to our "bathroom-pics" storage bucket and associated with your review. Photos are public — do not upload images you do not want publicly visible. Our AI moderation system checks every uploaded photo to verify it depicts a bathroom.`,
      },
      {
        sub: "1.5 Device and technical information",
        text: `We automatically collect your device type, browser user agent string, operating system, and IP address. We use this to optimise the experience for your device — for example, detecting flip phones (including the Orbic Journey V RC2200L and similar devices) to serve a lightweight interface. We also collect page views, feature usage, and referral sources to understand how the platform is used.`,
      },
      {
        sub: "1.6 Solana wallet address",
        text: `If you register for the FLUSH token whitelist, you provide your Solana wallet address. This is stored securely in your profile and used solely for distributing FLUSH tokens on the token launch date (August 28, 2026). We never ask for your private key or seed phrase. Never share your seed phrase with anyone — not us, not anyone.`,
      },
      {
        sub: "1.7 Cookies and local storage",
        text: `We use browser local storage to maintain your login session on the Toilet Book flip phone interface. We use session storage to maintain your admin session. We do not use third-party advertising cookies. The Toilet Book PWA (Progressive Web App) uses a service worker to cache pages for offline use — this stores copies of page content on your device and can be cleared by uninstalling the PWA.`,
      },
    ],
  },
  {
    id: "2",
    title: "2. How We Use Your Information",
    content: [
      {
        sub: "",
        text: `We use the information we collect to:

• Operate and improve the Toilet Book platform
• Display your reviews and ratings on the public map and feed
• Aggregate GPS data from reviews into our global toilet location database
• Detect your device type to serve the appropriate interface (standard web app or lightweight flip phone UI)
• Send transactional emails (account confirmation, password reset)
• Moderate content for community standards compliance
• Distribute FLUSH tokens to whitelisted wallet addresses on launch day
• Detect and prevent abuse, fraud, and policy violations
• Improve search engine discoverability of community-reported locations
• Analyse usage patterns to improve features

We do not use your information for advertising, do not build advertising profiles, and do not share your personal data with advertisers.`,
      },
    ],
  },
  {
    id: "3",
    title: "3. Public Content and Global Aggregation",
    content: [
      {
        sub: "3.1 What is public",
        text: `The following information is public and visible to all visitors of toilet-book.com, without requiring an account:

• Your reviews including star rating, venue name, facility badges, and any photo
• Your username (but not your email address)
• The GPS-derived location pin associated with your review
• Your FLUSH token balance rank on leaderboards (username and balance only)

Do not post reviews, photos, or location data that you do not want publicly visible globally.`,
      },
      {
        sub: "3.2 Global aggregate map",
        text: `Toilet Book maintains a global database of public restroom locations built from community submissions, OpenStreetMap data, and GPS data submitted with reviews. This database is used to power our public map at toilet-book.com/map.

By submitting a review with location enabled, you explicitly consent to your GPS coordinates being processed into this global aggregate database. The toilet pin location derived from your GPS coordinates will be publicly visible on our worldwide map and may be accessible via our API to third parties building on our data.

If you submit a review at a location you consider private or sensitive, do so without enabling location permission.`,
      },
      {
        sub: "3.3 Spotlight and business listings",
        text: `If your venue is listed under our Spotlight or Verified programme, your venue name, address, and facility information is publicly listed and may appear in search engine results. Business contact information provided to us for verification is not publicly displayed but is retained for account management purposes.`,
      },
    ],
  },
  {
    id: "4",
    title: "4. Third-Party Services",
    content: [
      {
        sub: "",
        text: `We use the following third-party services to operate Toilet Book:

• Supabase — database, authentication, and file storage (supabase.com)
• Vercel — hosting and deployment (vercel.com)
• OpenStreetMap — base map tile data (openstreetmap.org)
• Nominatim — address geocoding from GPS coordinates (nominatim.openstreetmap.org)
• Cloudflare — DNS and performance (cloudflare.com)
• Anthropic Claude API — AI photo moderation (anthropic.com)
• Solana blockchain — FLUSH token distribution (post-launch)
• Raydium DEX — FLUSH token liquidity (post-launch)

Each of these services has its own privacy policy. We encourage you to review them. We do not control how these third parties process data once it leaves our systems.`,
      },
    ],
  },
  {
    id: "5",
    title: "5. We Do Not Sell Your Data",
    content: [
      {
        sub: "",
        text: `Toilet Book does not sell, rent, or trade your personal information to any third party for commercial purposes. Claude products are ad-free. We do not allow advertisers to access your data or target you based on your activity on our platform.

The global aggregate toilet location database we build from community GPS submissions may be made available to developers and researchers building accessibility tools, travel apps, or public health infrastructure. This data is location-based and does not include personal identifiers.`,
      },
    ],
  },
  {
    id: "6",
    title: "6. Data Retention and Deletion",
    content: [
      {
        sub: "",
        text: `Account data: retained while your account is active. You may request deletion at any time.

Reviews and ratings: retained indefinitely as part of the community database. If you delete your account, your reviews are anonymised (username replaced with "deleted user") and the content remains as part of the public record.

Photos: deleted from storage within 30 days of account deletion upon request.

GPS-derived toilet pins: retained indefinitely as part of the aggregate map database. Individual GPS submissions are disassociated from your account on deletion.

Solana wallet address: deleted from your profile on account deletion. Token distributions already made to your wallet cannot be reversed.

Server logs including IP addresses: retained for 90 days for security purposes.

To request data deletion, email toiletbookmain@gmail.com with subject "Data Deletion Request".`,
      },
    ],
  },
  {
    id: "7",
    title: "7. PWA, Offline Data, and Device Storage",
    content: [
      {
        sub: "",
        text: `Toilet Book is available as a Progressive Web App (PWA) that can be installed on your home screen. When installed, a service worker caches the following on your device for offline access: the homepage, map page, and points page.

No personal data is stored in the service worker cache — only page HTML and assets. Your login session is stored in your browser's local storage. Clearing your browser data or uninstalling the PWA removes all locally stored data.

The flip phone interface (accessible at toilet-book.com/flip.html) stores your login session in local storage to persist between visits on devices where session storage resets on browser close.`,
      },
    ],
  },
  {
    id: "8",
    title: "8. Children",
    content: [
      {
        sub: "",
        text: `Toilet Book is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us at toiletbookmain@gmail.com and we will delete it promptly.`,
      },
    ],
  },
  {
    id: "9",
    title: "9. Your Rights",
    content: [
      {
        sub: "",
        text: `Depending on your location you may have the following rights regarding your personal data:

• Access: request a copy of the personal data we hold about you
• Correction: request correction of inaccurate data
• Deletion: request deletion of your account and associated personal data
• Portability: request your data in a machine-readable format
• Objection: object to processing of your data in certain circumstances
• Withdrawal of consent: withdraw location consent by disabling location permission in your browser or device settings at any time

To exercise any of these rights, contact us at toiletbookmain@gmail.com. We will respond within 30 days.`,
      },
    ],
  },
  {
    id: "10",
    title: "10. Security",
    content: [
      {
        sub: "",
        text: `We use industry-standard security measures including encrypted connections (HTTPS), Supabase row-level security policies, and hashed password storage. We do not store payment card data — all payments for Spotlight and Verified listings are handled externally.

No system is perfectly secure. If you discover a security vulnerability please report it to toiletbookmain@gmail.com rather than publicly disclosing it.`,
      },
    ],
  },
  {
    id: "11",
    title: "11. Changes to This Policy",
    content: [
      {
        sub: "",
        text: `We may update this Privacy Policy from time to time. Material changes will be communicated via email to registered users and/or a prominent notice on the site. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of Toilet Book after a policy update constitutes acceptance of the updated policy.`,
      },
    ],
  },
  {
    id: "12",
    title: "12. Contact Us",
    content: [
      {
        sub: "",
        text: `For any privacy-related questions, data requests, or concerns:\n\nEmail: toiletbookmain@gmail.com\nWebsite: toilet-book.com/contact`,
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Privacy Policy</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {LAST_UPDATED}</p>
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Important — Location Data Notice</p>
            <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
              GPS coordinates submitted with reviews are contributed to our global aggregate public restroom database and displayed on our worldwide map. Do not submit location data for any location you do not want publicly visible globally.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(section => (
            <div key={section.id} id={`section-${section.id}`}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                {section.title}
              </h2>
              <div className="space-y-5">
                {section.content.map((block, i) => (
                  <div key={i}>
                    {block.sub && (
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{block.sub}</h3>
                    )}
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                      {block.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-4">Related policies</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/terms"    className="text-sky-500 hover:text-sky-400 transition-colors">Terms of Service →</Link>
            <Link href="/policies" className="text-sky-500 hover:text-sky-400 transition-colors">Platform Rules →</Link>
            <Link href="/contact"  className="text-sky-500 hover:text-sky-400 transition-colors">Contact Us →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
