import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { verifyPayPalWebhook } from '@/lib/paypal-webhook'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 20 })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!limiter.check(`pp-webhook:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const valid = await verifyPayPalWebhook(request, body)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const supabase = await createServerSupabase()
  const eventType = body.event_type
  const resource = body.resource || {}

  try {
    if (eventType === 'PAYMENT.SALE.COMPLETED' || eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id || resource.billing_agreement_id
      const customId = resource.custom_id

      if (customId) {
        await supabase.from('profiles').upsert({
          id: customId,
          subscribed: true,
          provider: 'paypal',
          provider_subscription_id: subscriptionId,
          updated_at: new Date().toISOString(),
        })
      }
    }

    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      const customId = resource.custom_id

      if (customId) {
        await supabase.from('profiles').upsert({
          id: customId,
          subscribed: false,
          updated_at: new Date().toISOString(),
        })
      }
    }
  } catch (err) {
    console.error('PayPal webhook error:', err)
  }

  return NextResponse.json({ received: true })
}
