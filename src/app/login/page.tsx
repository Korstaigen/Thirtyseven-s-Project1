'use client'

import { createClient } from '@/supabase/client'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://thirtyseven-s-project1.vercel.app/auth/callback',
      },
    })
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Redirecting to Discord…</p>
    </main>
  )
}
