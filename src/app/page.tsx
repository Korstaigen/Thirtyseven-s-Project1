export const revalidate = 0

import { createClient } from '@/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const username = user?.user_metadata?.name || 'Unknown'
  const avatar = user?.user_metadata?.avatar_url

  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Right User Info */}
      <div className="absolute top-4 right-4 flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg shadow">
        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        )}

        <div className="text-sm">
          <p className="font-semibold">{username}</p>
          <p className="text-green-400 text-xs">
            Logged in successfully
          </p>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">

        {/* Banner Image */}
        <img
          src="https://images.blz-contentstack.com/v3/assets/bltc965041283bac56c/blt41f9c5b1bb8b4a38/5f6d287f23f52c7f5bde04c6/classic-logo.png"
          alt="WoW Banner"
          className="w-64 mb-4"
        />

        {/* Main Panel */}
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow">

          <h1 className="text-2xl font-bold mb-4 text-center">
            Turtle WoW Guild Panel
          </h1>

          <form className="space-y-4">

            {/* Character */}
            <div>
              <label className="block text-sm mb-1">
                Character Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                placeholder="Korstaigen"
              />
            </div>

            {/* Item */}
            <div>
              <label className="block text-sm mb-1">
                Item
              </label>
              <select className="w-full px-3 py-2 rounded bg-gray-700 text-white">
                <option>Select item</option>
                <option>Ashkandi</option>
                <option>Perdition's Blade</option>
                <option>Neltharion's Tear</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm mb-1">
                Priority
              </label>
              <select className="w-full px-3 py-2 rounded bg-gray-700 text-white">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
            >
              Submit Request
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}
