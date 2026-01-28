'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'
import Link from 'next/link'

export default function UserBadge() {
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [showLoot, setShowLoot] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [])

  if (!user) return null

  /* Clean Discord name */
  const rawName = user.user_metadata?.name || 'User'
  const name = rawName.split('#')[0]

  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="flex flex-col gap-2">

      {/* User Info */}
      <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg shadow">

        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />
        )}

        <div className="text-sm leading-tight">
          <div className="font-semibold">
            {name}
          </div>

          <div className="text-green-400 text-xs">
            Logged in
          </div>
        </div>

      </div>

      {/* Loot System Button */}
      <button
        onClick={() => setShowLoot(true)}
        className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded shadow text-sm w-full"
      >
        Loot System
      </button>

      {/* Raid Priority Button */}
      <Link href="/prio">
        <button
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded shadow text-sm w-full"
        >
          Raid Priorities
        </button>
      </Link>

      {/* Loot Modal */}
      {showLoot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gray-900 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg relative">

            <button
              onClick={() => setShowLoot(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Loot System
            </h2>

            <div className="text-sm space-y-3 text-gray-200 leading-relaxed">

              <p>
                DISCLAIMER: This only applies to Maximum Effort raids.
              </p>

              <p>
                SR+ is abolished. It is outdated and creates gatekeeping.
              </p>

              <p>
                2x SR / 1 MS remains. Some items are HR based on priority or rolls.
              </p>

              <p>
                Masterloot is only used on Kruul and Meph.
              </p>

              <p>
                Group loot is standard to improve speed and efficiency.
              </p>

              <p>
                SR = Need, MS = Greed, OS = Pass.
              </p>

              <p>
                OS is always lowest priority unless all pass.
              </p>

              <p>
                Priority list is maintained for raid benefit.
              </p>

              <p>
                Names are added based on performance and raid needs.
              </p>

              <p>
                Open items must be requested in advance.
              </p>

              <p>
                Focus is on performance first, loot second.
              </p>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
