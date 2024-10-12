'use client'

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter()
  const { signOut } = useAuthActions()

  return (
    <Button onClick={() => {
      signOut()
        .then(() => {
          router.push('/auth')
        })
    }}>
      Sign Out
    </Button>
  )
}