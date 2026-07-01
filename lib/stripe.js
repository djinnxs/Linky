import Stripe from 'stripe'

export const PRICES = {
  monthly: { id: 'price_monthly', amount: 5 },
  yearly: { id: 'price_yearly', amount: 49 },
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY no configurada')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}
