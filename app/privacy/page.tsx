import { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, Eye, Trash2, Mail, FileText } from "lucide-react"

export const metadata: Metadata = { title: "Privacy Policy" }

const EFFECTIVE_DATE = "May 2026"
const CONTACT = "toiletbookmain@gmail.com"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🚽</span>
            <span>Toilet Book</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-400">Privacy Policy</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-sm text-slate-500">Effective: {EFFECTIVE_DATE} &nbsp;·&nbsp; toilet-book.com</p>
          <div className="mt-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300">
            Your privacy matters to us. We do not sell, rent, or trade your personal information to any third party. Full stop.
          </div>
        </div>

        <div className="space-y-10">

          <Section icon={<Eye className="h-4 w-4 text-sky-400" />} title="1. Information We Collect">
            <Sub title="Information you provide directly">
              {["Email address — used for account creation and login", "Username and display name — shown publicly on your profile and reviews", "Password — stored securely using industry-standard encryption; we never see your plain-text password", "Optional profile information — bio and website you choose to share", "Review content — photos, ratings, captions, location names, and addresses you submit"].map(i => <Bullet key={i}>{i}</Bullet>)}
            </Sub>
            <Sub title="Information collected automatically">
              {["Device and browser type — for technical compatibility", "IP address — for security and fraud prevention", "Usage data — pages visited, features used, time on site (anonymised)", "Cookies and local storage — for keeping you logged in and storing preferences"].map(i => <Bullet key={i}>{i}</Bullet>)}
            </Sub>
          </Section>

          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="2. How We Use Your Information">
            <P>We use your information exclusively to:</P>
            {["Create and manage your account", "Display your reviews and profile on the platform", "Calculate and display your FLUSH token balance", "Send transactional emails — account confirmation and password reset only", "Detect and prevent fraud, spam, and abuse", "Improve the platform&apos;s features and performance", "Comply with legal obligations"].map(i => <Bullet key={i} check>{i}</Bullet>)}
            <P>We do not use your information for advertising profiling, behavioural tracking, or any purpose not listed above.</P>
          </Section>

          <Section icon={<Lock className="h-4 w-4 text-emerald-400" />} title="3. We Do Not Sell Your Data">
            <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 px-4 py-4">
              <p className="text-sm text-emerald-300 font-medium mb-3">Our commitment to you:</p>
              {["We will never sell your personal information to any third party", "We will never rent your personal information to any third party", "We will never share your email address with advertisers", "We do not display advertising on the platform", "We do not build advertising profiles from your usage data"].map(i => <Bullet key={i} check color="emerald">{i}</Bullet>)}
            </div>
          </Section>

          <Section icon={<Shield className="h-4 w-4 text-sky-400" />} title="4. Third-Party Services">
            <P>To operate the platform we use the following trusted services. Each has its own privacy policy:</P>
            <div className="mt-3 space-y-2">
              {[
                { name:"Supabase",   role:"Database, authentication, and file storage" },
                { name:"Vercel",     role:"Hosting and content delivery" },
                { name:"UploadThing",role:"Photo upload processing" },
                { name:"OpenAI",     role:"AI image moderation (photos are not retained)" },
                { name:"Cloudflare", role:"DNS and domain services" },
              ].map(({ name, role }) => (
                <div key={name} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2.5">
                  <div><p className="text-sm font-medium text-white">{name}</p><p className="text-xs text-slate-500 mt-0.5">{role}</p></div>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<Eye className="h-4 w-4 text-amber-400" />} title="5. Public Content">
            <div className="rounded-xl bg-amber-500/8 border border-amber-500/25 px-4 py-3 text-sm text-amber-300 mb-3">
              Important: Your username, reviews, ratings, and photos are public by default. Anyone who visits toilet-book.com can see them.
            </div>
            <P>Do not include personal information — your own or anyone else&apos;s — in your reviews or photos. Do not post photos that contain identifiable people without their consent.</P>
          </Section>

          <Section icon={<Trash2 className="h-4 w-4 text-sky-400" />} title="6. Data Retention & Deletion">
            <P>We retain your account information for as long as your account is active. When you delete your account:</P>
            {["Your profile, username, and bio are permanently deleted", "Your reviews and photos are removed from public view", "Your email address is removed from our active user database", "Your FLUSH token balance is forfeited", "Certain anonymised data may be retained for legal compliance", "Backups may retain data for up to 90 days before full deletion"].map(i => <Bullet key={i}>{i}</Bullet>)}
            <P>To request account deletion, email <a href={`mailto:${CONTACT}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT}</a> with your username and account email.</P>
          </Section>

          <Section icon={<Lock className="h-4 w-4 text-emerald-400" />} title="7. Security">
            <P>We use encrypted connections (HTTPS), hashed password storage, and row-level security policies on our database. No system is perfectly secure. In the event of a data breach that affects your personal information we will notify affected users as required by applicable law.</P>
          </Section>

          <Section icon={<Shield className="h-4 w-4 text-sky-400" />} title="8. Children's Privacy">
            <P>Toilet Book is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account please contact <a href={`mailto:${CONTACT}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT}</a>.</P>
          </Section>

          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="9. Your Rights">
            <P>Depending on your location you may have the right to access, correct, or delete your personal information. To exercise any of these rights contact us at <a href={`mailto:${CONTACT}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT}</a>. We will respond within 30 days.</P>
          </Section>

          <Section icon={<FileText className="h-4 w-4 text-sky-400" />} title="10. Changes to This Policy">
            <P>We may update this Privacy Policy from time to time. We will notify registered users of material changes by email or a prominent notice on the platform. Continued use after changes constitutes acceptance.</P>
          </Section>

          <Section icon={<Mail className="h-4 w-4 text-sky-400" />} title="11. Contact Us">
            <P>For any privacy-related questions, requests, or concerns:</P>
            <div className="mt-3 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm space-y-1">
              <p className="text-white font-medium">Toilet Book</p>
              <p className="text-slate-400">toilet-book.com</p>
              <a href={`mailto:${CONTACT}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT}</a>
            </div>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Platform Rules & Policies</Link>
          <Link href="/terms"    className="hover:text-sky-400 transition-colors">Terms of Service</Link>
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

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-2"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>{children}</div>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
}

function Bullet({ children, check, color }: { children: React.ReactNode; check?: boolean; color?: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-slate-400 mt-1">
      <span className={`mt-0.5 flex-shrink-0 ${color === 'emerald' ? 'text-emerald-400' : check ? 'text-emerald-500' : 'text-slate-600'}`}>{check ? '✓' : '—'}</span>
      {children}
    </div>
  )
}
