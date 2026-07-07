import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let imageBase64: string
  let mimeType: string
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File | null
    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 })
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    const buffer = await file.arrayBuffer()
    imageBase64 = Buffer.from(buffer).toString("base64")
    mimeType = file.type
  } catch {
    return NextResponse.json({ error: "Failed to read image" }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ approved: true, reason: "moderation_skipped" })
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 60,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a content moderator for a bathroom rating app.
Analyze this image and respond with ONLY a JSON object in this exact format, nothing else:
{"approved": true/false, "reason": "one short sentence"}
Approve (true) if the image clearly shows: a bathroom, toilet, sink, shower, bathtub, bathroom tiles, bathroom vanity, bathroom decor, or any recognizable bathroom space or fixture — even partially.
Reject (false) ONLY if the image is clearly something completely unrelated to bathrooms: a selfie/portrait with no bathroom visible, food, cars, memes, landscapes, documents, or explicit non-bathroom content.
When in doubt, APPROVE. Be permissive.`,
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error("Claude moderation API error:", await response.text())
      return NextResponse.json({ approved: true, reason: "api_error" })
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text?.trim() ?? ""
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ approved: true, reason: "parse_error" })

    const result = JSON.parse(jsonMatch[0]) as { approved: boolean; reason: string }
    return NextResponse.json({ approved: result.approved ?? true, reason: result.reason ?? "" })
  } catch (err) {
    console.error("Moderation API error:", err)
    return NextResponse.json({ approved: true, reason: "api_error" })
  }
}