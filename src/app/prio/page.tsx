import { createClient } from '@/supabase/server'

export default async function PrioPage() {
  // IMPORTANT: await here
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('loot_requests')
    .select('*')
    .order('raid', { ascending: true })
    .order('item', { ascending: true })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Raid Priorities</h1>
        <p className="text-red-400">Error loading data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Raid Priority Overview
      </h1>

      {(!data || data.length === 0) && (
        <p className="text-gray-400">
          No priorities submitted yet.
        </p>
      )}

      <div className="space-y-4">

        {data?.map((row) => (
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
              Item: <span className="text-blue-400">{row.item}</span>
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
