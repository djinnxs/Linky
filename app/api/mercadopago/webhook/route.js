import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request) {
  const body = await request.json()
  const action = body.action

  const supabase = await createServerSupabase()

  if (action === 'preapproval.approved' || action === 'subscription.approved') {
    const data = body.data
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
    const data = body.data
    const userId = data.external_reference

    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        subscribed: false,
        updated_at: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ received: true })
}
