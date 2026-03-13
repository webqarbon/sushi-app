import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

function safeRedirectPath(next: string | null): string {
  if (!next || typeof next !== 'string') return '/profile'
  const path = next.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.includes(':')) return '/profile'
  return path
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const path = safeRedirectPath(next)
      return NextResponse.redirect(`${baseUrl}${path}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=Не вдалося увійти через Google`)
}
