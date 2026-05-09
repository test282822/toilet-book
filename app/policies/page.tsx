import { Metadata } from "next"
import Link from "next/link"
import {
  Shield, AlertTriangle, Scale, FileText,
  Mail, Ban, Accessibility, Users, Eye,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Platform Rules & Policies",
  description: "Toilet Book platform rules, community standards, liability release, and misuse policy.",
}

const CONTACT = "toiletbookmain@gmail.com"
const EFFECTIVE = "May 2026"

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">

      {/* Sticky header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🚽</span>
            <span>Toilet Book</span>
          </Link>
          <span className="text-xs text-slate-500">Platform Rules & Policies</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {/* Page title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-sky-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Platform Rules & Policies</h1>
          </div>
          <p className="text-sm text-slate-500">
            Effective: {EFFECTIVE} &nbsp;·&nbsp; toilet-book.com &nbsp;·&nbsp; All users and visitors are bound by these rules.
          </p>
          <div className="mt-4 rounded-xl bg-sky-500/8 border border-sky-500/20 px-4 py-3 text-sm text-sky-300 leading-relaxed">
            By accessing, using, or browsing Toilet Book in any way you agree to every rule and policy on this page in full. If you do not agree, do not use the platform.
          </div>
        </div>

        <div className="space-y-12">

          {/* ── 1. COMMUNITY RULES ───────────────────────────────────── */}
          <Section icon={<Users className="h-4 w-4 text-sky-400" />} title="1. Community Rules">
            <P>Toilet Book is a community platform built on honest, good-faith contributions. The following rules apply to every piece of content submitted to the platform — reviews, photos, captions, ratings, usernames, and any other user-generated material.</P>

            <Sub title="1.1  What You May Post">
              <P>You may post honest first-hand reviews of bathrooms and restrooms you have personally visited. You may post photographs of toilet and bathroom facilities. You may rate, comment on, and interact with other users&apos; reviews in good faith.</P>
            </Sub>

            <Sub title="1.2  What Is Prohibited">
              <P>The following content is strictly prohibited and will be removed without notice:</P>
              <ul className="space-y-2 mt-2">
                {[
                  "NSFW, sexually explicit, or adult content of any kind — every uploaded photo is checked by our AI moderation system before it is published",
                  "Photos that include identifiable people — photographs must show the facility, not individuals",
                  "Doxxing — sharing any personally identifiable information about another person without their explicit consent, including names, addresses, phone numbers, or employer details",
                  "Hate speech, slurs, or content that targets or demeans any person or group based on race, gender, religion, nationality, disability, sexual orientation, age, or any other characteristic",
                  "Deliberately false reviews, fake ratings, or reviews submitted for venues the user has never visited",
                  "Spam, duplicate submissions, or content designed to manipulate aggregate scores",
                  "Content that impersonates another person, business, or public figure",
                  "Commercial advertising, affiliate links, or promotional content in reviews",
                  "Reviews submitted for the purpose of harassing or retaliating against a specific person or business",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <Ban className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Sub>

            <Sub title="1.3  Enforcement">
              <P>Violations of these rules may result in content removal, temporary suspension (1–30 days), or permanent account termination depending on severity. Repeat violations are treated more seriously than first-time violations. FLUSH token balances are forfeited upon account termination for rule violations.</P>
              <P>Users who believe a moderation action was made in error may appeal by emailing <EmailLink />.</P>
            </Sub>
          </Section>

          {/* ── 2. RELEASE OF LIABILITY ──────────────────────────────── */}
          <Section icon={<Scale className="h-4 w-4 text-amber-400" />} title="2. Release of Liability">

            <AlertBox color="amber">
              By operating this service we provide a platform for community-generated information. By using Toilet Book you release us from liability to the fullest extent permitted by applicable law. Read this section carefully.
            </AlertBox>

            <Sub title="2.1  No Guarantee of Accuracy or Cleanliness">
              <P>Toilet Book does not guarantee the cleanliness, safety, availability, hygiene, or condition of any restroom listed or reviewed on the platform. All ratings and reviews represent the personal opinions of individual users at a specific moment in time. Conditions at any venue may have changed since a review was written.</P>
              <P>You agree not to rely solely on Toilet Book for medical, hygiene, safety, or accessibility decisions. The platform provides community-sourced information as a convenience — not as a guarantee, professional advice, or factual certification.</P>
            </Sub>

            <Sub title="2.2  Accessibility Data">
              <P>While we make every effort to present accurate accessibility information — including adult changing stations, family bathrooms, and gender-neutral facilities — all such data is user-submitted and may be incorrect, incomplete, or outdated. Users with specific accessibility requirements must independently verify facilities before travel. Toilet Book accepts no liability for any harm arising from reliance on accessibility data shown on the platform.</P>
            </Sub>

            <Sub title="2.3  Release from Subjective and Emotional Claims">
              <P>Toilet Book hosts honest reviews of public and private restrooms. These reviews may include negative ratings, unflattering descriptions, low scores, or opinions that a business or individual finds objectionable or uncomfortable. You expressly acknowledge and agree that:</P>
              <ul className="space-y-2 mt-2">
                {[
                  "Exposure to negative, critical, or unflattering content about a venue does not constitute harm for which Toilet Book bears liability",
                  "Toilet Book is not liable for any emotional distress, reputational discomfort, or subjective offence caused by reviews that comply with our community rules",
                  "A lawful, good-faith review of a restroom — however negative — is protected user speech and does not constitute an actionable wrong against the venue",
                  "We do not remove reviews simply because the subject of the review finds them upsetting, embarrassing, or commercially inconvenient",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Sub>

            <Sub title="2.4  Third-Party Venues and Map Data">
              <P>Toilet Book has no affiliation with any venue listed on the platform. Listing a venue does not constitute an endorsement. Map data is sourced from OpenStreetMap and user submissions — we do not guarantee the accuracy of location coordinates, venue names, or opening hours. We accept no responsibility for any experience at a listed venue.</P>
            </Sub>

            <Sub title="2.5  Platform Availability">
              <P>Toilet Book is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee uninterrupted availability of the platform. We are not liable for any loss or inconvenience caused by downtime, data unavailability, or service interruption.</P>
            </Sub>

            <Sub title="2.6  Maximum Liability">
              <P>To the maximum extent permitted by law, Toilet Book&apos;s total liability to you for any claim arising from use of the platform shall not exceed one hundred US dollars ($100). In no event shall we be liable for indirect, incidental, consequential, or punitive damages.</P>
            </Sub>
          </Section>

          {/* ── 3. MISUSE OF THE PLATFORM ───────────────────────────── */}
          <Section icon={<AlertTriangle className="h-4 w-4 text-red-400" />} title="3. Misuse of the Platform">
            <P>The following constitutes misuse of Toilet Book and may result in immediate account termination, legal referral, or both.</P>

            <Sub title="3.1  Technical Misuse">
              <ul className="space-y-2 mt-2">
                {[
                  "Scraping, crawling, or harvesting data from Toilet Book without our written permission",
                  "Attempting to reverse-engineer, decompile, or extract the source code of the platform",
                  "Submitting automated requests, bots, or scripts to the platform without authorisation",
                  "Attempting to gain unauthorised access to any account, database, or system resource",
                  "Interfering with or disrupting the integrity or performance of the platform or its infrastructure",
                  "Exploiting any bug, vulnerability, or error in the platform for personal gain — report vulnerabilities to us instead",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <Ban className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Sub>

            <Sub title="3.2  Review Manipulation">
              <ul className="space-y-2 mt-2">
                {[
                  "Creating multiple accounts to submit duplicate reviews for the same venue",
                  "Incentivising, paying, or coercing other users to submit positive reviews of your venue",
                  "Coordinating with others to mass-report reviews you dislike in order to have them removed",
                  "Submitting fake reviews for venues you own, manage, or have a commercial interest in",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <Ban className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Sub>

            <Sub title="3.3  FLUSH Token Misuse">
              <ul className="space-y-2 mt-2">
                {[
                  "Submitting fake reviews solely to accumulate FLUSH token points",
                  "Exploiting any bug in the token reward system to accumulate unearned points",
                  "Attempting to sell, transfer, or exchange FLUSH tokens outside of any official mechanism we provide",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <Ban className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Sub>

            <Sub title="3.4  Legal Misuse">
              <P>You may not use Toilet Book to commit, facilitate, or conceal any illegal act. You may not use the platform to defame, harass, stalk, or threaten any individual. Any attempt to use legal threats, cease-and-desist letters, or litigation to coerce us into removing lawful content will be treated as misuse and logged. We do not remove lawful content in response to legal threats unless served with a valid court order from a jurisdiction in which we operate.</P>
            </Sub>
          </Section>

          {/* ── 4. ACCESSIBILITY COMMITMENT ─────────────────────────── */}
          <Section icon={<Accessibility className="h-4 w-4 text-emerald-400" />} title="4. Accessibility Commitment">
            <P>Toilet Book exists specifically to help people find accessible restrooms. It would be contradictory for that platform to be inaccessible itself.</P>
            <P>We target WCAG 2.1 Level AA compliance across all public-facing pages. This means keyboard navigation, screen reader compatibility, sufficient colour contrast, descriptive alt text on images, and accessible form controls throughout the app.</P>
            <P>Accessibility data submitted by users — wheelchair access, adult changing stations, family bathrooms, gender-neutral facilities — is treated as high-priority data. Incorrect accessibility data can cause real harm. If you encounter inaccurate accessibility information, please flag it using the report button on the listing or contact us directly at <EmailLink />.</P>
            <P>Known accessibility issues in the platform are tracked and prioritised in our development backlog. We welcome accessibility feedback.</P>
          </Section>

          {/* ── 5. CONTENT MODERATION ───────────────────────────────── */}
          <Section icon={<Eye className="h-4 w-4 text-sky-400" />} title="5. Content Moderation">
            <Sub title="5.1  Photo Moderation">
              <P>Every photo submitted to Toilet Book is screened by our AI moderation system before it appears publicly. Photos are checked to confirm they depict a toilet or bathroom facility and do not contain NSFW content or identifiable individuals. Photos that fail moderation are rejected at upload with a clear explanation. Repeatedly submitting rejected content may result in upload privileges being revoked.</P>
            </Sub>
            <Sub title="5.2  Review Moderation">
              <P>Written reviews are subject to community reporting. Reported content is reviewed within 72 hours. Content that clearly violates our rules — doxxing, threats, NSFW text — is reviewed immediately. Moderation decisions are made at our sole discretion.</P>
            </Sub>
            <Sub title="5.3  Businesses">
              <P>Businesses may not request removal of reviews simply because they are negative or commercially inconvenient. We accept removal requests only where a review contains demonstrably false factual claims, personal information, or clear rule violations. We do not accept payment for review removal under any circumstances.</P>
            </Sub>
          </Section>

          {/* ── 6. INTELLECTUAL PROPERTY ────────────────────────────── */}
          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="6. Intellectual Property">
            <P>All original content on the Toilet Book platform — including the name &quot;Toilet Book&quot;, the design, FLUSH token system, source code, and original written content — is the exclusive intellectual property of toilet-book.com and its owner.</P>
            <P>By posting content on Toilet Book, you grant us a worldwide, non-exclusive, royalty-free, perpetual licence to use, display, reproduce, and distribute your content for the purpose of operating and promoting the platform.</P>
            <AlertBox color="amber">
              Any unauthorised copying, reproduction, scraping, or commercial use of content from toilet-book.com is strictly prohibited. Any such reproduction is considered a forfeiture of all rights to that content to the owner of toilet-book.com and may be subject to legal action.
            </AlertBox>
          </Section>

          {/* ── 7. CONTACT ──────────────────────────────────────────── */}
          <Section icon={<Mail className="h-4 w-4 text-sky-400" />} title="7. Contact & Reports">
            <P>For all policy-related enquiries, abuse reports, accessibility issues, business claims, or appeals:</P>
            <div className="mt-4 rounded-xl bg-slate-900 border border-slate-800 px-4 py-4">
              <p className="text-white font-medium mb-1">Toilet Book</p>
              <p className="text-slate-400 text-sm mb-1">toilet-book.com</p>
              <a href={`mailto:${CONTACT}`} className="text-sky-400 text-sm hover:text-sky-300 transition-colors font-medium">
                {CONTACT}
              </a>
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                {[
                  ["Abuse & moderation appeals", CONTACT],
                  ["Accessibility issues",       CONTACT],
                  ["Business claims",            CONTACT],
                  ["Legal enquiries",            CONTACT],
                  ["Privacy requests",           CONTACT],
                ].map(([label, email]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <a href={`mailto:${email}`} className="text-sky-500 hover:text-sky-400">{email}</a>
                  </div>
                ))}
              </div>
            </div>
            <P>We aim to respond to all enquiries within 5 business days. For urgent safety or doxxing issues we aim to respond within 24 hours.</P>
          </Section>

          {/* ── 8. CHANGES ──────────────────────────────────────────── */}
          <Section icon={<FileText className="h-4 w-4 text-slate-400" />} title="8. Changes to These Policies">
            <P>We reserve the right to update these policies at any time. Significant changes will be communicated via a notice on the platform. Continued use of Toilet Book after a policy update constitutes acceptance of the revised policies. The effective date at the top of this page reflects the date of the most recent revision.</P>
          </Section>

        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/terms"   className="hover:text-sky-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
          <Link href="/"        className="hover:text-sky-400 transition-colors">Back to Toilet Book</Link>
        </div>

      </div>
    </div>
  )
}

// ── Reusable components ───────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4 pl-0">{children}</div>
    </section>
  )
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      {children}
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
}

function AlertBox({ children, color = "sky" }: { children: React.ReactNode; color?: "sky" | "amber" | "red" }) {
  const styles = {
    sky:   "bg-sky-500/8 border-sky-500/25 text-sky-300",
    amber: "bg-amber-500/8 border-amber-500/25 text-amber-300",
    red:   "bg-red-500/8 border-red-500/25 text-red-300",
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  )
}

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT}`} className="text-sky-400 hover:text-sky-300 transition-colors">
      {CONTACT}
    </a>
  )
}
