import GuildForm from '../components/GuildForm'
import UserBadge from '../components/UserBadge'
import HardReserves from '../components/HardReserves'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative overflow-hidden">

      {/* Top Left GIF */}
      <div className="absolute top-4 left-4 z-40">
        <img
          src="https://tenor.com/view/hop-on-turtlewow-turtlewow-hop-on-turtle-riding-gif-27453619"
          alt="guild gif"
          className="w-[120px] h-[120px] rounded-lg shadow"
        />
      </div>

      {/* Top Right User Panel */}
      <div className="absolute top-4 right-4 z-40">
        <UserBadge />
      </div>

      {/* Main Layout */}
      <div className="flex justify-center items-center min-h-screen gap-10 px-6">

        {/* Hard Reserves (Left of Form) */}
        <div className="w-[320px] max-h-[70vh] overflow-y-auto mt-24">
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
