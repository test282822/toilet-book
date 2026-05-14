"use client"
import { useState } from "react"
import { Copy, Check } from "lucide-react"
import toast from "react-hot-toast"

export function CopyReferralButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Referral link copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy — select and copy manually")
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 text-slate-400 hover:text-sky-500 transition-colors"
      aria-label="Copy referral link"
    >
      {copied
        ? <Check className="h-3.5 w-3.5 text-emerald-500" />
        : <Copy className="h-3.5 w-3.5" />
      }
    </button>
  )
}
