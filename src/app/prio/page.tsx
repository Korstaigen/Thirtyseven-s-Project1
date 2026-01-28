'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

type LootRow = {
  id: number
  character_name: string
  class: string
  raid: string
  item: string
  priority: string
}

export default function PrioPage() {
  const supabase = createClient()

  const [rows, setRows] = useState<LootRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('loot_requests')
        .select('*')
        .order('raid', { ascending: true })
        .order('item', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setRows(data || [])
      }

      setLoading(false)
    }

    load()
  }, [])

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
        <h1 className="text-2xl font-bold mb-4">Raid Priorities</h1>
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Raid Priority Overview
      </h1>

      {rows.length === 0 && (
        <p className="text-gray-400">
          No priorities submitted yet.
        </p>
      )}

      <div className="space-y-4">

        {rows.map((row) => (
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
                {row.item}
              </span>
            </div>

            <div className="text-sm">
              Priority:{' '}
              <span className="text-yellow-400">
                {row.priority}
              </span>
            </div>
          </div>
        ))}

      </div>

    </div>
  )
}
