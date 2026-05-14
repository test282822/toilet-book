import { redirect } from "next/navigation"

// Redirect /flip → /flip.html so both URLs work
export default function FlipPage() {
  redirect("/flip.html")
}
