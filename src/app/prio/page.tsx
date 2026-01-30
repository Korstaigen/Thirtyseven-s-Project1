'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'

/* ---------------- TYPES ---------------- */

type Priority = 'Low' | 'Medium' | 'High' | 'HR'

type LootRow = {
  id: string

  user_id: string
  discord_name: string

  character_name: string
  class: string
  raid: string
  item_name: string
  slot: string
  priority: Priority

  created_at: string

  status?: 'approved' | 'rejected' | 'pending' | null
  approved?: boolean | null

  reviewed_by?: string | null

  user_note?: string | null
  admin_note?: string | null
  locked?: boolean | null
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'HR']

/* ---------------- COMPONENT ---------------- */

export default function PrioPage() {
  const supabase = createClient()
  const router = useRouter()

  const [rows, setRows] = useState<LootRow[]>([])
  const [filteredRows, setFilteredRows] = useState<LootRow[]>([])

  /* Filters */
  const [filterRaid, setFilterRaid] = useState('All')
  const [filterClass, setFilterClass] = useState('All')
  const [filterSlot, setFilterSlot] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterTime, setFilterTime] = useState<'new' | 'old'>('new')

  const [isAdmin, setIsAdmin] = useState(false)
  const [adminName, setAdminName] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* -------------------------------- */
  /* LOAD DATA */
  /* -------------------------------- */

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const { data: userData } = await supabase.auth.getUser()

      let admin = false
      let name = ''

      if (userData.user) {
        name =
          userData.user.user_metadata?.preferred_username ||
          userData.user.user_metadata?.full_name ||
          userData.user.user_metadata?.name ||
          'Admin'

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userData.user.id)
          .single()

        admin = Boolean(profile?.is_admin)

        setIsAdmin(admin)
        setAdminName(name.split('#')[0])
      }

      let query = supabase
        .from('loot_requests')
        .select('*')
        .order('created_at', { ascending: false })

      /* Non-admins only see reviewed */
      if (!admin) {
        query = query.in('status', ['approved', 'rejected'])
      }

      const { data, error } = await query

      if (error) throw error

      setRows((data as LootRow[]) || [])
      setFilteredRows((data as LootRow[]) || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load data')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  /* -------------------------------- */
  /* FILTER LOGIC */
  /* -------------------------------- */

  useEffect(() => {
    let result = [...rows]

    if (filterRaid !== 'All') {
      result = result.filter(r => r.raid === filterRaid)
    }

    if (filterClass !== 'All') {
      result = result.filter(r => r.class === filterClass)
    }

    if (filterSlot !== 'All') {
      result = result.filter(r => r.slot === filterSlot)
    }

    if (filterPriority !== 'All') {
      result = result.filter(r => r.priority === filterPriority)
    }

    result.sort((a, b) => {
      const da = new Date(a.created_at).getTime()
      const db = new Date(b.created_at).getTime()

      return filterTime === 'new' ? db - da : da - db
    })

    setFilteredRows(result)
  }, [
    rows,
    filterRaid,
    filterClass,
    filterSlot,
    filterPriority,
    filterTime,
  ])

  /* -------------------------------- */
  /* HELPERS */
  /* -------------------------------- */

  function getPriorityColor(priority: Priority) {
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
    id: string,
    updates: Partial<LootRow>
  ) {
    const { error } = await supabase
      .from('loot_requests')
      .update(updates)
      .eq('id', id)

    if (!error) await loadData()
  }

  async function updateStatus(
    id: string,
    status: 'approved' | 'rejected'
  ) {
    const { error } = await supabase
      .from('loot_requests')
      .update({
        status,
        reviewed_by: adminName,
      })
      .eq('id', id)

    if (!error) await loadData()
  }

  async function deleteRequest(id: string) {
    const { error } = await supabase
      .from('loot_requests')
      .delete()
      .eq('id', id)

    if (!error) await loadData()
  }

  async function toggleLock(row: LootRow) {
    await updateRow(row.id, {
      locked: !Boolean(row.locked),
    })
  }

  async function updatePriority(id: string, value: Priority) {
    await updateRow(id, {
      priority: value,
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
          className="bg-gray-700 px-4 py-2 rounded text-sm"
        >
          ← Back
        </button>

      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">

        <select
          value={filterRaid}
          onChange={e => setFilterRaid(e.target.value)}
          className="bg-gray-800 px-2 py-1 rounded"
        >
          <option>All</option>
          {[...new Set(rows.map(r => r.raid))].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="bg-gray-800 px-2 py-1 rounded"
        >
          <option>All</option>
          {[...new Set(rows.map(r => r.class))].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterSlot}
          onChange={e => setFilterSlot(e.target.value)}
          className="bg-gray-800 px-2 py-1 rounded"
        >
          <option>All</option>
          {[...new Set(rows.map(r => r.slot))].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="bg-gray-800 px-2 py-1 rounded"
        >
          <option>All</option>
          {PRIORITIES.map(p => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          value={filterTime}
          onChange={e =>
            setFilterTime(e.target.value as 'new' | 'old')
          }
          className="bg-gray-800 px-2 py-1 rounded"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>

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

            {/* SAME UI AS BEFORE */}
            {/* (unchanged) */}

            <div className="font-semibold">
              {row.character_name}
            </div>

            <div className="text-sm text-gray-400">
              {row.class} • {row.raid} • {row.slot}
            </div>

            <div className="mt-2 text-sm">
              Item:{' '}
              <span className="text-blue-400">
                {row.item_name}
              </span>
            </div>

            <div className="mt-1 text-sm flex items-center gap-2">

              <span>Priority:</span>

              {isAdmin && !row.locked ? (
                <select
                  value={row.priority}
                  onChange={e =>
                    updatePriority(
                      row.id,
                      e.target.value as Priority
                    )
                  }
                  className="bg-gray-700 px-2 py-1 rounded text-sm"
                >
                  {PRIORITIES.map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              ) : (
                <span className={getPriorityColor(row.priority)}>
                  {row.priority}
                </span>
              )}

            </div>

            {row.status && (
              <div className="text-xs text-gray-400 mt-2">
                {row.status === 'approved' && (
                  <>Approved by {row.reviewed_by}</>
                )}
                {row.status === 'rejected' && (
                  <>Rejected by {row.reviewed_by}</>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="flex gap-2 mt-4 flex-wrap">

                <button
                  onClick={() =>
                    updateStatus(row.id, 'approved')
                  }
                  className="bg-green-600 px-2 py-1 rounded text-xs"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(row.id, 'rejected')
                  }
                  className="bg-yellow-600 px-2 py-1 rounded text-xs"
                >
                  Reject
                </button>

                <button
                  onClick={() => toggleLock(row)}
                  className="bg-purple-600 px-2 py-1 rounded text-xs"
                >
                  {row.locked ? 'Unlock' : 'Lock'}
                </button>

                <button
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
