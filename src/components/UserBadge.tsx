'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'
import Link from 'next/link'

export default function UserBadge() {
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      setUser(data.user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      setIsAdmin(!!profile?.is_admin)
    }

    loadUser()
  }, [])

  async function becomeAdmin() {
    const password = prompt('Enter admin password')
    if (!password) return

    const { data, error } = await supabase.rpc('become_admin', {
      input_password: password,
    })

    if (error || !data) {
      alert('Invalid password')
      return
    }

    alert('Admin access granted')
    setIsAdmin(true)
  }

  if (!user) return null

  const rawName = user.user_metadata?.name || 'User'
  const name = rawName.split('#')[0] // remove Discord discriminator
  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="flex flex-col gap-2 bg-gray-800 px-4 py-3 rounded-lg shadow w-64">

      {/* User info */}
      <div className="flex items-center gap-3">
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
        )}

        <div className="text-sm leading-tight">
          <div className="font-semibold">{name}</div>
          <div className="text-green-400 text-xs">
            {isAdmin ? 'Admin' : 'Logged in'}
          </div>
        </div>
      </div>

      {/* Loot System button */}
      <button
        id="loot-button"
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-left"
      >
        Loot System
      </button>

      {/* Raid Priorities button */}
      <Link href="/prio">
        <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-left">
          Raid Priorities
        </button>
      </Link>

      {/* Admin action */}
      {!isAdmin && (
        <button
          onClick={becomeAdmin}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Become Admin
        </button>
      )}
    </div>
  )
}
