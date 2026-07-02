import { getPayPalAccessToken } from './paypal'

export async function verifyPayPalWebhook(request, body) {
  if (!process.env.PAYPAL_WEBHOOK_ID) return true

  const headers = {
    'auth_algo': request.headers.get('paypal-auth-algo') || '',
    'cert_url': request.headers.get('paypal-cert-url') || '',
    'transmission_id': request.headers.get('paypal-transmission-id') || '',
    'transmission_sig': request.headers.get('paypal-transmission-sig') || '',
    'transmission_time': request.headers.get('paypal-transmission-time') || '',
  }

  if (!headers.transmission_sig) return false

  try {
    const token = await getPayPalAccessToken()
    const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: headers.auth_algo,
        cert_url: headers.cert_url,
        transmission_id: headers.transmission_id,
        transmission_sig: headers.transmission_sig,
        transmission_time: headers.transmission_time,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      }),
    })

    const data = await res.json()
    return data.verification_status === 'SUCCESS'
  } catch {
    return false
  }
}
