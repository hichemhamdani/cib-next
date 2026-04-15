import { satimRegisterOrder } from '@/lib/satim'
import { createOrder, generateOrderId } from '@/lib/orders'
import type { CartItem, Customer } from '@/lib/types'

export async function POST(request: Request) {
  let body: { customer: Customer; items: CartItem[]; total: number }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const { customer, items, total } = body

  if (!customer || !items?.length || !total) {
    return Response.json({ error: 'Données de commande manquantes.' }, { status: 400 })
  }

  if (total < 50) {
    return Response.json(
      { error: 'Le montant minimum pour payer par CIB/Dahabia est 50 DA.' },
      { status: 400 }
    )
  }

  // Generate unique order ID (like WP plugin: orderId + rand)
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

    // Save order in MongoDB
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
