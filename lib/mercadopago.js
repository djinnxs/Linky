export async function createMercadoPagoPreapproval(userId, email) {
  const res = await fetch(`${process.env.MP_API_URL}/preapproval`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      preapproval_plan_id: process.env.MP_PREAPPROVAL_PLAN_ID,
      reason: 'Linky - $5/month',
      external_reference: userId,
      payer_email: email,
      back_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`,
      auto_recurring: { frequency: 1, frequency_type: 'months', transaction_amount: 5, currency_id: 'USD' },
      status: 'pending',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`MercadoPago error: ${data.message || JSON.stringify(data)}`)
  return data
}
