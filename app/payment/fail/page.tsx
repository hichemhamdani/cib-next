import { redirect } from 'next/navigation'
import { satimConfirmOrder } from '@/lib/satim'
import { updateOrder } from '@/lib/orders'

interface PageProps {
  searchParams: Promise<{ orderId?: string; order_id?: string }>
}

export default async function PaymentFailPage({ searchParams }: PageProps) {
  const { orderId, order_id } = await searchParams

  let errorMessage = 'Votre transaction a été refusée.'

  if (orderId) {
    try {
      const response = await satimConfirmOrder(orderId)
      const code = String(response.ErrorCode)

      if (code === '0' && response.respCode === '00') {
        errorMessage = 'Votre transaction a été rejetée par votre banque.'
      } else {
        if (response.params?.respCode_desc) errorMessage = response.params.respCode_desc
        else if (response.actionCodeDescription) errorMessage = response.actionCodeDescription
        else if (response.ErrorMessage) errorMessage = response.ErrorMessage
      }

      if (order_id) {
        await updateOrder(order_id, { status: 'failed', errorMessage })
      }
    } catch {
      errorMessage = 'Impossible de contacter SATIM. Veuillez réessayer.'
    }
  }

  redirect('/cart?error=' + encodeURIComponent(errorMessage))
}
