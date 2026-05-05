import { Metadata } from "next"
import Link from "next/link"
import { Toilet, Shield, AlertTriangle, Copyright, Scale, FileText } from "lucide-react"

export const metadata: Metadata = { title: "Terms of Service" }

const EFFECTIVE_DATE = "May 5, 2026"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">

      {/* Header */}
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

        {/* Page title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-sky-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-sm text-slate-500">
            Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; toilet-book.com
          </p>
          <div className="mt-4 rounded-xl bg-sky-500/8 border border-sky-500/20 px-4 py-3 text-sm text-sky-300">
            By creating an account or using Toilet Book, you agree to these terms in full. Please read them carefully.
          </div>
        </div>

        <div className="space-y-10">

          {/* 1. Acceptance */}
          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="1. Acceptance of Terms">
            <P>These Terms of Service ("Terms") govern your access to and use of Toilet Book, operated at toilet-book.com ("we", "us", "our", or "the Platform"). By accessing or using the Platform in any way — including browsing, creating an account, posting content, or earning FLUSH tokens — you agree to be bound by these Terms.</P>
            <P>If you do not agree to these Terms, you must not use the Platform. We reserve the right to update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</P>
          </Section>

          {/* 2. Eligibility */}
          <Section icon={<Shield className="h-4 w-4 text-sky-400" />} title="2. Eligibility">
            <P>You must be at least 13 years of age to use Toilet Book. By using the Platform, you represent that you meet this requirement. If you are under 18, you represent that a parent or guardian has reviewed and agreed to these Terms on your behalf.</P>
          </Section>

          {/* 3. User Content */}
          <Section icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} title="3. User Content & Community Standards">
            <AlertBox>
              What you post on the internet can affect your future — professionally, socially, and legally. Think before you post. Toilet Book is a public platform. Content you share may be seen by employers, schools, family members, and the general public. Posts you believe are deleted may have already been seen, shared, or cached.
            </AlertBox>
            <P>You are solely responsible for all content you submit, post, or transmit through the Platform, including photographs, reviews, ratings, captions, and any other material ("User Content").</P>
            <P>You agree not to post content that:</P>
            <ul className="list-none space-y-2 mt-2">
              {[
                "Is illegal, defamatory, harassing, threatening, or abusive",
                "Contains nudity, sexual content, or graphic violence",
                "Depicts or encourages harm to any person or animal",
                "Is deliberately false, misleading, or fraudulent",
                "Infringes any third-party intellectual property rights",
                "Contains personal information of others without their consent",
                "Promotes discrimination based on race, gender, religion, nationality, disability, sexual orientation, or age",
                "Constitutes spam, phishing, or unauthorized commercial solicitation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
            <P>We reserve the right to remove any content that violates these standards, without notice, at our sole discretion.</P>
          </Section>

          {/* 4. Copyright & IP */}
          <Section icon={<Copyright className="h-4 w-4 text-sky-400" />} title="4. Intellectual Property & Copyright">
            <P>All content on the Toilet Book platform — including but not limited to the name "Toilet Book", the site design, logo, FLUSH token system, source code, graphics, and all original written content — is the exclusive intellectual property of toilet-book.com and its owner.</P>
            <P>By posting User Content on the Platform, you grant Toilet Book a worldwide, non-exclusive, royalty-free, perpetual license to use, reproduce, display, distribute, and create derivative works from your content for the purpose of operating and promoting the Platform.</P>
            <AlertBox color="amber">
              Any unauthorized copying, reproduction, redistribution, scraping, or commercial use of any content from toilet-book.com — in whole or in part — without express written permission is strictly prohibited. Any such reproduction shall be considered a forfeiture of all rights to that content to the owner of toilet-book.com, and may be subject to legal action.
            </AlertBox>
            <P>If you believe your copyright has been infringed on our Platform, please contact us at legal@toilet-book.com with details of the alleged infringement.</P>
          </Section>

          {/* 5. Disclaimer of Liability */}
          <Section icon={<Shield className="h-4 w-4 text-emerald-400" />} title="5. Disclaimer of Liability">
            <P>The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.</P>
            <P><strong className="text-white">To the fullest extent permitted by law, Toilet Book and its owner expressly disclaim all liability for:</strong></P>
            <ul className="list-none space-y-2 mt-2">
              {[
                "Any content posted by users, including reviews, photographs, ratings, or captions",
                "The accuracy, completeness, or usefulness of any user-submitted content",
                "Any decisions made in reliance on content found on the Platform",
                "Any harm, loss, or damage arising from use of or inability to use the Platform",
                "Any third-party venues, businesses, or locations referenced or reviewed on the Platform",
                "Any technical errors, downtime, data loss, or security breaches",
                "Any FLUSH token value fluctuations, losses, or failure to launch",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-slate-600 mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <P>Reviews on Toilet Book represent the personal opinions of individual users. We do not endorse, verify, or guarantee the accuracy of any review. Toilet Book is not responsible for the quality, safety, or condition of any restroom or venue featured on the Platform.</P>
          </Section>

          {/* 6. Limitation of Liability & Waiver */}
          <Section icon={<Scale className="h-4 w-4 text-sky-400" />} title="6. Limitation of Liability & Dispute Waiver">
            <AlertBox color="sky">
              By using this Platform, you agree that you will not bring any claim, lawsuit, or legal action against Toilet Book, its owner, operators, employees, or affiliates arising from your use of the Platform, the content posted by other users, or any decisions you make based on Platform content. This waiver applies to the maximum extent permitted by applicable law.
            </AlertBox>
            <P>In no event shall Toilet Book's total liability to you for any claim exceed the greater of (a) the amount you paid us in the twelve months prior to the claim, or (b) one hundred dollars ($100 USD).</P>
            <P>Some jurisdictions do not allow limitations on liability. In such jurisdictions, our liability is limited to the maximum extent permitted by law.</P>
          </Section>

          {/* 7. FLUSH Tokens */}
          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="7. FLUSH Token Points System">
            <P>FLUSH tokens are a points-based loyalty system awarded for activity on the Platform. They currently have no monetary value and are not redeemable for cash. Any future on-chain token conversion is subject to a separate token agreement and applicable laws at that time.</P>
            <P>We reserve the right to modify, suspend, or discontinue the FLUSH token program at any time without liability to you. Earned token balances are not guaranteed and may be forfeited if your account is terminated for violations of these Terms.</P>
          </Section>

          {/* 8. Account Termination */}
          <Section icon={<AlertTriangle className="h-4 w-4 text-red-400" />} title="8. Account Suspension & Termination">
            <P>We reserve the right to suspend or permanently terminate your account at any time, with or without notice, for any violation of these Terms or for any conduct we determine to be harmful to the Platform or its users. Upon termination, your right to use the Platform ceases immediately.</P>
            <P>You may delete your account at any time. Upon deletion, your profile and posts will be removed, though we may retain certain information as required by law or for legitimate business purposes.</P>
          </Section>

          {/* 9. Governing Law */}
          <Section icon={<Scale className="h-4 w-4 text-sky-400" />} title="9. Governing Law">
            <P>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the owner of toilet-book.com is domiciled, without regard to conflict of law principles. Any disputes not resolved by mutual agreement shall be subject to binding arbitration rather than litigation, to the extent permitted by applicable law.</P>
          </Section>

          {/* 10. Contact */}
          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="10. Contact">
            <P>For any questions about these Terms, please contact us at <span className="text-sky-400">legal@toilet-book.com</span>.</P>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-sky-400 transition-colors">Back to Toilet Book</Link>
        </div>

      </div>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      <div className="pl-0 space-y-3">{children}</div>
    </section>
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
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed my-3 ${styles[color]}`}>
      {children}
    </div>
  )
}
