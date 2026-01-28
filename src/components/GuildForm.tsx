'use client'

import { useState } from 'react'

type Priority = 'Low' | 'Medium' | 'High'

type ItemEntry = {
  item: string
  priority: Priority
}

type RaidEntry = {
  raid: string
  items: ItemEntry[]
}

/* Mock DB (move to Supabase later) */
const RAID_ITEMS: Record<string, string[]> = {
  MoltenCore: [
    'Perdition’s Blade',
    'Onslaught Girdle',
    'Cenarion Boots',
  ],

  BWL: [
    'Ashkandi',
    'Neltharion’s Tear',
    'Rejuvenating Gem',
  ],

  AQ40: [
    'Dark Edge of Insanity',
    'Ring of the Fallen God',
  ],

  Naxxramas: [
    'Corrupted Ashbringer',
    'Might of Menethil',
    'Atiesh',
  ],
}

const RAIDS = [
  'MoltenCore',
  'BWL',
  'AQ40',
  'Naxxramas',
]

export default function GuildForm() {
  const [multiRaid, setMultiRaid] = useState(false)

  const [raids, setRaids] = useState<RaidEntry[]>([
    {
      raid: 'MoltenCore',
      items: [{ item: '', priority: 'Medium' }],
    },
  ])

  /* Toggle mode */
  function toggleMultiRaid() {
    if (!multiRaid) {
      setRaids([
        {
          raid: 'MoltenCore',
          items: [{ item: '', priority: 'Medium' }],
        },
      ])
    }

    setMultiRaid(!multiRaid)
  }

  /* Add raid block */
  function addRaid() {
    if (raids.length >= 8) return

    setRaids([
      ...raids,
      {
        raid: 'MoltenCore',
        items: [{ item: '', priority: 'Medium' }],
      },
    ])
  }

  /* Remove raid block */
  function removeRaid(index: number) {
    const copy = [...raids]
    copy.splice(index, 1)
    setRaids(copy)
  }

  /* Update raid */
  function updateRaid(index: number, value: string) {
    const copy = [...raids]
    copy[index].raid = value
    copy[index].items = [{ item: '', priority: 'Medium' }]
    setRaids(copy)
  }

  /* Add item */
  function addItem(raidIndex: number) {
    const copy = [...raids]
    copy[raidIndex].items.push({
      item: '',
      priority: 'Medium',
    })
    setRaids(copy)
  }

  /* Remove item */
  function removeItem(raidIndex: number, itemIndex: number) {
    const copy = [...raids]
    copy[raidIndex].items.splice(itemIndex, 1)
    setRaids(copy)
  }

  /* Update item */
  function updateItem(
    raidIndex: number,
    itemIndex: number,
    value: string
  ) {
    const copy = [...raids]
    copy[raidIndex].items[itemIndex].item = value
    setRaids(copy)
  }

  /* Update priority */
  function updatePriority(
    raidIndex: number,
    itemIndex: number,
    value: Priority
  ) {
    const copy = [...raids]
    copy[raidIndex].items[itemIndex].priority = value
    setRaids(copy)
  }

  return (
    <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Skip Mechanics – Prio & HR
      </h1>

      <form className="space-y-6">

        {/* Character */}
        <div>
          <label className="block text-sm mb-1">
            Character Name
          </label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm mb-1">
            Class
          </label>
          <select className="w-full px-3 py-2 rounded bg-gray-700 text-white">
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

        {/* Multi-Raid Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={multiRaid}
            onChange={toggleMultiRaid}
            className="w-4 h-4"
          />

          <label className="text-sm">
            Enable Multi-Raid Mode (up to 8 raids)
          </label>
        </div>

        {/* Raid Blocks */}
        <div className="space-y-8">

          {raids.map((raidBlock, raidIndex) => {
            const availableItems =
              RAID_ITEMS[raidBlock.raid] || []

            return (
              <div
                key={raidIndex}
                className="border border-gray-700 rounded-lg p-4"
              >

                {/* Raid Header */}
                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-3">

                    <span className="font-semibold">
                      Raid {raidIndex + 1}
                    </span>

                    <select
                      className="px-3 py-2 rounded bg-gray-700 text-white"
                      value={raidBlock.raid}
                      onChange={(e) =>
                        updateRaid(raidIndex, e.target.value)
                      }
                    >
                      {RAIDS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                  </div>

                  {multiRaid && raids.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRaid(raidIndex)}
                      className="text-red-400 hover:text-red-500 text-sm"
                    >
                      Remove Raid
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2">

                  {raidBlock.items.map((row, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid grid-cols-12 gap-2 items-center"
                    >

                      {/* Item */}
                      <select
                        className="col-span-7 px-3 py-2 rounded bg-gray-700 text-white"
                        value={row.item}
                        onChange={(e) =>
                          updateItem(
                            raidIndex,
                            itemIndex,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select item
                        </option>

                        {availableItems.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}
                      </select>

                      {/* Priority */}
                      <select
                        className="col-span-3 px-3 py-2 rounded bg-gray-700 text-white"
                        value={row.priority}
                        onChange={(e) =>
                          updatePriority(
                            raidIndex,
                            itemIndex,
                            e.target.value as Priority
                          )
                        }
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>

                      {/* Remove Item */}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(raidIndex, itemIndex)
                        }
                        className="col-span-2 text-right text-red-400 hover:text-red-500"
                      >
                        ✕
                      </button>

                    </div>
                  ))}

                  {/* Add Item */}
                  <button
                    type="button"
                    onClick={() => addItem(raidIndex)}
                    className="text-sm text-green-400 hover:text-green-500 mt-2"
                  >
                    + Add Item
                  </button>

                </div>
              </div>
            )
          })}

        </div>

        {/* Add Raid */}
        {multiRaid && raids.length < 8 && (
          <button
            type="button"
            onClick={addRaid}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm"
          >
            + Add Another Raid
          </button>
        )}

        {/* Submit */}
        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold text-lg"
        >
          Submit Priorities
        </button>

      </form>
    </div>
  )
}
