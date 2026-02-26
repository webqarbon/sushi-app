import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/profile`)
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=Не вдалося увійти через Google`)
}
