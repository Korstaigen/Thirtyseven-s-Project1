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

  status?: 'approved' | 'rejected' | null
  reviewed_by?: string | null

  user_note?: string | null
  admin_note?: string | null
  locked?: boolean | null
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
  /* LOAD DATA */
  /* -------------------------------- */

  async function loadData() {
    setLoading(true)

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

      setIsAdmin(Boolean(profile?.is_admin))
    }

    const { data, error } = await supabase
      .from('loot_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      setRows(data || [])
      setFilteredRows(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  /* -------------------------------- */
  /* FILTERS */
  /* -------------------------------- */

  useEffect(() => {
    let result = [...rows]

    if (raidFilter !== 'All')
      result = result.filter(r => r.raid === raidFilter)

    if (classFilter !== 'All')
      result = result.filter(r => r.class === classFilter)

    if (priorityFilter !== 'All')
      result = result.filter(r => r.priority === priorityFilter)

    if (slotFilter !== 'All')
      result = result.filter(r => r.slot === slotFilter)

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

        if (dateFilter === 'Today')
          return created.toDateString() === now.toDateString()

        if (dateFilter === '7days')
          return now.getTime() - created.getTime() <= 7 * 86400000

        if (dateFilter === '30days')
          return now.getTime() - created.getTime() <= 30 * 86400000

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
    const { error } = await supabase
      .from('loot_requests')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    await loadData()
  }

  async function updateStatus(
    id: number,
    status: 'approved' | 'rejected'
  ) {
    const { error } = await supabase
      .from('loot_requests')
      .update({
        status,
        reviewed_by: adminName,
      })
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    await loadData()
  }

  async function deleteRequest(id: number) {
    const { error } = await supabase
      .from('loot_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    await loadData()
  }

  async function toggleLock(row: LootRow) {
    await updateRow(row.id, {
      locked: !Boolean(row.locked),
    })
  }

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
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Raid Priority Overview
        </h1>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
        >
          ← Back
        </button>

      </div>

      {/* Results */}
      <div className="space-y-4">

        {filteredRows.map(row => (

          <div
            key={row.id}
            className={`bg-gray-800 p-4 rounded ${
              row.locked ? 'opacity-70' : ''
            }`}
          >

            <div className="font-semibold">
              {row.character_name}
            </div>

            <div className="text-sm text-gray-400">
              {row.class} • {row.raid} • {row.slot}
            </div>

            {/* STATUS DISPLAY */}
            {row.status && (
              <div className="text-xs text-gray-400 mt-1">

                {row.status === 'approved' && (
                  <>Approved by {row.reviewed_by}</>
                )}

                {row.status === 'rejected' && (
                  <>Rejected by {row.reviewed_by}</>
                )}

              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 mt-3 flex-wrap">

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(row.id, 'approved')
                  }
                  disabled={!!row.locked}
                  className="bg-green-600 px-2 py-1 rounded text-xs"
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(row.id, 'rejected')
                  }
                  disabled={!!row.locked}
                  className="bg-yellow-600 px-2 py-1 rounded text-xs"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => toggleLock(row)}
                  className="bg-purple-600 px-2 py-1 rounded text-xs"
                >
                  {row.locked ? 'Unlock' : 'Lock'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteRequest(row.id)}
                  className="bg-red-600 px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}
