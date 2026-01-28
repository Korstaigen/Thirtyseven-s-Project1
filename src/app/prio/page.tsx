'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

type LootRow = {
  id: number
  character_name: string
  class: string
  raid: string
  item_name: string
  priority: string
  created_at: string
  status?: string
  admin_comment?: string
}

export default function PrioPage() {
  const supabase = createClient()

  const [rows, setRows] = useState<LootRow[]>([])
  const [filteredRows, setFilteredRows] = useState<LootRow[]>([])

  const [isAdmin, setIsAdmin] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* Filters */
  const [raidFilter, setRaidFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')

  /* Load data */
  useEffect(() => {
    async function load() {

      /* Get user + admin */
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userData.user.id)
          .single()

        setIsAdmin(!!profile?.is_admin)
      }

      /* Get loot requests */
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

  /* Apply filters */
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

  }, [raidFilter, classFilter, priorityFilter, dateFilter, rows])

  /* Helpers */
  function getPriorityColor(priority: string) {
    if (priority === 'High') return 'text-red-400 font-semibold'
    if (priority === 'Medium') return 'text-yellow-400'
    if (priority === 'Low') return 'text-green-400'
    return 'text-gray-300'
  }

  /* Admin Actions */

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from('loot_requests')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setRows(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status } : r
        )
      )
    }
  }

  async function deleteRequest(id: number) {
    const { error } = await supabase
      .from('loot_requests')
      .delete()
      .eq('id', id)

    if (!error) {
      setRows(prev => prev.filter(r => r.id !== id))
    }
  }

  /* Dropdown values */
  const raids = ['All', ...new Set(rows.map(r => r.raid))]
  const classes = ['All', ...new Set(rows.map(r => r.class))]
  const priorities = ['All', 'Low', 'Medium', 'High']

  /* UI */

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          Raid Priority Overview
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">

          {/* Raid */}
          <select
            value={raidFilter}
            onChange={(e) => setRaidFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {raids.map(r => (
              <option key={r}>{r}</option>
            ))}
          </select>

          {/* Class */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {classes.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          >
            {priorities.map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          {/* Date */}
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

      {/* Empty */}
      {filteredRows.length === 0 && (
        <p className="text-gray-400">
          No results found.
        </p>
      )}

      {/* Results */}
      <div className="space-y-4">

        {filteredRows.map((row) => (
          <div
            key={row.id}
            className="bg-gray-800 p-4 rounded shadow"
          >

            <div className="font-semibold">
              {row.character_name}
            </div>

            <div className="text-sm text-gray-300">
              {row.class} • {row.raid}
            </div>

            <div className="mt-2 text-sm">
              Item:{' '}
              <span className="text-blue-400">
                {row.item_name}
              </span>
            </div>

            <div className="text-sm">
              Priority:{' '}
              <span className={getPriorityColor(row.priority)}>
                {row.priority}
              </span>
            </div>

            {row.status && (
              <div className="text-xs text-gray-400 mt-1">
                Status: {row.status}
              </div>
            )}

            <div className="text-xs text-gray-500 mt-1">
              {new Date(row.created_at).toLocaleString()}
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="mt-3 flex gap-2 flex-wrap">

                <button
                  onClick={() => updateStatus(row.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(row.id, 'rejected')}
                  className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
                >
                  Reject
                </button>

                <button
                  onClick={() => deleteRequest(row.id)}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
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
