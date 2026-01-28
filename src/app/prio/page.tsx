import { createClient } from '@/supabase/server'

export default async function PrioPage() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('loot_requests')
    .select('*')
    .order('raid')
    .order('item')
    .order('priority', { ascending: false })

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Error loading data: {error.message}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-gray-400">
        No priorities submitted yet.
      </div>
    )
  }

  // Group by raid -> item
  const grouped: Record<string, Record<string, any[]>> = {}

  data.forEach((row) => {
    if (!grouped[row.raid]) {
      grouped[row.raid] = {}
    }

    if (!grouped[row.raid][row.item]) {
      grouped[row.raid][row.item] = []
    }

    grouped[row.raid][row.item].push(row)
  })

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Raid Priority Overview
      </h1>

      <div className="space-y-8">

        {Object.entries(grouped).map(([raid, items]) => (
          <div key={raid} className="space-y-4">

            <h2 className="text-2xl font-semibold text-blue-400">
              {raid}
            </h2>

            {Object.entries(items).map(([item, rows]) => (
              <div
                key={item}
                className="bg-gray-800 rounded-lg p-4 space-y-2"
              >

                <h3 className="font-semibold text-lg">
                  {item}
                </h3>

                <div className="space-y-1 text-sm">

                  {rows.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between border-b border-gray-700 py-1"
                    >
                      <span>
                        {r.character_name || r.discord_name}
                      </span>

                      <span
                        className={
                          r.priority === 'High'
                            ? 'text-red-400'
                            : r.priority === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }
                      >
                        {r.priority}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            ))}

          </div>
        ))}

      </div>

    </main>
  )
}
