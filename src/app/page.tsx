import GuildForm from '../components/GuildForm'
import UserBadge from '../components/UserBadge'
import HardReserves from '../components/HardReserves'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      
      {/* Top Right User Panel */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Main Layout */}
      <div className="flex justify-center items-center min-h-screen gap-10 px-6">

        {/* Hard Reserves (Left of Form) */}
        <div className="w-[320px] max-h-[60vh] overflow-y-auto mt-24">
          <HardReserves />
        </div>

        {/* Main Form (Center) */}
        <div>
          <GuildForm />
        </div>

      </div>

    </main>
  )
}
