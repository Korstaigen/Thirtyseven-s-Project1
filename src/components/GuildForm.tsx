'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

/* ---------------- TYPES ---------------- */

type Priority = 'Low-OS' | 'Medium-MS' | 'High-SR' | 'HR'

type ItemEntry = {
  item: string
  slot: string
  priority: Priority
  note: string
}

type RaidEntry = {
  raid: string
  items: ItemEntry[]
}

/* ---------------- CONSTANTS ---------------- */

const RAIDS = [
  'Molten Core',
  'Blackwing Lair',
  'AQ40',
  'Naxxramas',
  'Emerald Sanctum',
  'Karazhan 40',
]

const SLOTS = [
  'Head',
  'Neck',
  'Shoulders',
  'Back',
  'Chest',
  'Bracers',
  'Gloves',
  'Belt',
  'Legs',
  'Boots',
  'Ring',
  'Trinket',
  'Two-Handed Weapon',
  'Main Hand',
  'Off Hand',
  'Ranged',
]

/* ---------------- HELPERS ---------------- */

const emptyItem = (): ItemEntry => ({
  item: '',
  slot: '',
  priority: 'Medium-MS',
  note: '',
})

const emptyRaid = (): RaidEntry => ({
  raid: 'Molten Core',
  items: [emptyItem()],
})

/* ---------------- COMPONENT ---------------- */

