'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'
import Link from 'next/link'

export default function UserBadge() {
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Loot popup state
  const [showLoot, setShowLoot] = useState(false)

  /* Load user + admin status */
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) return

      setUser(data.user)

      // Get admin flag from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      setIsAdmin(!!profile?.is_admin)
    }

    loadUser()
  }, [])

  /* Become admin */
  async function becomeAdmin() {
    if (!user) return

    const password = prompt('Enter admin password')
    if (!password) return

    const { data, error } = await supabase.rpc('become_admin', {
      input_password: password,
    })

    if (error || !data) {
      alert('Invalid password')
      return
    }

    // Re-fetch admin status from DB
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    setIsAdmin(!!profile?.is_admin)

    alert('Admin access granted')
  }

  if (!user) return null

  /* Clean Discord name */
  const rawName = user.user_metadata?.name || 'User'
  const name = rawName.split('#')[0]

  const avatar = user.user_metadata?.avatar_url

  return (
    <>
      {/* Main Badge */}
      <div className="flex flex-col gap-2 bg-gray-800 px-4 py-3 rounded-lg shadow w-64">

        {/* User Info */}
        <div className="flex items-center gap-3">

          {avatar && (
            <img
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          )}

          <div className="text-sm leading-tight">
            <div className="font-semibold">
              {name}
            </div>

            <div className="text-green-400 text-xs">
              {isAdmin ? 'Admin' : 'Logged in'}
            </div>
          </div>

        </div>

        {/* Loot System Button */}
        <button
          onClick={() => setShowLoot(true)}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-left"
        >
          Loot System
        </button>

        {/* Raid Priorities Button */}
        <Link href="/prio">
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-left"
          >
            Raid Priorities
          </button>
        </Link>

        {/* Become Admin */}
        {!isAdmin && (
          <button
            onClick={becomeAdmin}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Become Admin
          </button>
        )}

      </div>

      {/* Loot System Modal */}
      {showLoot && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">

          <div className="bg-gray-900 text-white max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg p-6 shadow-lg relative">

            {/* Close Button */}
            <button
              onClick={() => setShowLoot(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Loot System
            </h2>

            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">

              <p>
                This only applies to Maximum Effort raids. All other raids remain unchanged.
              </p>

              <p>
                SR+ has been removed. The system encouraged stacking and blocked progression.
              </p>

              <p>
                Players may SR two items. Some items are hard-reserved.
              </p>

              <p>
                Master loot is only used on Kruul and Mephistroth.
              </p>

              <p>
                Group loot is standard to improve raid speed.
              </p>

              <p>
                SR item: NEED. MS item: GREED. OS: PASS.
              </p>

              <p>
                Priority lists determine eligibility.
              </p>

              <p>
                Decisions are made for raid benefit.
              </p>

              <p>
                The goal is performance and consistency.
              </p>

            </div>

          </div>

        </div>
      )}
    </>
  )
}
