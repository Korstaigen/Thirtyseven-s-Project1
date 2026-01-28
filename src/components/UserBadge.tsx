'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

export default function UserBadge() {
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) return

      setUser(auth.user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', auth.user.id)
        .single()

      setIsAdmin(profile?.is_admin || false)

      setLoading(false)
    }

    load()
  }, [])

  async function becomeAdmin() {
    const password = prompt('Enter admin password')

    if (!password) return

    const { error } = await supabase.rpc('make_admin', {
      p_password: password,
    })

    if (error) {
      alert('Wrong password')
    } else {
      alert('You are now admin')
      setIsAdmin(true)
    }
  }

  if (!user || loading) return null

  const name = user.user_metadata?.name?.split('#')[0] || 'User'
  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="flex flex-col gap-2 bg-gray-800 px-4 py-3 rounded-lg shadow">

      {/* User Row */}
      <div className="flex items-center gap-3">

        {avatar && (
          <img
            src={avatar}
            className="w-9 h-9 rounded-full"
          />
        )}

        <div className="text-sm">
          <div className="font-semibold">
            {name}
          </div>

          <div className="text-xs text-green-400">
            Logged in
          </div>

          {isAdmin && (
            <div className="text-xs text-red-400 font-semibold">
              Admin
            </div>
          )}
        </div>

      </div>

      {/* Admin Button */}
      {!isAdmin && (
        <button
          onClick={becomeAdmin}
          className="bg-gray-700 hover:bg-gray-600 py-1 rounded text-xs"
        >
          Become Admin
        </button>
      )}

    </div>
  )
}
