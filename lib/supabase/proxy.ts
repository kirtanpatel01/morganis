import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role

  // Protect routes for unauthenticated users
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/super-admin')) &&
    !request.nextUrl.pathname.startsWith('/auth/admin-login') &&
    !request.nextUrl.pathname.startsWith('/auth/admin-signup')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/admin-login'
    return NextResponse.redirect(url)
  }

  // Role-based protection
  if (user) {
    // Super Admin cannot access Admin routes
    if (role === 'super-admin' && request.nextUrl.pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/super-admin'
      return NextResponse.redirect(url)
    }

    // Admin cannot access Super Admin routes
    if (role === 'admin' && request.nextUrl.pathname.startsWith('/super-admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}