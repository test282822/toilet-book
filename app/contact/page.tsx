import { Metadata } from "next"
import Link from "next/link"
import { Mail, MessageSquare, Shield, ShoppingBag, Accessibility, Flag } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us — Toilet Book",
  description: "Get in touch with the Toilet Book team for support, abuse reports, business enquiries, and more.",
}

const EMAIL = "toiletbookmain@gmail.com"

const TOPICS = [
  {
    icon: <MessageSquare className="h-5 w-5 text-sky-400" />,
    title: "General Support",
    desc: "Questions about the app, your account, or how things work.",
    subject: "General Support",
  },
  {
    icon: <Flag className="h-5 w-5 text-red-400" />,
    title: "Report Abuse or Content",
    desc: "Report a review, photo, or user that violates our community rules. We aim to respond to urgent reports within 24 hours.",
    subject: "Abuse Report",
  },
  {
    icon: <Shield className="h-5 w-5 text-amber-400" />,
    title: "Legal & Policy",
    desc: "Moderation appeals, legal enquiries, terms questions, or privacy requests.",
    subject: "Legal Enquiry",
  },
  {
    icon: <ShoppingBag className="h-5 w-5 text-violet-400" />,
    title: "Business & Partnerships",
    desc: "Claiming a venue listing, partnership enquiries, or press.",
    subject: "Business Enquiry",
  },
  {
    icon: <Accessibility className="h-5 w-5 text-emerald-400" />,
    title: "Accessibility Issues",
    desc: "Reporting an accessibility barrier in the app, or flagging incorrect facility data for a listing.",
    subject: "Accessibility Issue",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🚽</span>
            <span>Toilet Book</span>
          </Link>
          <span className="text-xs text-slate-500">Contact Us</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {/* Page title */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl bg-sky-500/10 flex items-center justify-center">
              <Mail className="h-7 w-7 text-sky-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            We&apos;re a small team building something we genuinely care about. Send us a message — we read every one.
          </p>
        </div>

        {/* Main email card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/20 p-6 mb-8 text-center">
          <p className="text-sm text-slate-400 mb-2">Reach us directly at</p>
          <a
            href={`mailto:${EMAIL}`}
            className="text-xl font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            {EMAIL}
          </a>
          <p className="text-xs text-slate-500 mt-3">
            We aim to respond within 5 business days · Urgent abuse reports within 24 hours
          </p>
        </div>

        {/* Topic cards */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-white mb-4">What are you reaching out about?</h2>
          <div className="space-y-3">
            {TOPICS.map(({ icon, title, desc, subject }) => (
              <a
                key={title}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject + " — Toilet Book")}`}
                className="flex items-start gap-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/60 px-4 py-4 transition-all group"
              >
                <div className="h-9 w-9 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center flex-shrink-0 transition-colors">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white mb-0.5">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
                <div className="text-slate-600 group-hover:text-sky-400 transition-colors mt-1 flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Response time note */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-4 text-sm text-slate-400 leading-relaxed">
          <p className="font-medium text-white mb-1">Before reaching out</p>
          <ul className="space-y-1.5 mt-2">
            {[
              "Check our Platform Rules at toilet-book.com/policies for answers to common questions about what is and isn't allowed",
              "For account issues — try signing out and back in, or use the password reset link on the login page",
              "For map pin issues — use the report button on the listing directly, it's the fastest route to a fix",
              "For FLUSH token balance issues — include your username in the email so we can look it up",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="text-slate-600 mt-0.5 flex-shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Platform Rules</Link>
          <Link href="/terms"    className="hover:text-sky-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy"  className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
          <Link href="/"         className="hover:text-sky-400 transition-colors">Back to Toilet Book</Link>
        </div>

      </div>
    </div>
  )
}
