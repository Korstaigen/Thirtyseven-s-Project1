'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'

/* ---------------- TYPES ---------------- */

type Priority = 'Low' | 'Medium' | 'High' | 'HR'

type LootRow = {
  id: string
  user_id: string
  character_name: string
  class: string
  raid: string
  item_name: string
  slot: string
  priority: Priority
  created_at: string

  status?: 'approved' | 'rejected' | 'pending' | null
  reviewed_by?: string | null
  user_note?: string | null
  admin_note?: string | null
  locked?: boolean | null
}

type LootGroup = {
  key: string
  raid: string
  character_name: string
  class: string
  created_at: string
  rows: LootRow[]
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'HR']

/* ---------------- COMPONENT ---------------- */

export default function MyPrioritiesPage() {
  const supabase = createClient()
  const router = useRouter()

  const [rows, setRows] = useState<LootRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* -------------------------------- */
  /* LOAD DATA */
  /* -------------------------------- */

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('loot_requests')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRows((data as LootRow[]) || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load data')
    }

    setLoading(false)
  }

  /* -------------------------------- */
  /* GROUP LOGIC */
  /* -------------------------------- */

  const groupedData = useMemo<LootGroup[]>(() => {
    const map = new Map<string, LootGroup>()

    for (const row of rows) {
      const bucket = new Date(row.created_at)
      bucket.setSeconds(0, 0)

      const key = `${row.user_id}-${row.raid}-${bucket.toISOString()}`

      if (!map.has(key)) {
        map.set(key, {
          key,
          raid: row.raid,
          character_name: row.character_name,
          class: row.class,
          created_at: row.created_at,
          rows: [row],
        })
      } else {
        map.get(key)!.rows.push(row)
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      )
    })
  }, [rows])

  /* -------------------------------- */
  /* HELPERS */
  /* -------------------------------- */

  function getStatus(group: LootGroup) {
    if (group.rows.every(r => r.locked)) return 'Locked'

    if (group.rows.every(r => r.status === 'approved')) return 'Approved'

    if (group.rows.every(r => r.status === 'rejected')) return 'Rejected'

    if (group.rows.some(r => r.status === 'pending' || !r.status))
      return 'Pending'

    return 'Mixed'
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'Approved':
        return 'bg-green-600'
      case 'Rejected':
        return 'bg-red-600'
      case 'Locked':
        return 'bg-purple-600'
      case 'Pending':
        return 'bg-yellow-600'
      default:
        return 'bg-gray-600'
    }
  }

  function canEdit(row: LootRow) {
    if (row.locked) return false

    if (row.status === 'approved' || row.status === 'rejected') return true

    return false
  }

  /* -------------------------------- */
  /* USER ACTIONS */
  /* -------------------------------- */

  // Local state update helper
  function updateLocalRow(id: string, updates: Partial<LootRow>) {
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    )
  }

  async function resubmitRow(row: LootRow) {
    const { error } = await supabase
      .from('loot_requests')
      .update({
        status: 'pending',
        reviewed_by: null,
        locked: false,
      })
      .eq('id', row.id)

    if (!error) await loadData()
  }

  async function updateUserNote(id: string, note: string) {
    // Update UI immediately
    updateLocalRow(id, { user_note: note })

    await supabase
      .from('loot_requests')
      .update({ user_note: note })
      .eq('id', id)
  }

  async function updatePriority(id: string, priority: Priority) {
    // Update UI immediately
    updateLocalRow(id, { priority })

    await supabase
      .from('loot_requests')
      .update({ priority })
      .eq('id', id)
  }

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading your priorities...
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
          My Loot Priorities
        </h1>

        <button
          onClick={() => router.push('/')}
          className="bg-gray-700 px-4 py-2 rounded text-sm"
        >
          ← Back
        </button>

      </div>

      {/* Groups */}
      <div className="space-y-6 max-w-5xl mx-auto">

        {groupedData.length === 0 && (
          <div className="text-center text-gray-400">
            You have not submitted any requests yet.
          </div>
        )}

        {groupedData.map(group => {
          const status = getStatus(group)

          return (
            <div
              key={group.key}
              className="bg-gray-800 rounded-lg border border-gray-700 p-4"
            >

              {/* GROUP HEADER */}
              <div className="flex justify-between items-start mb-4">

                <div>
                  <div className="text-lg font-semibold">
                    {group.character_name}
                  </div>

                  <div className="text-sm text-gray-400">
                    {group.class} • {group.raid}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {group.rows.length} item(s)
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </div>

              </div>

              {/* ITEMS */}
              <div className="space-y-4">

                {group.rows.map(row => (
                  <div
                    key={row.id}
                    className="bg-gray-900 rounded p-3 border border-gray-700"
                  >

                    <div className="flex justify-between items-start">

                      <div>
                        <div className="text-sm">
                          <span className="text-gray-400">Item:</span>{' '}
                          <span className="text-blue-400">
                            {row.item_name}
                          </span>
                        </div>

                        <div className="text-xs text-gray-400">
                          Slot: {row.slot}
                        </div>
                      </div>

                      {row.status && (
                        <div className="text-xs text-gray-500">
                          {row.status === 'approved' && (
                            <>Approved by {row.reviewed_by}</>
                          )}

                          {row.status === 'rejected' && (
                            <>Rejected by {row.reviewed_by}</>
                          )}
                        </div>
                      )}

                    </div>

                    {/* PRIORITY */}
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span>Priority:</span>

                      {canEdit(row) ? (
                        <select
                          value={row.priority}
                          onChange={e =>
                            updatePriority(
                              row.id,
                              e.target.value as Priority
                            )
                          }
                          className="bg-gray-700 px-2 py-1 rounded"
                        >
                          {PRIORITIES.map(p => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-300">
                          {row.priority}
                        </span>
                      )}
                    </div>

                    {/* NOTES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

                      {/* User Note */}
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Your Comment
                        </div>

                        {canEdit(row) ? (
                          <textarea
                            value={row.user_note || ''}
                            onChange={e =>
                              updateLocalRow(row.id, {
                                user_note: e.target.value,
                              })
                            }
                            onBlur={e =>
                              updateUserNote(row.id, e.target.value)
                            }
                            rows={2}
                            className="bg-gray-700 w-full px-2 py-1 rounded text-sm"
                          />
                        ) : (
                          <div className="bg-gray-700 px-2 py-1 rounded text-sm min-h-[40px]">
                            {row.user_note || '—'}
                          </div>
                        )}
                      </div>

                      {/* Admin Note */}
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Admin Note
                        </div>

                        <div className="bg-gray-700 px-2 py-1 rounded text-sm min-h-[40px]">
                          {row.admin_note || '—'}
                        </div>
                      </div>

                    </div>

                    {/* RESUBMIT */}
                    {canEdit(row) && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => resubmitRow(row)}
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-semibold"
                        >
                          Resubmit for Review
                        </button>
                      </div>
                    )}

                  </div>
                ))}

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}
