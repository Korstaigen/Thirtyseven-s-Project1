import GuildForm from '../components/GuildForm'
import UserBadge from '../components/UserBadge'
import HardReserves from '../components/HardReserves'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Right User Panel */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Main Layout */}
      <div className="min-h-screen flex justify-center items-start pt-28 px-6">

        {/* Grid Container */}
        <div className="grid grid-cols-[1fr_340px] gap-8 max-w-6xl w-full">

          {/* Main Form (Left, slightly shifted) */}
          <div className="flex justify-end">
            <GuildForm />
          </div>

          {/* Hard Reserves (Right, aligned) */}
          <div className="h-[70vh] overflow-y-auto">
            <HardReserves />
          </div>

        </div>

      </div>

    </main>
  )
}
