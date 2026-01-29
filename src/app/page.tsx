import GuildForm from '../components/GuildForm'
import UserBadge from '../components/UserBadge'
import HardReserves from '../components/HardReserves'
import OnlineUsers from '../components/OnlineUsers'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Right User Panel */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Main Layout */}
      <div className="min-h-screen flex justify-center items-start pt-28 px-6">

        {/* Grid: Online | Form | HR */}
        <div className="grid grid-cols-[260px_1fr_340px] gap-8 max-w-7xl w-full">

          {/* Online Users (Left) */}
          <div className="h-[70vh] overflow-y-auto">
            <OnlineUsers />
          </div>

          {/* Main Form (Center) */}
          <div className="flex justify-center">
            <GuildForm />
          </div>

          {/* Hard Reserves (Right) */}
          <div className="h-[70vh] overflow-y-auto">
            <HardReserves />
          </div>

        </div>

      </div>

    </main>
  )
}
