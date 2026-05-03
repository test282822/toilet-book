import { Metadata } from "next"
import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to share your bathroom inspo"
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Join free"
    >
      <LoginForm />
    </AuthCard>
  )
}
