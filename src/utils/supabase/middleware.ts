import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect Auth routes (login, reset-password) from already authenticated users
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/reset-password'))) {
    const isAdmin = user.user_metadata?.role === 'admin';
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? '/admin' : '/profile';
    return NextResponse.redirect(url);
  }

  // Protect the Profile route
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const isAdmin = user.user_metadata?.role === 'admin';
    if (isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  // Protect Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude login page from redirect
    if (request.nextUrl.pathname === '/admin/login') {
      return supabaseResponse
    }

    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    const isAdmin = user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
