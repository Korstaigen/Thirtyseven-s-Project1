import { createClient } from '@/supabase/client'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage() {
  const supabase = createClient()

  // This will read the tokens from URL and save session
  await supabase.auth.getSession()

  // Redirect to home after login
  redirect('/')
}
