import GuildForm from '@/components/GuildForm'
import UserBadge from '@/components/UserBadge'
import HardReserves from '@/components/HardReserves'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Left GIF */}
      <div className="absolute top-4 left-4 z-40">
        <img
          src="https://media1.tenor.com/m/xgVPxE3ZsQAAAAAd/hop-on-turtlewow-turtlewow.gif"
          alt="guild gif"
          className="w-[337px] h-[337px] rounded-lg shadow"
        />
      </div>

      {/* Top Right Panel */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Main Content */}
      <div className="flex justify-center gap-6 min-h-screen px-4 pt-32">

        {/* Main Form */}
        <GuildForm />

        {/* Hard Reserves Panel */}
        <div className="w-[320px] shrink-0">
          <HardReserves />
        </div>

      </div>

    </main>
  )
}
