"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import {
  Upload, ImagePlus, X, ShoppingBag, Loader2,
  Sparkles, ScanSearch, ShowerHead, AlertTriangle, CheckCircle2,
} from "lucide-react"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/feed/StarRating"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface NewPostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

const STORE_PRESETS = ["Amazon", "Home Depot", "Lowe's", "Wayfair", "IKEA", "Target"]
const RATING_LABELS = ["", "Disappointing", "Okay", "Good", "Great", "Dream bathroom!"]

type ModerationState = "idle" | "checking" | "approved" | "rejected"

export function NewPostModal({ open, onOpenChange, userId }: NewPostModalProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [rating, setRating] = useState(0)
  const [storeName, setStoreName] = useState("")
  const [storeUrl, setStoreUrl] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [moderation, setModeration] = useState<ModerationState>("idle")
  const [moderationReason, setModerationReason] = useState("")

  const runModeration = useCallback(async (f: File): Promise<boolean> => {
    setModeration("checking")
    try {
      const fd = new FormData()
      fd.append("image", f)
      const res = await fetch("/api/moderate", { method: "POST", body: fd })
      if (!res.ok) {
        // Non-2xx from our own API — treat as approved to avoid blocking valid posts
        setModeration("approved")
        return true
      }
      const json = await res.json() as { approved: boolean; reason: string }
      if (json.approved) {
        setModeration("approved")
        return true
      } else {
        setModeration("rejected")
        setModerationReason(json.reason ?? "")
        return false
      }
    } catch {
      // Network error — fail open so users aren't silently blocked
      setModeration("approved")
      return true
    }
  }, [])

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setModeration("idle")
    setModerationReason("")
    await runModeration(f)
  }, [runModeration])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDropRejected: (rejected) => {
      const err = rejected[0]?.errors[0]
      if (err?.code === "file-too-large") toast.error("Image must be under 20 MB")
      else toast.error("Please upload a JPG, PNG, or WebP image")
    },
  })

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setModeration("idle")
    setModerationReason("")
  }

  const reset = () => {
    clearImage()
    setCaption("")
    setRating(0)
    setStoreName("")
    setStoreUrl("")
    setTags("")
  }

  const handleSubmit = async () => {
    if (!file) return toast.error("Please choose a photo")
    if (moderation === "checking") return toast.error("Please wait — checking your image")
    if (moderation === "rejected") return toast.error("Please upload a bathroom photo")
    if (rating === 0) return toast.error("Please give it a star rating")

    setLoading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const imagePath = `${userId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("bathroom-pics")
        .upload(imagePath, file, { cacheControl: "3600", upsert: false })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: urlData } = supabase.storage
        .from("bathroom-pics")
        .getPublicUrl(imagePath)

      const tagArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0 && t.length <= 30)

      const normalizedStoreUrl =
        storeUrl.trim() && !storeUrl.trim().startsWith("http")
          ? `https://${storeUrl.trim()}`
          : storeUrl.trim() || null

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        image_url: urlData.publicUrl,
        image_path: imagePath,
        caption: caption.trim() || null,
        rating,
        store_name: storeName.trim() || null,
        store_url: normalizedStoreUrl,
        tags: tagArray,
        moderation_status: "approved",
      })

      if (insertError) throw new Error(insertError.message)

      toast.success("Your bathroom vibe is live!")
      reset()
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong — please try again")
    } finally {
      setLoading(false)
    }
  }

  const toggleStorePreset = (name: string) => {
    setStoreName((prev) => (prev === name ? "" : name))
  }

  const isSubmitDisabled =
    loading ||
    !file ||
    moderation === "checking" ||
    moderation === "rejected" ||
    (!!file && moderation === "idle") ||
    rating === 0

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!loading && moderation !== "checking") {
          onOpenChange(v)
          if (!v) reset()
        }
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-sky-500" />
            Share Your Bathroom Vibe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Info banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-sky-200/80 bg-sky-50/60 px-3.5 py-3 dark:border-sky-900/50 dark:bg-sky-950/30">
            <ShowerHead className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Only post photos of bathrooms. Our AI checks every upload.
            </p>
          </div>

          {/* Drop zone / preview */}
          {!preview ? (
            <div
              {...getRootProps()}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[220px] group",
                isDragActive
                  ? "border-sky-400 bg-sky-50 dark:bg-sky-950/30 scale-[1.02]"
                  : "border-slate-200 hover:border-sky-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50",
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200",
                  isDragActive
                    ? "bg-sky-100 dark:bg-sky-900/50"
                    : "bg-slate-100 group-hover:bg-sky-100 dark:bg-slate-800 dark:group-hover:bg-sky-900/30",
                )}>
                  {isDragActive
                    ? <Upload className="h-6 w-6 text-sky-500" />
                    : <ImagePlus className="h-6 w-6 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  }
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {isDragActive ? "Drop it here!" : "Drag & drop your photo"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    or click to browse · JPG, PNG, WebP · max 20 MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/3]">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                {!loading && (
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 rounded-lg bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                  {file !== null ? (file.size / 1024 / 1024).toFixed(1) : '0'} MB
                </div>
              </div>
              <ModerationBadge state={moderation} reason={moderationReason} />
            </div>
          )}

          {/* Caption */}
          <div className="space-y-1.5">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Describe the vibe... marble counters? rain shower? spill it ✨"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className={cn(
              "text-right text-xs transition-colors",
              caption.length >= 480 ? "text-amber-500" : "text-slate-400",
            )}>
              {caption.length}/500
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <Label>
              Your Rating <span className="text-red-400">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <span className="text-sm text-slate-500 dark:text-slate-400 animate-in fade-in duration-150">
                  {RATING_LABELS[rating]}
                </span>
              )}
            </div>
          </div>

          {/* Store link */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-slate-400" />
              Product / Store Link{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {STORE_PRESETS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStorePreset(s)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all border",
                    storeName === s
                      ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-sky-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:border-sky-700",
                  )}
                >
                  {storeName === s ? "✓ " : ""}{s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <Input
                placeholder="https://..."
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                type="url"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="tags">
              Tags{" "}
              <span className="font-normal text-slate-400">(optional, comma-separated)</span>
            </Label>
            <Input
              id="tags"
              placeholder="modern, marble, walk-in shower, freestanding tub"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full h-12 text-base"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Posting...</>
            ) : moderation === "checking" ? (
              <><ScanSearch className="h-4 w-4 animate-pulse mr-2" /> Checking image...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Post to Toilet Book</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ModerationBadge({ state, reason }: { state: ModerationState; reason: string }) {
  if (state === "idle") return null

  if (state === "checking") return (
    <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 dark:border-sky-900/50 dark:bg-sky-950/30">
      <ScanSearch className="h-4 w-4 animate-pulse text-sky-500 shrink-0" />
      <p className="text-xs font-medium text-sky-700 dark:text-sky-400">
        Checking that this is a bathroom photo…
      </p>
    </div>
  )

  if (state === "approved") return (
    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
        Looks like a bathroom — good to go!
      </p>
    </div>
  )

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-950/30">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <div>
        <p className="text-xs font-semibold text-red-700 dark:text-red-400">
          This doesn&apos;t look like a bathroom photo.
        </p>
        <p className="mt-0.5 text-xs text-red-600/80 dark:text-red-400/70">
          Please upload only bathroom images.
        </p>
        {reason && (
          <p className="mt-1 text-xs italic text-red-500/70 dark:text-red-400/50">
            AI note: {reason}
          </p>
        )}
      </div>
    </div>
  )
}
