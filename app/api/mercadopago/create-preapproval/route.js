import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { createMercadoPagoPreapproval } from '@/lib/mercadopago'

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

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
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
