import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { createMercadoPagoPreapproval } from '@/lib/mercadopago'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 5 })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!limiter.check(`mp-create:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const preapproval = await createMercadoPagoPreapproval(user.id, user.email)

    if (preapproval.id) {
      await supabase.from('profiles').upsert({
        id: user.id,
        provider: 'mercadopago',
        provider_subscription_id: preapproval.id,
        updated_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ url: preapproval.init_point || null })
  } catch {
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 })
  }
}
