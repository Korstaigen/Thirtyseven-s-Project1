'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

type OnlineUser = {
  id: string
  name: string
  avatar: string | null
  isAdmin: boolean
}

type ChannelStatus =
  | 'SUBSCRIBED'
  | 'TIMED_OUT'
  | 'CLOSED'
  | 'CHANNEL_ERROR'

export default function OnlineUsers() {
  const supabase = createClient()
  const [users, setUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      /* Get profile */
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

      channel.on('presence', { event: 'sync' }, () => {
        const state = channel!.presenceState()
        const list: OnlineUser[] = []

        for (const id in state) {
          list.push(state[id][0] as OnlineUser)
        }

        setUsers(list)
      })

      // 🔒 TYPE-SAFE STATUS HANDLER (Supabase-proof)
      const handleStatus = (status: ChannelStatus) => {
        if (status === 'SUBSCRIBED') {
          channel!.track(payload)
        }
      }

      // 👇 Cast required because Supabase types are wrong
      channel.subscribe(handleStatus as unknown as (status: any) => void)
    }

    init()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow w-64">
      <h2 className="font-bold mb-3">
        Online Users ({users.length})
      </h2>

      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-2 text-sm">
            <img
              src={
                u.avatar ||
                'https://cdn.discordapp.com/embed/avatars/0.png'
              }
              alt={u.name}
              className="w-8 h-8 rounded-full"
            />

            <div className="flex flex-col leading-tight">
              <span className="font-medium">{u.name}</span>
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
