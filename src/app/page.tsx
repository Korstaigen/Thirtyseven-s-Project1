export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white relative">

      {/* Top Right Placeholder */}
      <div className="absolute top-4 right-4 flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg shadow">
        <div className="w-10 h-10 rounded-full bg-gray-600" />

        <div className="text-sm">
          <p className="font-semibold">Logged in</p>
          <p className="text-green-400 text-xs">
            Session active
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">

        {/* Banner */}
        <img
          src="https://images.blz-contentstack.com/v3/assets/bltc965041283bac56c/blt41f9c5b1bb8b4a38/5f6d287f23f52c7f5bde04c6/classic-logo.png"
          alt="WoW Banner"
          className="w-64 mb-4"
        />

        {/* Panel */}
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow">

          <h1 className="text-2xl font-bold mb-4 text-center">
            Turtle WoW Guild Panel
          </h1>

          <form className="space-y-4">

            <div>
              <label className="block text-sm mb-1">
                Character Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Item
              </label>
              <select className="w-full px-3 py-2 rounded bg-gray-700 text-white">
                <option>Ashkandi</option>
                <option>Perdition's Blade</option>
                <option>Neltharion's Tear</option>
              </select>
            </div>

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

            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
            >
              Submit Request
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}
