import { SignOutButton } from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

export default function Home() {

  return (
    <div>
      Logged In!
      <SignOutButton />
    </div>
  )
}
