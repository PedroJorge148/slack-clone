import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { TriangleAlert } from "lucide-react"

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { SignInFlow } from '../types'
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"

interface SignUpCardProps {
  setState: (state: SignInFlow) => void
}

export function SignUpCard({ setState }: SignUpCardProps) {
  const router = useRouter()
  const { signIn } = useAuthActions()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  function onPasswordSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    setPending(true)
    signIn('password', { name, email, password, flow: 'signUp'})
      .then(() => {
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
        setError('Something went wrong!')
      })
      .finally(() => {
        setPending(false)
      })
  }

  function onProviderSignUp(value: 'github' | 'google') {
    setPending(true)
    signIn(value)
      .finally(() => {
        setPending(false)
      })
  }

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign Up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={pending}
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-2.5">
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => onProviderSignUp('google')}
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => onProviderSignUp('github')}
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <span
            onClick={() => setState('signIn')}
            className="text-sky-700 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
