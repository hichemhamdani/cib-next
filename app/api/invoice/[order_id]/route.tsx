import { renderToBuffer } from '@react-pdf/renderer'
import { getOrderByOrderNumber } from '@/lib/orders'
import { InvoicePDF } from '@/lib/invoice'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const download = new URL(request.url).searchParams.get('download') === 'true'

  const order = await getOrderByOrderNumber(order_id)
  if (!order) {
    return new Response('Commande introuvable', { status: 404 })
  }

  const companyName = process.env.COMPANY_NAME ?? 'CIB Shop'
  const companyAddress = process.env.COMPANY_ADDRESS ?? 'Algérie'

  const buffer = await renderToBuffer(
    <InvoicePDF order={order} companyName={companyName} companyAddress={companyAddress} />
  )

  const disposition = download
    ? `attachment; filename="facture-${order_id}.pdf"`
    : `inline; filename="facture-${order_id}.pdf"`

  return new Response(Buffer.from(buffer) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': disposition,
    },
  })
}
