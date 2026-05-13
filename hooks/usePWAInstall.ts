"use client"
import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled]     = useState(false)
  const [isIOS, setIsIOS]                 = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    // Detect already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true
    setIsInstalled(standalone)

    // Capture the install prompt (Android / Chrome desktop)
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // iOS doesn't fire beforeinstallprompt — but can still be installed
    if (ios && !standalone) setIsInstallable(true)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const triggerInstall = async (): Promise<"accepted" | "dismissed" | "ios" | "unavailable"> => {
    if (isIOS) return "ios"
    if (!installPrompt) return "unavailable"
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === "accepted") setIsInstalled(true)
    setInstallPrompt(null)
    return outcome
  }

  return { isInstallable, isInstalled, isIOS, triggerInstall }
}
