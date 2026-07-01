export async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`PayPal auth error: ${data.error_description || data.error}`)
  return data.access_token
}

export async function createPayPalSubscription(accessToken, userId, email) {
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: process.env.PAYPAL_PLAN_ID,
      subscriber: { email_address: email },
      custom_id: userId,
      application_context: {
        brand_name: 'Linky',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: { payer_selected: 'PAYPAL', payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED' },
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?canceled=true`,
      },
    }),
  })
  return res.json()
}
