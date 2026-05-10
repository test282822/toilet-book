"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation, Loader2 } from "lucide-react"

type State = "idle" | "loading" | "denied" | "error"

export function NearMeButton() {
  const router = useRouter()
  const [state, setState] = useState<State>("idle")

  const handleClick = () => {
    if (!navigator.geolocation) {
      // No GPS available — just go to map
      router.push("/map")
      return
    }

    setState("loading")

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        // Fly straight to user's location at street level
        router.push(`/map?lat=${latitude}&lng=${longitude}&zoom=15`)
      },
      (err) => {
        // User denied or error — fall back to plain map
        if (err.code === err.PERMISSION_DENIED) {
          setState("denied")
          setTimeout(() => setState("idle"), 3000)
        } else {
          router.push("/map")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    )
  }

  const labels: Record<State, string> = {
    idle:    "Find toilets near me",
    loading: "Getting your location...",
    denied:  "Location denied — opening map",
    error:   "Opening map...",
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {state === "loading"
        ? <Loader2 className="h-4 w-4 text-sky-500 animate-spin" />
        : <Navigation className="h-4 w-4 text-sky-500" />
      }
      {labels[state]}
    </button>
  )
}