export default function GuildForm() {
  const supabase = createClient()

  /* User */
  const [isAdmin, setIsAdmin] = useState(false)

  /* HR */
  const [hardReserves, setHardReserves] = useState<string[]>([])

  /* Form */
  const [characterName, setCharacterName] = useState('')
  const [playerClass, setPlayerClass] = useState('')

  const [multiRaid, setMultiRaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const [raids, setRaids] = useState<RaidEntry[]>([emptyRaid()])

  /* ---------------- LOAD DATA ---------------- */

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

      const { data: hrData } = await supabase
        .from('hard_reserves')
        .select('item_name')

      if (hrData) {
        setHardReserves(hrData.map(r => r.item_name.toLowerCase()))
      }
    }

    load()
  }, [])

  /* ---------------- RAID CONTROLS ---------------- */

  function toggleMultiRaid() {
    setMultiRaid(prev => {
      if (prev) {
        setRaids([emptyRaid()])
      } else {
        setRaids([emptyRaid(), emptyRaid()])
      }

      return !prev
    })
  }

  function addRaid() {
    if (raids.length >= 8) return

    setRaids(prev => [...prev, emptyRaid()])
  }

  function removeRaid(index: number) {
    setRaids(prev => prev.filter((_, i) => i !== index))
  }

  function updateRaid(index: number, value: string) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === index
          ? { ...r, raid: value, items: [emptyItem()] }
          : r
      )
    )
  }

  /* ---------------- ITEM CONTROLS ---------------- */

  function addItem(raidIndex: number) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === raidIndex
          ? { ...r, items: [...r.items, emptyItem()] }
          : r
      )
    )
  }

  function removeItem(raidIndex: number, itemIndex: number) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === raidIndex
          ? {
              ...r,
              items: r.items.filter((_, j) => j !== itemIndex),
            }
          : r
      )
    )
  }

  function updateItem(
    raidIndex: number,
    itemIndex: number,
    value: string
  ) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === raidIndex
          ? {
              ...r,
              items: r.items.map((it, j) =>
                j === itemIndex ? { ...it, item: value } : it
              ),
            }
          : r
      )
    )
  }

  function updateSlot(
    raidIndex: number,
    itemIndex: number,
    value: string
  ) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === raidIndex
          ? {
              ...r,
              items: r.items.map((it, j) =>
                j === itemIndex ? { ...it, slot: value } : it
              ),
            }
          : r
      )
    )
  }

  function updatePriority(
    raidIndex: number,
    itemIndex: number,
    value: Priority
  ) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === raidIndex
          ? {
              ...r,
              items: r.items.map((it, j) =>
                j === itemIndex ? { ...it, priority: value } : it
              ),
            }
          : r
      )
    )
  }

  function updateNote(
    raidIndex: number,
    itemIndex: number,
    value: string
  ) {
    setRaids(prev =>
      prev.map((r, i) =>
        i === raidIndex
          ? {
              ...r,
              items: r.items.map((it, j) =>
                j === itemIndex ? { ...it, note: value } : it
              ),
            }
          : r
      )
    )
  }

  /* ---------------- SUBMIT ---------------- */

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

    const discordName =
      user.user_metadata?.preferred_username ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      'Unknown'

    const rows: any[] = []

    for (const raid of raids) {
      for (const item of raid.items) {
        const name = item.item.trim()

        if (!name || !item.slot) continue

        if (hardReserves.includes(name.toLowerCase())) {
          alert(`"${name}" is Hard Reserved`)
          setLoading(false)
          return
        }

        if (!isAdmin && item.priority === 'HR') {
          alert('Only admins may use HR')
          setLoading(false)
          return
        }

        const normalizedPriority = item.priority
          .replace('-OS', '')
          .replace('-MS', '')
          .replace('-SR', '')

        rows.push({
          user_id: user.id,
          discord_name: discordName,

          character_name: characterName,
          class: playerClass,
          raid: raid.raid,
          item_name: name,
          slot: item.slot,

          priority: normalizedPriority,

          status: 'pending',
          approved: false,

          user_note: item.note || null,
          admin_note: null,
          reviewed_by: null,
          locked: false,
        })
      }
    }

    if (!rows.length) {
      alert('No valid items')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('loot_requests')
      .insert(rows)

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      alert('Submitted')
    }

    setLoading(false)
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Skip Mechanics – Prio & HR
      </h1>

      <form className="space-y-6">

        <input
          placeholder="Character Name"
          value={characterName}
          onChange={e => setCharacterName(e.target.value)}
          className="w-full bg-gray-700 px-3 py-2 rounded"
        />

        <select
          value={playerClass}
          onChange={e => setPlayerClass(e.target.value)}
          className="w-full bg-gray-700 px-3 py-2 rounded"
        >
          <option value="">Select Class</option>

          {[
            'Warrior',
            'Mage',
            'Priest',
            'Rogue',
            'Hunter',
            'Warlock',
            'Druid',
            'Paladin',
            'Shaman',
          ].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="flex gap-3">
          <input
            type="checkbox"
            checked={multiRaid}
            onChange={toggleMultiRaid}
          />
          <label>Enable Multi-Raid</label>
        </div>

        {multiRaid && raids.length < 8 && (
          <button
            type="button"
            onClick={addRaid}
            className="text-green-400 text-sm"
          >
            + Add Raid
          </button>
        )}

        <div className="space-y-8">

          {raids.map((raidBlock, raidIndex) => (

            <div
              key={raidIndex}
              className="border border-gray-700 p-4 rounded"
            >

              <div className="flex justify-between mb-3">

                <select
                  value={raidBlock.raid}
                  onChange={e =>
                    updateRaid(raidIndex, e.target.value)
                  }
                  className="bg-gray-700 px-2 py-1 rounded"
                >
                  {RAIDS.map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>

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

              <div className="space-y-3">

                {raidBlock.items.map((row, itemIndex) => (

                  <div key={itemIndex}>

                    <div className="grid grid-cols-12 gap-2">

                      <input
                        value={row.item}
                        onChange={e =>
                          updateItem(
                            raidIndex,
                            itemIndex,
                            e.target.value
                          )
                        }
                        placeholder="Item"
                        className="col-span-4 bg-gray-700 px-2 py-1 rounded"
                      />

                      <select
                        value={row.slot}
                        onChange={e =>
                          updateSlot(
                            raidIndex,
                            itemIndex,
                            e.target.value
                          )
                        }
                        className="col-span-3 bg-gray-700 px-2 py-1 rounded"
                      >
                        <option value="">Slot</option>

                        {SLOTS.map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>

                      <select
                        value={row.priority}
                        onChange={e =>
                          updatePriority(
                            raidIndex,
                            itemIndex,
                            e.target.value as Priority
                          )
                        }
                        className="col-span-2 bg-gray-700 px-2 py-1 rounded"
                      >
                        <option>Low-OS</option>
                        <option>Medium-MS</option>
                        <option>High-SR</option>
                        {isAdmin && <option>HR</option>}
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(raidIndex, itemIndex)
                        }
                        className="col-span-1 text-red-400"
                      >
                        ✕
                      </button>

                    </div>

                    <textarea
                      value={row.note}
                      onChange={e =>
                        updateNote(
                          raidIndex,
                          itemIndex,
                          e.target.value
                        )
                      }
                      placeholder="User Comment (optional)"
                      className="mt-1 w-full bg-gray-700 px-2 py-1 rounded text-sm"
                      rows={2}
                    />

                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(raidIndex)}
                  className="text-green-400 text-sm"
                >
                  + Add Item
                </button>

              </div>

            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={submitRequests}
          className="w-full bg-blue-600 py-3 rounded font-semibold"
        >
          {loading ? 'Submitting…' : 'Submit Priorities'}
        </button>

      </form>
    </div>
  )
}
