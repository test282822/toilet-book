import { Metadata } from "next"
import { AuthCard } from "@/components/auth/AuthCard"
import { SignupForm } from "@/components/auth/SignupForm"

export const metadata: Metadata = { title: "Create account" }

export default function SignupPage() {
  return (
    <AuthCard
      title="Join Toilet Book"
      subtitle="Share your sanctuary with the world"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <SignupForm />
    </AuthCard>
  )
}
