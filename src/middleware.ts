import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow auth routes
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return response
  }

  // Not logged in → redirect
  if (!user) {
    const redirectUrl =
      'https://ypwlkgaebzpnmpeazkqg.supabase.co/auth/v1/authorize' +
      '?provider=discord' +
      '&redirect_to=https://thirtyseven-s-project1.vercel.app/auth/callback'

    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
