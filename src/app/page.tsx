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

      {/* Top Right User */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Hard Reserves Panel (RIGHT SIDE) */}
      <div className="absolute top-32 right-6 z-30 w-[320px] max-h-[70vh] overflow-y-auto">
        <HardReserves />
      </div>

      {/* Center Content (UNCHANGED) */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <GuildForm />
      </div>

    </main>
  )
}
