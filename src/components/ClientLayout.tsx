'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/supabase/client'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const accepted = localStorage.getItem('loot_rules_accepted')

    if (!accepted) {
      setShowModal(true)
    }

    loadUser()
  }, [])

  async function loadUser() {
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      setUser(data.user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      setIsAdmin(Boolean(profile?.is_admin))
    }
  }

  function closeModal() {
    localStorage.setItem('loot_rules_accepted', 'true')
    setShowModal(false)
  }

  return (
    <>
      {/* Top Right User Panel */}
      <div className="fixed top-3 right-3 z-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-3 text-sm text-white min-w-[180px]">

        {user ? (
          <>
            <div className="font-semibold mb-2 text-center">
              {user.user_metadata?.preferred_username ||
                user.user_metadata?.full_name ||
                user.email}
            </div>

            <div className="flex flex-col gap-2">

              <Link
                href="/"
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-center"
              >
                Loot System
              </Link>

              <Link
                href="/prio"
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-center"
              >
                Raid Priorities
              </Link>

              {/* NEW: My Priorities Button */}
              <Link
                href="/myprio"
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-center font-semibold"
              >
                My Priorities
              </Link>

              {/* Become Admin (Moved Down) */}
              {!isAdmin && (
                <Link
                  href="/become-admin"
                  className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-center"
                >
                  Become Admin
                </Link>
              )}

              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  location.reload()
                }}
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>

            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-center block"
          >
            Login
          </Link>
        )}

      </div>

      {children}

      {/* Loot System Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <div className="bg-gray-900 text-white max-w-lg w-full p-6 rounded-lg shadow-xl border border-gray-700">

            <h2 className="text-xl font-bold mb-4 text-center">
              Loot System
            </h2>

            <div className="text-sm space-y-3 text-gray-300 text-center">

              <p>
                This only applies to <b>Maximum Effort</b> raids.
                All other raids remain unchanged.
              </p>

              <p>
                SR+ has been removed. The system encouraged stacking
                and blocked progression.
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

              <p className="font-semibold text-gray-200">
                The goal is performance and consistency.
              </p>

            </div>

            <div className="mt-6 flex justify-center">

              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-semibold"
              >
                OK
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Footer Credit */}
      <div className="fixed bottom-2 right-3 text-xs text-gray-500 opacity-70 select-none pointer-events-none">
        Built by Thirtyseven
      </div>
    </>
  )
}
