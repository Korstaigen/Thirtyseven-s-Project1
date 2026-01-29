import GuildForm from '@/components/GuildForm'
import UserBadge from '@/components/UserBadge'
import HardReserves from '@/components/HardReserves'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative overflow-hidden">

      {/* Top Left GIF */}
      <div className="absolute top-4 left-4 z-40">
        <img
          src="https://media1.tenor.com/m/xgVPxE3ZsQAAAAAd/hop-on-turtlewow-turtlewow.gif"
          alt="guild gif"
          className="w-[120px] h-[120px] rounded-lg shadow"
        />
      </div>

      {/* Top Right User Panel */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Hard Reserves (Right Side, Centered with Form) */}
      <div className="absolute right-6 top-1/3 -translate-y-1/2 z-30 w-[320px] max-h-[70vh] overflow-y-auto">
        <HardReserves />
      </div>

      {/* Main Center Form */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <GuildForm />
      </div>

    </main>
  )
}
