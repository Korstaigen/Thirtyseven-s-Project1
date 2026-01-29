'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'
import type {
  RealtimeChannel,
  RealtimeChannelState,
} from '@supabase/supabase-js'

type OnlineUser = {
  id: string
  name: string
  avatar: string | null
  isAdmin: boolean
}

export default function OnlineUsers() {
  const supabase = createClient()

  const [users, setUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    async function init() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) return

      /* Load profile */
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, avatar_url')
        .eq('id', data.user.id)
        .single()

      const payload: OnlineUser = {
        id: data.user.id,
        name: data.user.user_metadata?.name || 'Unknown',
        avatar: profile?.avatar_url || null,
        isAdmin: Boolean(profile?.is_admin),
      }

      channel = supabase.channel('online-users', {
        config: {
          presence: {
            key: data.user.id,
          },
        },
      })

      /* Presence Sync */
      channel.on('presence', { event: 'sync' }, () => {
        if (!channel) return

        const state = channel.presenceState()
        const list: OnlineUser[] = []

        for (const id in state) {
          const presences = state[id]

          if (presences?.length) {
            list.push(presences[0] as OnlineUser)
          }
        }

        setUsers(list)
      })

      /* Subscribe */
      channel.subscribe(
        async (status: RealtimeChannelState) => {
          if (status === 'SUBSCRIBED' && channel) {
            await channel.track(payload)
          }
        }
      )
    }

    init()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow w-64">

      <h2 className="font-bold mb-3">
        Online Users ({users.length})
      </h2>

      <div className="space-y-2">

        {users.map(u => (
          <div
            key={u.id}
            className="flex items-center gap-2 text-sm"
          >

            <img
              src={
                u.avatar ||
                'https://cdn.discordapp.com/embed/avatars/0.png'
              }
              alt={u.name}
              className="w-8 h-8 rounded-full"
            />

            <div className="flex flex-col leading-tight">

              <span className="font-medium">
                {u.name}
              </span>

              <span
                className={`text-xs ${
                  u.isAdmin
                    ? 'text-purple-400'
                    : 'text-gray-400'
                }`}
              >
                {u.isAdmin ? 'Admin' : 'User'}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}
