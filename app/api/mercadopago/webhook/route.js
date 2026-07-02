import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { verifyMercadoPagoSignature } from '@/lib/mercadopago-webhook'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 20 })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!limiter.check(`mp-webhook:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const signature = request.headers.get('x-signature') || ''
  if (!verifyMercadoPagoSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const supabase = await createServerSupabase()
  const action = body.action
  const data = body.data || {}

  try {
    if (action === 'preapproval.approved' || action === 'subscription.approved') {
      const preapprovalId = data.id
      const userId = data.external_reference

      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          subscribed: true,
          provider: 'mercadopago',
          provider_subscription_id: preapprovalId,
          updated_at: new Date().toISOString(),
        })
      }
    }

    if (action === 'preapproval.cancelled' || action === 'preapproval.paused') {
      const userId = data.external_reference

      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          subscribed: false,
          updated_at: new Date().toISOString(),
        })
      }
    }
  } catch (err) {
    console.error('MP webhook error:', err)
  }

  return NextResponse.json({ received: true })
}
