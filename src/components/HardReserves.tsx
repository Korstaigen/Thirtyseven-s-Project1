'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

type HR = {
  id: number
  item_name: string
  note: string | null
}

export default function HardReserves() {
  const supabase = createClient()

  const [rows, setRows] = useState<HR[]>([])
  const [filteredRows, setFilteredRows] = useState<HR[]>([])

  const [isAdmin, setIsAdmin] = useState(false)

  const [item, setItem] = useState('')
  const [note, setNote] = useState('')

  const [search, setSearch] = useState('')

  /* Load */
  useEffect(() => {
    load()
  }, [])

  /* Filter */
  useEffect(() => {
    let result = [...rows]

    if (search.trim()) {
      const q = search.toLowerCase()

      result = result.filter(r =>
        r.item_name.toLowerCase().includes(q) ||
        (r.note || '').toLowerCase().includes(q)
      )
    }

    setFilteredRows(result)
  }, [search, rows])

  async function load() {

    const { data: userData } =
      await supabase.auth.getUser()

    if (userData.user) {

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userData.user.id)
        .single()

      setIsAdmin(!!profile?.is_admin)
    }

    const { data } = await supabase
      .from('hard_reserves')
      .select('*')
      .order('created_at', { ascending: false })

    setRows(data || [])
    setFilteredRows(data || [])
  }

  /* Add */
  async function add() {

    if (!item.trim()) return

    await supabase
      .from('hard_reserves')
      .insert({
        item_name: item,
        note,
      })

    setItem('')
    setNote('')

    load()
  }

  /* Update */
  async function update(
    id: number,
    field: 'item_name' | 'note',
    value: string
  ) {

    await supabase
      .from('hard_reserves')
      .update({
        [field]: value,
      })
      .eq('id', id)

    load()
  }

  /* Delete */
  async function remove(id: number) {

    await supabase
      .from('hard_reserves')
      .delete()
      .eq('id', id)

    load()
  }

  /* UI */
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow w-full max-w-sm">

      <h2 className="text-lg font-bold mb-3">
        Hard Reserves
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search hard reserves..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-gray-700 px-2 py-1 rounded w-full text-sm mb-3"
      />

      {/* List */}
      <div className="space-y-3 mb-4 max-h-[55vh] overflow-y-auto">

        {filteredRows.length === 0 && (
          <div className="text-gray-400 text-sm text-center">
            No matches
          </div>
        )}

        {filteredRows.map(r => (
          <div
            key={r.id}
            className="border border-gray-700 rounded p-2"
          >

            {/* Item */}
            {isAdmin ? (
              <input
                defaultValue={r.item_name}
                onBlur={(e) =>
                  update(
                    r.id,
                    'item_name',
                    e.target.value
                  )
                }
                className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
              />
            ) : (
              <div className="font-semibold text-sm">
                {r.item_name}
              </div>
            )}

            {/* Note */}
            {isAdmin ? (
              <textarea
                defaultValue={r.note || ''}
                onBlur={(e) =>
                  update(
                    r.id,
                    'note',
                    e.target.value
                  )
                }
                className="bg-gray-700 px-2 py-1 rounded w-full text-xs mt-1"
                rows={2}
              />
            ) : (
              <div className="text-xs text-gray-400 mt-1">
                {r.note || '—'}
              </div>
            )}

            {/* Delete */}
            {isAdmin && (
              <button
                onClick={() => remove(r.id)}
                className="text-red-400 text-xs mt-1"
              >
                Delete
              </button>
            )}

          </div>
        ))}

      </div>

      {/* Add */}
      {isAdmin && (
        <div className="space-y-2">

          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Item name"
            className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
          />

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
          />

          <button
            onClick={add}
            className="w-full bg-blue-600 hover:bg-blue-700 py-1 rounded text-sm"
          >
            Add Hard Reserve
          </button>

        </div>
      )}

    </div>
  )
}
