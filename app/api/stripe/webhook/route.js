import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = await createServerSupabase()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.user_id
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        subscribed: true,
        stripe_customer_id: session.customer,
        updated_at: new Date().toISOString(),
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const customerId = subscription.customer
    const { data: profiles } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId)
    if (profiles?.length) {
      await supabase.from('profiles').upsert({
        id: profiles[0].id,
        subscribed: false,
        updated_at: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ received: true })
}
