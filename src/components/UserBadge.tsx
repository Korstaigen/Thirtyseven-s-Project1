'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

export default function UserBadge() {
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [])

  if (!user) return null

  const rawName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    'User'

  // Remove #1234 or !1234
  const cleanName = rawName
    .split('#')[0]
    .split('!')[0]

  const avatar = user.user_metadata?.avatar_url

  return (
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
          {cleanName}
        </div>

        <div className="text-green-400 text-xs">
          Logged in
        </div>
      </div>

    </div>
  )
}
