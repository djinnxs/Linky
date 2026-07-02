import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { getPayPalAccessToken, createPayPalSubscription } from '@/lib/paypal'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 5 })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!limiter.check(`pp-create:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const token = await getPayPalAccessToken()
    const subscription = await createPayPalSubscription(token, user.id, user.email)

    if (subscription.id) {
      await supabase.from('profiles').upsert({
        id: user.id,
        provider: 'paypal',
        provider_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      })
    }

    const approveLink = subscription.links?.find(l => l.rel === 'approve')
    return NextResponse.json({ url: approveLink?.href || null })
  } catch {
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 })
  }
}
