import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import { getOrderByOrderNumber } from '@/lib/orders'
import { InvoicePDF } from '@/lib/invoice'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params

  let email: string
  try {
    const body = await request.json()
    email = body.email
  } catch {
    return Response.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Adresse email invalide.' }, { status: 400 })
  }

  const order = await getOrderByOrderNumber(order_id)
  if (!order) {
    return Response.json({ error: 'Commande introuvable.' }, { status: 404 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey || resendKey === 're_your_api_key') {
    return Response.json({ error: 'Service email non configuré.' }, { status: 503 })
  }

  const companyName = process.env.COMPANY_NAME ?? 'CIB Shop'
  const companyAddress = process.env.COMPANY_ADDRESS ?? 'Algérie'
  const fromEmail = process.env.FROM_EMAIL ?? `factures@shop.web-rocket.dz`

  const buffer = await renderToBuffer(
    <InvoicePDF order={order} companyName={companyName} companyAddress={companyAddress} />
  )

  const resend = new Resend(resendKey)

  await resend.emails.send({
    from: `${companyName} <${fromEmail}>`,
    to: email,
    subject: `Votre facture — ${companyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
        <h2 style="color:#16a34a;">Merci pour votre commande !</h2>
        <p>Bonjour <strong>${order.customer.firstName}</strong>,</p>
        <p>Veuillez trouver votre facture en pièce jointe.</p>
        <p style="color:#888;font-size:13px;">
          Commande n° ${order.orderNumber.slice(-8).toUpperCase()} ·
          Total : <strong>${order.total.toLocaleString('fr-DZ')} DZD</strong>
        </p>
        <p>Merci de nous avoir fait confiance.<br/><strong>${companyName}</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `facture-${order.orderNumber.slice(-8)}.pdf`,
        content: Buffer.from(buffer),
      },
    ],
  })

  return Response.json({ success: true })
}
