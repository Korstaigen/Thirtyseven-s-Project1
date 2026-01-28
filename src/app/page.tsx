import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in → redirect to Discord
  if (!user) {
    redirect(
      'https://ypwlkgaebzpnmpeazkqg.supabase.co/auth/v1/authorize?provider=discord&redirect_to=https://thirtyseven-s-project1.vercel.app'
    )
  }

  // Logged in → main app
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold">Turtle WoW Guild Panel</h1>
      <p>You are logged in via Discord.</p>
      <p>Loot system coming next.</p>
    </main>
  )
}
