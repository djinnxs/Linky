import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request) {
  const body = await request.json()
  const eventType = body.event_type

  const supabase = await createServerSupabase()

  if (eventType === 'PAYMENT.SALE.COMPLETED' || eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
    const resource = body.resource
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
    const resource = body.resource
    const customId = resource.custom_id

    if (customId) {
      await supabase.from('profiles').upsert({
        id: customId,
        subscribed: false,
        updated_at: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ received: true })
}
