'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get('item')

  const [itemName, setItemName] = useState<string | null>(null)

  useEffect(() => {
    if (!itemId) return

    async function loadItem() {
      try {
        const res = await fetch(
          `https://database.turtlecraft.gg/api/item/${itemId}`
        )

        const data = await res.json()
        setItemName(data.name)
      } catch {
        setItemName('Unknown item')
      }
    }

    loadItem()
  }, [itemId])

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

      {/* Main */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">

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
                className="w-full px-3 py-2 rounded bg-gray-700"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm mb-1">
                Class
              </label>
              <select className="w-full px-3 py-2 rounded bg-gray-700">
                <option>Warrior</option>
                <option>Mage</option>
                <option>Priest</option>
                <option>Rogue</option>
                <option>Hunter</option>
                <option>Warlock</option>
                <option>Druid</option>
                <option>Paladin</option>
                <option>Shaman</option>
              </select>
            </div>

            {/* Raid */}
            <div>
              <label className="block text-sm mb-1">
                Raid
              </label>
              <select className="w-full px-3 py-2 rounded bg-gray-700">
                <option>Molten Core</option>
                <option>Blackwing Lair</option>
                <option>AQ40</option>
                <option>Naxxramas</option>
              </select>
            </div>

            {/* Item */}
            <div>
              <label className="block text-sm mb-1">
                Item
              </label>

              <div className="flex gap-2">
                <input
                  className="w-full px-3 py-2 rounded bg-gray-700"
                  value={itemName ?? ''}
                  placeholder="Open from Turtle DB"
                  readOnly
                />

                <a
                  href="https://database.turtlecraft.gg"
                  target="_blank"
                  className="bg-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-500"
                >
                  DB
                </a>
              </div>

              {itemId && (
                <p className="text-xs text-gray-400 mt-1">
                  Item ID: {itemId}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm mb-1">
                Priority
              </label>
              <select className="w-full px-3 py-2 rounded bg-gray-700">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* Submit */}
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
