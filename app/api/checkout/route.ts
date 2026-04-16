import { satimRegisterOrder } from '@/lib/satim'
import { createOrder, generateOrderId } from '@/lib/orders'
import type { CartItem, Customer } from '@/lib/types'

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return false

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  })

  const data = await res.json() as { success: boolean }
  return data.success === true
}

export async function POST(request: Request) {
  let body: { customer: Customer; items: CartItem[]; total: number; recaptchaToken?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const { customer, items, total, recaptchaToken } = body

  if (!customer || !items?.length || !total) {
    return Response.json({ error: 'Données de commande manquantes.' }, { status: 400 })
  }

  // Verify reCAPTCHA (skipped in mock mode)
  if (process.env.SATIM_MOCK_MODE !== 'true') {
    if (!recaptchaToken) {
      return Response.json({ error: 'Veuillez confirmer que vous n\'êtes pas un robot.' }, { status: 400 })
    }

    const captchaValid = await verifyRecaptcha(recaptchaToken)
    if (!captchaValid) {
      return Response.json({ error: 'Vérification anti-bot échouée. Veuillez réessayer.' }, { status: 400 })
    }
  }

  if (total < 50) {
    return Response.json(
      { error: 'Le montant minimum pour payer par CIB/Dahabia est 50 DA.' },
      { status: 400 }
    )
  }

  const orderId = generateOrderId()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  try {
    const satimResponse = await satimRegisterOrder({
      orderNumber: orderId,
      amount: total,
      returnUrl: `${baseUrl}/payment/return?order_id=${orderId}`,
      failUrl: `${baseUrl}/payment/fail?order_id=${orderId}`,
      language: 'FR',
    })

    if (String(satimResponse.errorCode) !== '0') {
      const satimError = `[SATIM errorCode ${satimResponse.errorCode}] ${satimResponse.errorMessage ?? 'Pas de message'}`
      console.error('SATIM register error:', satimError)
      return Response.json({ error: satimError }, { status: 502 })
    }

    await createOrder({
      id: orderId,
      orderNumber: orderId,
      items,
      customer,
      total,
      status: 'pending',
      createdAt: new Date(),
    })

    return Response.json({
      success: true,
      formUrl: satimResponse.formUrl,
      orderId: satimResponse.orderId,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne du serveur.'
    return Response.json({ error: message }, { status: 500 })
  }
}
