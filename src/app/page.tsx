import GuildForm from '@/components/GuildForm'
import UserBadge from '@/components/UserBadge'

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
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">

        <UserBadge />

        <button
          id="loot-button"
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded shadow text-sm"
        >
          Loot System
        </button>

        <a href="/prio">
          <button
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded shadow text-sm w-full"
          >
            Raid Priorities
          </button>
        </a>

      </div>

      {/* Center Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <GuildForm />
      </div>

    </main>
  )
}
