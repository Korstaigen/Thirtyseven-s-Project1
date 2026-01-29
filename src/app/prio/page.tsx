'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'

type LootRow = {
  id: number
  character_name: string
  class: string
  raid: string
  item_name: string
  slot: string
  priority: string
  created_at: string

  status?: string
  reviewed_by?: string

  user_note?: string
  admin_note?: string
  locked?: boolean
}

const PRIORITIES = ['Low', 'Medium', 'High', 'HR']

const SLOTS = [
  'All',
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

export default function PrioPage() {
  const supabase = createClient()
  const router = useRouter()

  const [rows, setRows] = useState<LootRow[]>([])
  const [filteredRows, setFilteredRows] = useState<LootRow[]>([])

  const [isAdmin, setIsAdmin] = useState(false)
  const [adminName, setAdminName] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* Filters */
  const [raidFilter, setRaidFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [slotFilter, setSlotFilter] = useState('All')

  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('All')

  /* -------------------------------- */
  /* LOAD */
  /* -------------------------------- */

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user) {
        const raw =
          userData.user.user_metadata?.name || 'Admin'

        setAdminName(raw.split('#')[0])

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userData.user.id)
          .single()

        setIsAdmin(!!profile?.is_admin)
      }

      const { data, error } = await supabase
        .from('loot_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setRows(data || [])
        setFilteredRows(data || [])
      }

      setLoading(false)
    }

    load()
  }, [])

  /* -------------------------------- */
  /* FILTERS */
  /* -------------------------------- */

  useEffect(() => {
    let result = [...rows]

    if (raidFilter !== 'All') {
      result = result.filter(r => r.raid === raidFilter)
    }

    if (classFilter !== 'All') {
      result = result.filter(r => r.class === classFilter)
    }

    if (priorityFilter !== 'All') {
      result = result.filter(r => r.priority === priorityFilter)
    }

    if (slotFilter !== 'All') {
      result = result.filter(r => r.slot === slotFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()

      result = result.filter(r =>
        r.character_name.toLowerCase().includes(q) ||
        r.item_name.toLowerCase().includes(q)
      )
    }

    if (dateFilter !== 'All') {
      const now = new Date()

      result = result.filter(r => {
        const created = new Date(r.created_at)

        if (dateFilter === 'Today') {
          return created.toDateString() === now.toDateString()
        }

        if (dateFilter === '7days') {
          return now.getTime() - created.getTime() <= 7 * 86400000
        }

        if (dateFilter === '30days') {
          return now.getTime() - created.getTime() <= 30 * 86400000
        }

        return true
      })
    }

    setFilteredRows(result)

  }, [
    raidFilter,
    classFilter,
    priorityFilter,
    slotFilter,
    search,
    dateFilter,
    rows,
  ])

  /* -------------------------------- */
  /* HELPERS */
  /* -------------------------------- */

  function getPriorityColor(priority: string) {
    if (priority === 'HR') return 'text-purple-400 font-bold'
    if (priority === 'High') return 'text-red-400 font-semibold'
    if (priority === 'Medium') return 'text-yellow-400'
    if (priority === 'Low') return 'text-green-400'
    return 'text-gray-300'
  }

  /* -------------------------------- */
  /* ADMIN ACTIONS */
  /* -------------------------------- */

  async function updateRow(
    id: number,
    updates: Partial<LootRow>
  ) {
    await supabase
      .from('loot_requests')
      .update(updates)
      .eq('id', id)

    setRows(prev =>
      prev.map(r =>
        r.id === id ? { ...r, ...updates } : r
      )
    )
  }

  async function updateStatus(id: number, status: string) {
    updateRow(id, {
      status,
      reviewed_by: adminName,
    })
  }

  async function deleteRequest(id: number) {
    await supabase
      .from('loot_requests')
      .delete()
      .eq('id', id)

    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function toggleLock(row: LootRow) {
    updateRow(row.id, {
      locked: !row.locked,
    })
  }

  /* -------------------------------- */
  /* DROPDOWNS */
  /* -------------------------------- */

  const raids = ['All', ...new Set(rows.map(r => r.raid))]
  const classes = ['All', ...new Set(rows.map(r => r.class))]
  const priorities = ['All', ...PRIORITIES]

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading priorities...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">

        <div className="flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Raid Priority Overview
          </h1>

          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-semibold"
          >
            ← Back to Main
          </button>

        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">

          <input
            type="text"
            placeholder="Search player or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm w-56"
          />

          <select
            value={raidFilter}
            onChange={(e) => setRaidFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {raids.map(r => (
              <option key={r}>{r}</option>
            ))}
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {classes.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {SLOTS.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {priorities.map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

        </div>

      </div>

      {/* Results */}
      <div className="space-y-4">

        {filteredRows.length === 0 && (
          <p className="text-gray-400">
            No results found.
          </p>
        )}

        {filteredRows.map((row) => (
          <div
            key={row.id}
            className={`bg-gray-800 p-4 rounded shadow ${
              row.locked ? 'opacity-70' : ''
            }`}
          >

            <div className="font-semibold">
              {row.character_name}
            </div>

            <div className="text-sm text-gray-300">
              {row.class} • {row.raid} • {row.slot}
            </div>

            {/* Item */}
            <div className="mt-2 text-sm">
              Item:{' '}
              <span className="text-blue-400">
                {row.item_name}
              </span>
            </div>

            {/* Priority */}
            <div className="text-sm mt-1">
              Priority:{' '}
              <span className={getPriorityColor(row.priority)}>
                {row.priority}
              </span>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}
