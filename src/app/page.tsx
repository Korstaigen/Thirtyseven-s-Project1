import GuildForm from '@/components/GuildForm'
import UserBadge from '@/components/UserBadge'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Right - Real User Badge */}
      <div className="absolute top-4 right-4">
        <UserBadge />
      </div>

      {/* Centered Form */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <GuildForm />
      </div>

    </main>
  )
}
