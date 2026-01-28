import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in → redirect to Discord
  if (!user) {
    redirect(
      `https://ypwlkgaebzpnmpeazkqg.supabase.co/auth/v1/authorize?provider=discord&redirect_to=https://thirtyseven-s-project1.vercel.app`
    )
  }

  // If logged in → show main app
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-4">Turtle WoW Guild Panel</h1>
      <p>You are logged in with Discord.</p>
      <p>Loot priority system coming soon.</p>
    </main>
  )
}
