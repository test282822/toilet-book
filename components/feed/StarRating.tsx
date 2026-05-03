"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" }
  const iconSize = sizes[size]

  return (
    <div className="flex items-center gap-0.5" role={readonly ? "img" : "radiogroup"} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={cn(
              "transition-all duration-100",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default",
            )}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                iconSize,
                "transition-colors duration-100",
                active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-slate-200 dark:text-slate-700",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
