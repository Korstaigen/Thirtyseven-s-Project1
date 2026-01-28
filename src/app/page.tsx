import GuildForm from '@/components/GuildForm'
import UserBadge from '@/components/UserBadge'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Left GIF */}
      <div className="absolute top-4 left-4 z-40">
        <img
          src="https://tenor.com/b1l6t.gif"
          alt="guild gif"
          className="w-[75px] h-[75px] rounded-lg shadow"
        />
      </div>

      {/* Top Right User */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Center Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <GuildForm />
      </div>

    </main>
  )
}
