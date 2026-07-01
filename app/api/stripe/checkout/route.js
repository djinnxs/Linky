import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { PRICES, getStripe } from '@/lib/stripe'

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICES.monthly.id, quantity: 1 }],
      customer_email: user.email,
      metadata: { user_id: user.id },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
