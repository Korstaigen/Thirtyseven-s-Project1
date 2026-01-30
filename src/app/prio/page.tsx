'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'

/* ---------------- TYPES ---------------- */

type Priority = 'Low' | 'Medium' | 'High' | 'HR'

type LootRow = {
  id: string // uuid

  user_id: string
  discord_name: string

  character_name: string
  class: string
  raid: string
  item_name: string
  slot: string
  priority: Priority

  created_at: string

  status?: 'approved' | 'rejected' | null
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

      if (!admin) {
        query = query.in('status', ['approved', 'rejected'])
      }

      const { data, error } = await query

      if (error) throw error

      setRows((data as LootRow[]) || [])
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

    if (error) {
      console.error(error)
      return
    }

    await loadData()
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

    if (error) {
      console.error(error)
      return
    }

    await loadData()
  }

  async function deleteRequest(id: string) {
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
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
        >
          ← Back
        </button>

      </div>

      {/* Results */}
      <div className="space-y-4">

        {rows.map(row => (

          <div
            key={row.id}
            className={`bg-gray-800 p-4 rounded ${
              row.locked ? 'opacity-70' : ''
            }`}
          >

            {/* Basic Info */}
            <div className="font-semibold">
              {row.character_name}
            </div>

            <div className="text-sm text-gray-400">
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
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={getPriorityColor(row.priority)}>
                  {row.priority}
                </span>
              )}

            </div>

            {/* STATUS */}
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

            {/* NOTES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

              {/* User Note */}
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  User Comment
                </div>

                <div className="bg-gray-700 px-2 py-1 rounded text-sm min-h-[40px]">
                  {row.user_note || '—'}
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Admin Note
                </div>

                {!isAdmin || row.locked ? (
                  <div className="bg-gray-700 px-2 py-1 rounded text-sm min-h-[40px]">
                    {row.admin_note || '—'}
                  </div>
                ) : (
                  <textarea
                    defaultValue={row.admin_note || ''}
                    onBlur={e =>
                      updateRow(row.id, {
                        admin_note: e.target.value,
                      })
                    }
                    className="bg-gray-700 w-full px-2 py-1 rounded text-sm"
                    rows={2}
                  />
                )}

              </div>

            </div>

            {/* ADMIN CONTROLS */}
            {isAdmin && (
              <div className="flex gap-2 mt-4 flex-wrap">

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
