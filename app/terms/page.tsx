import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service — Toilet Book",
  description: "Toilet Book terms of service — rules for using the platform, posting reviews, earning FLUSH tokens, GPS location consent, and Spotlight business listings.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://toilet-book.com/terms" },
}

const LAST_UPDATED = "May 2026"

const SECTIONS = [
  {
    id: "1",
    title: "1. Acceptance of Terms",
    text: `By accessing or using Toilet Book at toilet-book.com, the Toilet Book PWA (Progressive Web App), the Toilet Book flip phone interface (toilet-book.com/flip.html), or any associated services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.

These terms apply to all users including visitors (no account required to browse the map), registered users, Spotlight and Verified business account holders, and users accessing the platform via any device including mobile browsers, installed PWA, or the flip phone interface.`,
  },
  {
    id: "2",
    title: "2. Eligibility",
    text: `You must be at least 13 years old to create an account. By creating an account you represent that you meet this age requirement. Users between 13 and 18 should have parental awareness of their use of the platform.

There are no geographic restrictions on using Toilet Book. The platform is available worldwide and our database covers toilets in all countries.`,
  },
  {
    id: "3",
    title: "3. User Accounts",
    text: `You are responsible for maintaining the security of your account credentials. Do not share your password. Notify us immediately at toiletbookmain@gmail.com if you suspect unauthorised access to your account.

You may only operate one account per person. Multiple accounts created to game the FLUSH token points system will result in all associated accounts being banned and points forfeited.

Your username is public. Do not use a username that is offensive, impersonates another person, or violates any third-party rights.`,
  },
  {
    id: "4",
    title: "4. Reviews, Ratings, and Content",
    text: `By posting a review on Toilet Book you represent that:

• The review reflects your genuine experience of a real public restroom
• Any facility information you report (adult changing station, family bathroom, gender-neutral availability) is accurate to the best of your knowledge
• Any photo you upload depicts a bathroom and does not violate any third party's privacy or rights
• You have the right to share any content you post

You may not post:
• Reviews for locations you have not personally visited
• False, misleading, or deliberately inaccurate ratings
• Defamatory, harassing, or abusive content
• Sexually explicit content
• Content depicting or promoting illegal activity
• Personal information about identifiable individuals
• Promotional or spam content unrelated to the bathroom being reviewed

All photos are checked by our AI moderation system and reviewed by our team. Violating content will be removed and accounts may be suspended.

Reviews are public. Your username is displayed with your review. Once posted, reviews cannot be fully deleted — they may be anonymised on account deletion.`,
  },
  {
    id: "5",
    title: "5. Location Data and GPS Consent",
    text: `Toilet Book collects GPS coordinates when you enable location services to:

• Identify the nearest toilet to your current position
• Tag your review with a location so it appears on the map
• Link your review to an existing toilet pin or create a new one

By enabling location services and submitting a review, you explicitly agree that:

1. Your GPS coordinates will be used to create or update a publicly visible toilet pin on our global map
2. Your location data contributes to our global aggregate public restroom database
3. The toilet location derived from your GPS may be visible worldwide on toilet-book.com/map and any apps built on our data
4. Your location is associated with the toilet pin — not your personal profile — in the public database

Do not submit a review with location enabled for any location you do not want appearing on a global public map. You may disable location permission in your browser or device settings at any time. Submitting a review without location is always permitted — simply deny the location permission prompt.

Location data is used only while you are actively using a location feature. We do not track your movement or collect background location.`,
  },
  {
    id: "6",
    title: "6. Photo Uploads and Camera Access",
    text: `When you upload a photo through the Toilet Book website or the flip phone interface (which supports direct camera capture), you grant Toilet Book a non-exclusive, worldwide, royalty-free licence to store, display, and use that photo as part of the platform.

Photos are stored in our cloud storage and displayed publicly with your review. Do not upload:
• Photos of identifiable people without their consent
• Photos that do not depict a bathroom or bathroom-related facility
• Photos you do not own the rights to
• Explicit, graphic, or inappropriate content

Our AI system checks every photo. Photos that fail moderation are rejected automatically. Repeated violations may result in account suspension.

Photos uploaded via the flip phone camera interface are stored in our "bathroom-pics/flip/" storage folder and subject to the same policies as web uploads.`,
  },
  {
    id: "7",
    title: "7. FLUSH Token Points System",
    text: `Toilet Book operates an in-app points system where users earn FLUSH points for contributing to the platform. Points are earned for:

• Signing up: 50 points
• Posting a review: 10 points
• First review at a location: additional 15 points
• Reporting an adult changing station: 25 points
• Reporting a family bathroom: 15 points
• Reporting a gender-neutral bathroom: 15 points
• Receiving a like on your review: 2 points
• Referring a new user: 50 points

FLUSH points are off-chain loyalty points until the FLUSH token launches on the Solana blockchain on August 28, 2026. At launch, points convert to FLUSH tokens at a ratio of 1 point = 10 FLUSH tokens, up to a maximum of 5,000,000 FLUSH tokens per user.

FLUSH points and tokens are not currency, are not redeemable for cash, and have no guaranteed monetary value. Toilet Book reserves the right to:
• Adjust the points earn rates at any time with notice
• Adjust the conversion ratio with reasonable notice before launch
• Forfeit points earned through fraudulent or automated means
• Delay or modify the token launch date

Users found gaming the points system (multiple accounts, fake reviews, automated submissions) will have their points forfeited and accounts banned.`,
  },
  {
    id: "8",
    title: "8. FLUSH Token Whitelist",
    text: `To receive FLUSH tokens on launch day (August 28, 2026), registered users must:

1. Have a minimum of 50 FLUSH points
2. Register a valid Solana wallet address in their profile before August 21, 2026 (whitelist cutoff date)
3. Have a verified email address

By registering your Solana wallet address you:
• Confirm you control the wallet at that address
• Understand that tokens sent to an incorrect address cannot be recovered
• Accept that Toilet Book is not responsible for lost tokens due to incorrect wallet addresses or lost seed phrases
• Acknowledge that token receipt may have tax implications in your jurisdiction

Toilet Book will never ask for your private key or seed phrase. Anyone asking for your seed phrase claiming to be Toilet Book is a scammer.`,
  },
  {
    id: "9",
    title: "9. FLUSH Token Disclaimer",
    text: `FLUSH tokens are utility tokens designed for use within the Toilet Book ecosystem. They are not securities, investment contracts, or financial instruments. Holding FLUSH tokens does not represent:

• Ownership or equity in Toilet Book
• A right to profit sharing or dividends
• A guaranteed return on any investment

The value of FLUSH tokens, if any, is determined entirely by market forces after the DEX listing. Do not purchase or acquire FLUSH tokens with an expectation of financial return. Toilet Book makes no representation regarding the future value, liquidity, or exchangeability of FLUSH tokens.

Depending on your jurisdiction, receiving or trading cryptocurrency tokens may have tax implications. You are solely responsible for complying with applicable tax laws.`,
  },
  {
    id: "10",
    title: "10. Spotlight and Verified Business Listings",
    text: `Toilet Book offers paid Verified ($9/month) and Spotlight ($29/month) listing plans for venue owners and businesses. By purchasing a listing plan you agree that:

• You are the owner or authorised representative of the venue
• All information provided about your venue is accurate
• Toilet Book may verify your claim to the venue before activating paid features

Paid plans include the ability to respond to reviews and correct factual errors. Paid plans do not include the right to:
• Remove negative reviews or ratings
• Prevent legitimate community reviews
• Influence the content of community ratings

Community honesty is the foundation of Toilet Book. Plans are billed monthly. Cancel anytime by emailing toiletbookmain@gmail.com. Refunds are not provided for partial billing periods.

Toilet Book reserves the right to remove Spotlight or Verified status for venues that are found to be in violation of community standards or where false information was provided during verification.`,
  },
  {
    id: "11",
    title: "11. Flip Phone Interface",
    text: `Toilet Book provides a lightweight interface at toilet-book.com/flip.html optimised for basic mobile devices including flip phones. This interface provides the same core features (login, review posting, GPS, photo upload) as the main platform and is subject to all the same terms.

Reviews submitted via the flip phone interface are tagged with the source device and appear on the main platform map and feed alongside all other reviews. All content, GPS, and photo policies in these terms apply equally to flip phone submissions.`,
  },
  {
    id: "12",
    title: "12. PWA — Progressive Web App",
    text: `Toilet Book can be installed as a Progressive Web App on your device home screen. The PWA uses a service worker to cache content for offline use. By installing the PWA you agree that:

• The app may cache page content on your device
• Your login session may be stored in browser local storage
• Clearing browser data or uninstalling the PWA removes cached data

The PWA does not provide any additional features or terms beyond those of the standard web platform.`,
  },
  {
    id: "13",
    title: "13. Intellectual Property",
    text: `The Toilet Book name, logo, and branding are proprietary. You may not use our branding without written permission.

Content you post (reviews, photos) remains yours. By posting you grant us a licence to display it on our platform. OpenStreetMap data used in our maps is available under the Open Database Licence (ODbL) — see openstreetmap.org/copyright.

You may not scrape, copy, or redistribute Toilet Book content or our toilet location database for commercial purposes without our written permission.`,
  },
  {
    id: "14",
    title: "14. Disclaimer of Warranties",
    text: `Toilet Book is provided "as is" and "as available" without warranties of any kind. We do not guarantee:

• That toilet location data is accurate, up to date, or complete
• That any toilet listed on our platform is accessible, clean, safe, or open
• That GPS coordinates are precise
• That the platform will be available without interruption
• That FLUSH tokens will have any market value

Always verify toilet availability before relying on our data, especially for accessibility needs. Toilet Book is a community-generated resource — we are not responsible for the accuracy of user-submitted information.`,
  },
  {
    id: "15",
    title: "15. Limitation of Liability",
    text: `To the maximum extent permitted by applicable law, Toilet Book and its owner shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to: reliance on toilet location data, inability to find an accessible bathroom, loss of FLUSH tokens, or actions taken based on community-submitted reviews.

Our total liability to you for any claim arising from use of the platform shall not exceed the amount you have paid us in the twelve months preceding the claim, or $10, whichever is greater.`,
  },
  {
    id: "16",
    title: "16. Account Suspension and Termination",
    text: `We may suspend or terminate your account for:

• Violation of these Terms of Service
• Submitting false, misleading, or spam reviews
• Gaming the FLUSH points system through multiple accounts or automation
• Uploading prohibited content
• Harassing other users
• Any other behaviour we determine to be harmful to the community

On termination, your FLUSH points and whitelist registration are forfeited. Any FLUSH tokens already distributed to your wallet cannot be recalled.

You may delete your own account at any time by contacting toiletbookmain@gmail.com.`,
  },
  {
    id: "17",
    title: "17. Governing Law",
    text: `These Terms of Service are governed by the laws of the State of Florida, United States, without regard to conflict of law principles. Any disputes arising from these terms or your use of Toilet Book shall be resolved through binding arbitration in Brevard County, Florida, except where prohibited by law.

Nothing in these terms prevents you from filing a complaint with a consumer protection authority in your jurisdiction.`,
  },
  {
    id: "18",
    title: "18. Changes to These Terms",
    text: `We may update these Terms of Service at any time. Material changes will be communicated via email to registered users and a notice on the platform. Continued use of Toilet Book after updated terms are posted constitutes your acceptance of the new terms.`,
  },
  {
    id: "19",
    title: "19. Contact",
    text: `For questions about these terms:\n\nEmail: toiletbookmain@gmail.com\nWebsite: toilet-book.com/contact\n\nToilet Book · toilet-book.com · Cocoa, Florida, USA`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Terms of Service</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {LAST_UPDATED} · Effective immediately</p>

          {/* GPS consent callout */}
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold mb-1">📍 Location Data Notice</p>
            <p className="text-sm text-amber-600 dark:text-amber-500">
              By submitting a review with location enabled, you consent to your GPS coordinates being used in our global aggregate public restroom database. Do not submit location data for any location you do not want appearing on a public worldwide map.
            </p>
          </div>

          {/* Table of contents */}
          <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contents</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {SECTIONS.map(s => (
                <a key={s.id} href={`#section-${s.id}`}
                  className="text-xs text-sky-500 hover:text-sky-400 transition-colors py-0.5">
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(section => (
            <div key={section.id} id={`section-${section.id}`}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                {section.title}
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {section.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-4">Related policies</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/privacy"  className="text-sky-500 hover:text-sky-400 transition-colors">Privacy Policy →</Link>
            <Link href="/policies" className="text-sky-500 hover:text-sky-400 transition-colors">Platform Rules →</Link>
            <Link href="/contact"  className="text-sky-500 hover:text-sky-400 transition-colors">Contact Us →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
