'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

type Priority = 'Low' | 'Medium' | 'High' | 'HR'

type ItemEntry = {
  item: string
  priority: Priority
}

type RaidEntry = {
  raid: string
  items: ItemEntry[]
}

/* Raids */
const RAIDS = [
  'Molten Core',
  'Blackwing Lair',
  'AQ40',
  'Naxxramas',
  'Emerald Sanctum',
  'Karazhan 40',
]

export default function GuildForm() {
  const supabase = createClient()

  /* User */
  const [isAdmin, setIsAdmin] = useState(false)

  /* HR list */
  const [hardReserves, setHardReserves] = useState<string[]>([])

  /* Form */
  const [characterName, setCharacterName] = useState('')
  const [playerClass, setPlayerClass] = useState('')

  const [multiRaid, setMultiRaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const [raids, setRaids] = useState<RaidEntry[]>([
    {
      raid: 'Molten Core',
      items: [{ item: '', priority: 'Medium' }],
    },
  ])

  /* -------------------------------- */
  /* LOAD ADMIN + HR DATA */
  /* -------------------------------- */
  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userData.user.id)
          .single()

        setIsAdmin(!!profile?.is_admin)
      }

      /* Load hard reserves */
      const { data: hrData } = await supabase
        .from('hard_reserves')
        .select('item_name')

      if (hrData) {
        setHardReserves(
          hrData.map(r => r.item_name.toLowerCase())
        )
      }
    }

    load()
  }, [])

  /* -------------------------------- */
  /* RAID CONTROLS */
  /* -------------------------------- */

  function toggleMultiRaid() {
    if (!multiRaid) {
      setRaids([
        {
          raid: 'Molten Core',
          items: [{ item: '', priority: 'Medium' }],
        },
      ])
    }

    setMultiRaid(!multiRaid)
  }

  function addRaid() {
    if (raids.length >= 8) return

    setRaids([
      ...raids,
      {
        raid: 'Molten Core',
        items: [{ item: '', priority: 'Medium' }],
      },
    ])
  }

  function removeRaid(index: number) {
    const copy = [...raids]
    copy.splice(index, 1)
    setRaids(copy)
  }

  function updateRaid(index: number, value: string) {
    const copy = [...raids]
    copy[index].raid = value
    copy[index].items = [{ item: '', priority: 'Medium' }]
    setRaids(copy)
  }

  /* -------------------------------- */
  /* ITEM CONTROLS */
  /* -------------------------------- */

  function addItem(raidIndex: number) {
    const copy = [...raids]

    copy[raidIndex].items.push({
      item: '',
      priority: 'Medium',
    })

    setRaids(copy)
  }

  function removeItem(raidIndex: number, itemIndex: number) {
    const copy = [...raids]
    copy[raidIndex].items.splice(itemIndex, 1)
    setRaids(copy)
  }

  function updateItem(
    raidIndex: number,
    itemIndex: number,
    value: string
  ) {
    const copy = [...raids]
    copy[raidIndex].items[itemIndex].item = value
    setRaids(copy)
  }

  function updatePriority(
    raidIndex: number,
    itemIndex: number,
    value: Priority
  ) {
    const copy = [...raids]
    copy[raidIndex].items[itemIndex].priority = value
    setRaids(copy)
  }

  /* -------------------------------- */
  /* SUBMIT */
  /* -------------------------------- */

  async function submitRequests() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Not logged in')
      setLoading(false)
      return
    }

    if (!characterName || !playerClass) {
      alert('Fill character name and class')
      setLoading(false)
      return
    }

    const rows = []

    /* Check HR conflicts */
    for (const raidBlock of raids) {
      for (const item of raidBlock.items) {
        const name = item.item.trim()

        if (!name) continue

        /* BLOCK HARD RESERVE */
        if (
          hardReserves.includes(name.toLowerCase())
        ) {
          alert(
            `"${name}" is Hard Reserved and cannot be prioritized.`
          )

          setLoading(false)
          return
        }

        /* BLOCK HR FOR NON ADMINS */
        if (!isAdmin && item.priority === 'HR') {
          alert('Only admins may use HR priority.')
          setLoading(false)
          return
        }

        rows.push({
          user_id: user.id,
          discord_name: user.user_metadata?.name ?? 'Unknown',

          character_name: characterName,
          class: playerClass,

          raid: raidBlock.raid,
          item_name: name,
          priority: item.priority,
        })
      }
    }

    if (rows.length === 0) {
      alert('No items entered')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('loot_requests')
      .insert(rows)

    if (error) {
      console.error(error)
      alert('Submit failed')
    } else {
      alert('Submitted successfully')
    }

    setLoading(false)
  }

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */

  return (
    <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow">

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
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm mb-1">
            Class
          </label>

          <select
            value={playerClass}
            onChange={(e) => setPlayerClass(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select class</option>

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

        {/* Multi Raid */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={multiRaid}
            onChange={toggleMultiRaid}
          />

          <label>
            Enable Multi-Raid Mode
          </label>
        </div>

        {/* Raids */}
        <div className="space-y-8">

          {raids.map((raidBlock, raidIndex) => (
            <div
              key={raidIndex}
              className="border border-gray-700 rounded-lg p-4"
            >

              {/* Header */}
              <div className="flex justify-between mb-3">

                <div className="flex gap-3 items-center">

                  <span className="font-semibold">
                    Raid {raidIndex + 1}
                  </span>

                  <select
                    value={raidBlock.raid}
                    onChange={(e) =>
                      updateRaid(raidIndex, e.target.value)
                    }
                    className="px-3 py-2 rounded bg-gray-700"
                  >
                    {RAIDS.map(r => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>

                </div>

                {multiRaid && raids.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRaid(raidIndex)}
                    className="text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">

                {raidBlock.items.map((row, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="grid grid-cols-12 gap-2"
                  >

                    {/* Item */}
                    <input
                      type="text"
                      placeholder="Item name"
                      value={row.item}
                      onChange={(e) =>
                        updateItem(
                          raidIndex,
                          itemIndex,
                          e.target.value
                        )
                      }
                      className="col-span-7 bg-gray-700 px-3 py-2 rounded"
                    />

                    {/* Priority */}
                    <select
                      value={row.priority}
                      onChange={(e) =>
                        updatePriority(
                          raidIndex,
                          itemIndex,
                          e.target.value as Priority
                        )
                      }
                      className="col-span-3 bg-gray-700 px-2 py-2 rounded"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>

                      {isAdmin && <option>HR</option>}
                    </select>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(raidIndex, itemIndex)
                      }
                      className="col-span-2 text-red-400"
                    >
                      ✕
                    </button>

                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(raidIndex)}
                  className="text-green-400 text-sm mt-2"
                >
                  + Add Item
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={loading}
          onClick={submitRequests}
          className="w-full bg-blue-600 py-3 rounded font-semibold"
        >
          {loading ? 'Submitting...' : 'Submit Priorities'}
        </button>

      </form>
    </div>
  )
}
