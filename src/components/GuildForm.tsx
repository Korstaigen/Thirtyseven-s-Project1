'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GuildForm() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get('item')

  const [itemName, setItemName] = useState<string>('')

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

          <input
            className="w-full px-3 py-2 rounded bg-gray-700"
            value={itemName}
            readOnly
            placeholder="Open from Turtle DB"
          />

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

        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Submit Request
        </button>

      </form>
    </div>
  )
}
