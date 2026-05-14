import { NextResponse } from "next/server"
import { createClient }  from "@/lib/supabase/server"

// ── Called by Vercel cron every Monday at 9am ET ─────────────
// Add to vercel.json:
// { "crons": [{ "path": "/api/digest", "schedule": "0 14 * * 1" }] }

export async function GET(request: Request) {
  // Verify this is a cron request (Vercel adds this header)
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  // Get digest data for all opted-in users
  const { data: digestUsers, error } = await supabase
    .rpc("get_weekly_digest_data")

  if (error) {
    console.error("Digest query error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!digestUsers || digestUsers.length === 0) {
    return NextResponse.json({ sent: 0, message: "No digest subscribers" })
  }

  // Get auth users to get their emails
  const { data: authData } = await supabase.auth.admin.listUsers()
  const emailMap: Record<string, string> = {}
  authData?.users?.forEach(u => {
    if (u.email) emailMap[u.id] = u.email
  })

  let sent = 0
  const errors: string[] = []

  for (const user of digestUsers) {
    const email = emailMap[user.user_id]
    if (!email) continue

    const topPosts = user.top_posts ?? []
    const newReviews = user.new_reviews ?? 0
    const flushBalance = user.flush_balance ?? 0

    const html = buildDigestEmail({
      username:     user.username ?? "there",
      flushBalance,
      newReviews,
      topPosts,
    })

    // Send via Supabase's built-in email or your own SMTP
    // Using fetch to your email provider here
    // Replace with Resend, SendGrid, or Mailgun as needed
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    "Toilet Book <digest@toilet-book.com>",
          to:      email,
          subject: `🚽 Your weekly Toilet Book digest — ${newReviews} new reviews this week`,
          html,
        }),
      })

      if (res.ok) {
        sent++
      } else {
        const err = await res.text()
        errors.push(`${email}: ${err}`)
      }
    } catch (e) {
      errors.push(`${email}: ${e}`)
    }
  }

  // Update last sent timestamp
  await supabase
    .from("profiles")
    .update({ email_digest_last: new Date().toISOString() })
    .eq("email_digest", true)

  return NextResponse.json({
    sent,
    total: digestUsers.length,
    errors: errors.length > 0 ? errors : undefined,
  })
}

// ── Email template ────────────────────────────────────────────
function buildDigestEmail({ username, flushBalance, newReviews, topPosts }: {
  username:     string
  flushBalance: number
  newReviews:   number
  topPosts:     any[]
}): string {
  const tokens = flushBalance * 10

  const postRows = topPosts.length > 0
    ? topPosts.map(p => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
            <strong style="color:#0f172a;">${p.store_name || "Public Toilet"}</strong><br/>
            <span style="color:#64748b;font-size:13px;">
              ${"★".repeat(p.rating || 0)} ${p.rating || 0}/5
              ${p.address ? ` · ${p.address}` : ""}
              ${p.has_adult_changing_station ? " · ♿ Adult station" : ""}
            </span>
          </td>
        </tr>
      `).join("")
    : `<tr><td style="padding:10px 0;color:#64748b;">No new reviews this week yet — be the first!</td></tr>`

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:32px 32px 24px;text-align:center;">
            <div style="font-size:48px;margin-bottom:8px;">🚽</div>
            <h1 style="color:#ffffff;font-size:24px;margin:0 0 4px;">Toilet Book Weekly</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Your weekly digest</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="color:#0f172a;font-size:16px;margin:0 0 8px;">Hey ${username}! 👋</p>
            <p style="color:#64748b;font-size:14px;margin:0;line-height:1.6;">
              Here's what happened on Toilet Book this week.
              ${newReviews > 0
                ? `The community posted <strong style="color:#0ea5e9;">${newReviews} new reviews</strong> this week.`
                : `It was a quiet week on the platform — be the first to post a review!`
              }
            </p>
          </td>
        </tr>

        <!-- FLUSH balance -->
        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" style="background:#f0f9ff;border-radius:12px;border:1px solid #bae6fd;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="color:#0369a1;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Your FLUSH balance</p>
                  <p style="color:#0f172a;font-size:28px;font-weight:bold;margin:0 0 2px;">${flushBalance.toLocaleString()} <span style="font-size:14px;color:#64748b;font-weight:normal;">points</span></p>
                  <p style="color:#0ea5e9;font-size:14px;font-weight:bold;margin:0;">= ${tokens.toLocaleString()} FLUSH tokens at launch</p>
                  <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Token launch: August 28, 2026 · Solana</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Top reviews this week -->
        <tr>
          <td style="padding:0 32px 20px;">
            <h2 style="color:#0f172a;font-size:16px;margin:0 0 12px;">Top reviews this week</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${postRows}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 32px;text-align:center;">
            <a href="https://toilet-book.com/?post=true"
               style="display:inline-block;background:linear-gradient(135deg,#10b981,#0ea5e9);color:#ffffff;font-weight:bold;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
              Rate a toilet — earn FLUSH
            </a>
            <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">
              <a href="https://toilet-book.com/referrals" style="color:#0ea5e9;text-decoration:none;">Manage digest settings</a>
              · <a href="https://toilet-book.com/leaderboard" style="color:#0ea5e9;text-decoration:none;">View leaderboard</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              Toilet Book · toilet-book.com · Rating the world's restrooms, one flush at a time<br/>
              <a href="https://toilet-book.com/referrals" style="color:#94a3b8;">Unsubscribe from weekly digest</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
