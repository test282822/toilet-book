import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to report posts" }, { status: 401 })
  }

  const { post_id, reason } = await request.json() as { post_id: string; reason?: string }
  if (!post_id) {
    return NextResponse.json({ error: "post_id is required" }, { status: 400 })
  }

  const { error } = await supabase.from("reports").insert({
    post_id,
    user_id: user.id,
    reason: reason ?? null,
  })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "You already reported this post" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
