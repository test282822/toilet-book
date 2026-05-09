import { Metadata } from "next"
import Link from "next/link"
import { Scale, Shield, AlertTriangle, Copyright, FileText, Mail } from "lucide-react"

export const metadata: Metadata = { title: "Terms of Service" }

const EFFECTIVE_DATE = "May 2026"
const CONTACT = "toiletbookmain@gmail.com"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🚽</span>
            <span>Toilet Book</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-400">Terms of Service</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-sky-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-sm text-slate-500">Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; toilet-book.com</p>
          <div className="mt-4 rounded-xl bg-sky-500/8 border border-sky-500/20 px-4 py-3 text-sm text-sky-300">
            By creating an account or using Toilet Book you agree to these Terms in full. Please read them carefully.
          </div>
        </div>

        <div className="space-y-10">

          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="1. Acceptance of Terms">
            <P>These Terms of Service govern your access to and use of Toilet Book, operated at toilet-book.com. By accessing or using the platform in any way — including browsing, creating an account, posting content, or earning FLUSH tokens — you agree to be bound by these Terms and our <Link href="/policies" className="text-sky-400 hover:text-sky-300 transition-colors">Platform Rules & Policies</Link>.</P>
            <P>If you do not agree to these Terms, you must not use the platform. We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance.</P>
          </Section>

          <Section icon={<Shield className="h-4 w-4 text-sky-400" />} title="2. Eligibility">
            <P>You must be at least 13 years of age to use Toilet Book. By using the platform you represent that you meet this requirement. If you are under 18, you represent that a parent or guardian has reviewed and agreed to these Terms on your behalf.</P>
          </Section>

          <Section icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} title="3. User Content & Community Standards">
            <AlertBox color="amber">
              What you post on the internet can affect your future — professionally, socially, and legally. Think before you post. Toilet Book is a public platform. Content you share may be seen by employers, schools, family members, and the general public.
            </AlertBox>
            <P>You are solely responsible for all content you submit. Full community rules — including prohibited content, photo standards, and enforcement procedures — are set out in our <Link href="/policies" className="text-sky-400 hover:text-sky-300 transition-colors">Platform Rules & Policies</Link>. By posting content you confirm you have read and agree to those rules.</P>
          </Section>

          <Section icon={<Copyright className="h-4 w-4 text-sky-400" />} title="4. Intellectual Property & Copyright">
            <P>All original content on the Toilet Book platform — including the name, design, FLUSH token system, source code, and written content — is the exclusive intellectual property of toilet-book.com and its owner.</P>
            <P>By posting User Content you grant Toilet Book a worldwide, non-exclusive, royalty-free, perpetual licence to use, reproduce, display, and distribute your content for the purpose of operating and promoting the platform.</P>
            <AlertBox color="amber">
              Any unauthorised copying, reproduction, redistribution, or commercial use of content from toilet-book.com is strictly prohibited. Any such reproduction shall be considered a forfeiture of all rights to that content to the owner of toilet-book.com and may be subject to legal action.
            </AlertBox>
          </Section>

          <Section icon={<Shield className="h-4 w-4 text-emerald-400" />} title="5. Disclaimer of Liability">
            <P>The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, Toilet Book disclaims all liability for:</P>
            <ul className="space-y-1.5 mt-2">
              {[
                "Any user-submitted content including reviews, photos, ratings, or captions",
                "The accuracy or completeness of any user-submitted content",
                "Any decisions made in reliance on content found on the platform",
                "Any harm, loss, or damage arising from use or inability to use the platform",
                "Any third-party venues or businesses referenced or reviewed on the platform",
                "Technical errors, downtime, data loss, or security breaches",
                "FLUSH token value fluctuations, losses, or failure to launch",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-slate-600 mt-0.5 flex-shrink-0">—</span>{item}
                </li>
              ))}
            </ul>
            <P>Reviews represent personal opinions of individual users. We do not endorse or verify the accuracy of any review.</P>
          </Section>

          <Section icon={<Scale className="h-4 w-4 text-sky-400" />} title="6. Limitation of Liability & Dispute Waiver">
            <AlertBox color="sky">
              By using this platform you agree that you will not bring any claim, lawsuit, or legal action against Toilet Book, its owner, operators, or affiliates arising from your use of the platform, content posted by other users, or any decisions you make based on platform content. This waiver applies to the maximum extent permitted by applicable law.
            </AlertBox>
            <P>In no event shall Toilet Book&apos;s total liability to you exceed the greater of (a) the amount you paid us in the twelve months prior to the claim, or (b) one hundred US dollars ($100).</P>
          </Section>

          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="7. FLUSH Token Points System">
            <P>FLUSH tokens are a points-based loyalty system with no current monetary value and are not redeemable for cash. Any future on-chain token conversion is subject to a separate token agreement. We reserve the right to modify or discontinue the FLUSH program at any time.</P>
          </Section>

          <Section icon={<AlertTriangle className="h-4 w-4 text-red-400" />} title="8. Account Suspension & Termination">
            <P>We reserve the right to suspend or terminate your account at any time for any violation of these Terms or our Platform Rules. Upon termination your right to use the platform ceases immediately and your FLUSH token balance is forfeited.</P>
          </Section>

          <Section icon={<Scale className="h-4 w-4 text-sky-400" />} title="9. Governing Law">
            <P>These Terms are governed by the laws of the jurisdiction in which the owner of toilet-book.com is domiciled. Any disputes not resolved by mutual agreement shall be subject to binding arbitration rather than litigation, to the extent permitted by applicable law.</P>
          </Section>

          <Section icon={<Mail className="h-4 w-4 text-sky-400" />} title="10. Contact">
            <P>For any questions about these Terms:</P>
            <div className="mt-3 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm space-y-1">
              <p className="text-white font-medium">Toilet Book</p>
              <p className="text-slate-400">toilet-book.com</p>
              <a href={`mailto:${CONTACT}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT}</a>
            </div>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Platform Rules & Policies</Link>
          <Link href="/privacy"  className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
          <Link href="/"         className="hover:text-sky-400 transition-colors">Back to Toilet Book</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">{icon}</div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
}

function AlertBox({ children, color = "sky" }: { children: React.ReactNode; color?: "sky" | "amber" }) {
  const s = { sky:"bg-sky-500/8 border-sky-500/25 text-sky-300", amber:"bg-amber-500/8 border-amber-500/25 text-amber-300" }
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${s[color]}`}>{children}</div>
}
