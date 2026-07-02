import crypto from 'crypto'

export function verifyMercadoPagoSignature(body, signatureHeader) {
  if (!signatureHeader || !process.env.MP_ACCESS_TOKEN) return false

  const parts = {}
  signatureHeader.split(',').forEach(p => {
    const [k, v] = p.trim().split('=')
    parts[k] = v
  })

  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const rawBody = typeof body === 'string' ? body : JSON.stringify(body)
  const message = rawBody + ts
  const expected = crypto.createHmac('sha256', process.env.MP_ACCESS_TOKEN).update(message).digest('hex')

  return expected === v1
}
