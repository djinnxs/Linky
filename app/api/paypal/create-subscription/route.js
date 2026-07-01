import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { getPayPalAccessToken, createPayPalSubscription } from '@/lib/paypal'

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

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
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
