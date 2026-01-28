import GuildForm from '@/components/GuildForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg shadow">
        <div className="w-10 h-10 rounded-full bg-gray-600" />

        <div className="text-sm">
          <p className="font-semibold">Logged in</p>
          <p className="text-green-400 text-xs">Session active</p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4">
        <GuildForm />
      </div>

    </main>
  )
}
