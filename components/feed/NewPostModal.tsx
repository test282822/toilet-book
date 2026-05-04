"use client"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import {
  Upload, ImagePlus, X, Loader2,
  Sparkles, ShowerHead, AlertTriangle,
  Accessibility, Users, MapPin, ShoppingBag, Link,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

const RATING_LABELS = ["", "Disgusting 🤢", "Not great", "Decent", "Pretty clean!", "Spotless! 🏆"]

type ModerationState = "idle" | "checking" | "approved" | "rejected"

export function NewPostModal({ open, onOpenChange, userId }: NewPostModalProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [rating, setRating] = useState(0)
  const [storeName, setStoreName] = useState("")
  const [storeUrl, setStoreUrl] = useState("")
  const [address, setAddress] = useState("")
  const [googleMapsUrl, setGoogleMapsUrl] = useState("")
  const [hasAdultChangingStation, setHasAdultChangingStation] = useState(false)
  const [isFamilyFriendly, setIsFamilyFriendly] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [moderation, setModeration] = useState<ModerationState>("idle")
  const [moderationReason, setModerationReason] = useState("")

  const runModeration = useCallback(async (f: File): Promise<boolean> => {
    setModeration("checking")
    try {
      const fd = new FormData()
      fd.append("image", f)
      const res = await fetch("/api/moderate", { method: "POST", body: fd })
      const json = await res.json() as { approved: boolean; reason: string }
      if (json.approved) { setModeration("approved"); return true }
      else { setModeration("rejected"); setModerationReason(json.reason ?? ""); return false }
    } catch {
      setModeration("approved"); return true
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
    onDropRejected: () => toast.error("Image must be under 20 MB"),
  })

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null); setPreview(null)
    setModeration("idle"); setModerationReason("")
  }

  const reset = () => {
    clearImage()
    setCaption(""); setRating(0)
    setStoreName(""); setStoreUrl("")
    setAddress(""); setGoogleMapsUrl("")
    setHasAdultChangingStation(false); setIsFamilyFriendly(null)
  }

  const handleSubmit = async () => {
    if (!file) return toast.error("Please choose a photo")
    if (rating === 0) return toast.error("Please add a star rating")
    if (moderation === "rejected") return toast.error("Please upload a toilet photo")
    if (moderation === "checking") return toast.error("Please wait — checking your photo")

    // basic URL validation if provided
    if (storeUrl && !storeUrl.startsWith("http")) return toast.error("Store URL must start with http:// or https://")
    if (googleMapsUrl && !googleMapsUrl.startsWith("http")) return toast.error("Google Maps URL must start with http:// or https://")

    setLoading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() || "jpg"
      const imagePath = `${userId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("bathroom-pics")
        .upload(imagePath, file, { cacheControl: "3600", upsert: false })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("bathroom-pics").getPublicUrl(imagePath)

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        image_url: urlData.publicUrl,
        image_path: imagePath,
        caption: caption.trim() || null,
        rating,
        store_name: storeName.trim() || null,
        store_url: storeUrl.trim() || null,
        address: address.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
        tags: [],
        moderation_status: "approved",
        has_adult_changing_station: hasAdultChangingStation,
        is_family_friendly: isFamilyFriendly,
      })
      if (insertError) throw insertError

      toast.success("Your toilet review is live! 🚽")
      reset()
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const isSubmitDisabled =
    loading || !file || rating === 0 || moderation === "checking" || moderation === "rejected"

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!loading && moderation !== "checking") { onOpenChange(v); if (!v) reset() }
    }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-sky-500" />
            Rate This Toilet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          {/* info banner */}
          <div className="flex items-start gap-2.5 rounded-xl border border-sky-200/80 bg-sky-50/60 px-3.5 py-3 dark:border-sky-900/50 dark:bg-sky-950/30">
            <ShowerHead className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Only post photos of toilets or bathrooms. Our AI checks every upload.
            </p>
          </div>

          {/* ── Photo drop zone ── */}
          {!preview ? (
            <div {...getRootProps()} className={cn(
              "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[200px] group",
              isDragActive
                ? "border-sky-400 bg-sky-50 dark:bg-sky-950/30 scale-[1.02]"
                : "border-slate-200 hover:border-sky-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50",
            )}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200",
                  isDragActive ? "bg-sky-100 dark:bg-sky-900/50" : "bg-slate-100 group-hover:bg-sky-50 dark:bg-slate-800",
                )}>
                  <ImagePlus className={cn("h-6 w-6 transition-colors", isDragActive ? "text-sky-500" : "text-slate-400 group-hover:text-sky-400")} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {isDragActive ? "Drop your photo here" : "Upload a toilet photo"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP · Max 20 MB</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-medium text-white">
                  <Upload className="h-3.5 w-3.5" />
                  Choose photo
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <Image src={preview} alt="Preview" width={600} height={400} className="w-full object-cover max-h-64" />
              <button onClick={clearImage} className="absolute top-2 right-2 rounded-lg bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors">
                <X className="h-4 w-4" />
              </button>
              {moderation === "checking" && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs text-white">
                  <Loader2 className="h-3 w-3 animate-spin" />Checking photo...
                </div>
              )}
              {moderation === "approved" && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-2.5 py-1.5 text-xs text-white">
                  ✓ Photo approved
                </div>
              )}
              {moderation === "rejected" && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-red-500/90 px-2.5 py-1.5 text-xs text-white">
                  <AlertTriangle className="h-3 w-3" />
                  {moderationReason || "Please upload a toilet photo"}
                </div>
              )}
            </div>
          )}

          {/* ── Star rating ── */}
          <div className="space-y-2">
            <Label>Overall Cleanliness Rating</Label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <span className="text-sm text-slate-500 dark:text-slate-400">{RATING_LABELS[rating]}</span>
              )}
            </div>
          </div>

          {/* ── Location section ── */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-sky-500" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Location Details</p>
              <span className="text-xs text-slate-400">(optional)</span>
            </div>

            {/* Venue / store name */}
            <div className="space-y-1.5">
              <Label htmlFor="storeName" className="text-xs text-slate-500">Venue or business name</Label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="storeName"
                  placeholder="e.g. McDonald's Times Square, JFK Terminal B"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs text-slate-500">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="address"
                  placeholder="e.g. 123 Main St, New York, NY 10001"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>

            {/* Google Maps link */}
            <div className="space-y-1.5">
              <Label htmlFor="googleMapsUrl" className="text-xs text-slate-500">Google Maps link</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="googleMapsUrl"
                  placeholder="https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
              <p className="text-xs text-slate-400">Open Google Maps → Share → Copy link → paste here</p>
            </div>

            {/* Website / store URL */}
            <div className="space-y-1.5">
              <Label htmlFor="storeUrl" className="text-xs text-slate-500">Venue website (optional)</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="storeUrl"
                  placeholder="https://example.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* ── Adult Changing Station ── */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <button
              type="button"
              onClick={() => setHasAdultChangingStation(!hasAdultChangingStation)}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={cn(
                "h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150",
                hasAdultChangingStation
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-slate-300 dark:border-slate-600 group-hover:border-emerald-400",
              )}>
                {hasAdultChangingStation && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Accessibility className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Has Adult Changing Station</p>
                  <p className="text-xs text-slate-400 mt-0.5">Adult-sized changing table available</p>
                </div>
              </div>
            </button>
          </div>

          {/* ── Family Friendly ── */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Would you bring your family here?</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsFamilyFriendly(isFamilyFriendly === true ? null : true)}
                className={cn(
                  "flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-all duration-150",
                  isFamilyFriendly === true
                    ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-sky-300",
                )}
              >
                👨‍👩‍👧  Yes
              </button>
              <button
                type="button"
                onClick={() => setIsFamilyFriendly(isFamilyFriendly === false ? null : false)}
                className={cn(
                  "flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-all duration-150",
                  isFamilyFriendly === false
                    ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300",
                )}
              >
                🚫  No
              </button>
            </div>
            {isFamilyFriendly === null && (
              <p className="text-xs text-slate-400">Optional — skip if unsure</p>
            )}
          </div>

          {/* ── Caption ── */}
          <div className="space-y-1.5">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Describe this toilet... smell, paper quality, privacy?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={300}
              rows={3}
              className="resize-none"
            />
            <p className="text-right text-xs text-slate-400">{caption.length}/300</p>
          </div>

          {/* ── Submit ── */}
          <Button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full h-11">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Posting...</>
            ) : (
              "Post Review 🚽"
            )}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
