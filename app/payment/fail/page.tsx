import Link from 'next/link'
import { satimConfirmOrder } from '@/lib/satim'
import { updateOrder } from '@/lib/orders'

interface PageProps {
  searchParams: Promise<{ orderId?: string; order_id?: string }>
}

export default async function PaymentFailPage({ searchParams }: PageProps) {
  const { orderId, order_id } = await searchParams

  let errorMessage = 'Votre transaction a été refusée.'

  // Even on fail URL, call confirmOrder to get the real error reason
  if (orderId) {
    try {
      const response = await satimConfirmOrder(orderId)
      const code = String(response.ErrorCode)

      if (code === '0' && response.respCode === '00') {
        // Rejected by bank
        errorMessage = 'Votre transaction a été rejetée / Your transaction was rejected / تم رفض معاملتك'
      } else {
        if (response.params?.respCode_desc) {
          errorMessage = response.params.respCode_desc
        } else if (response.actionCodeDescription) {
          errorMessage = response.actionCodeDescription
        } else if (response.ErrorMessage) {
          errorMessage = response.ErrorMessage
        }
      }

      // Update order status in MongoDB
      if (order_id) {
        await updateOrder(order_id, { status: 'failed', errorMessage })
      }
    } catch {
      errorMessage = 'Impossible de contacter SATIM pour obtenir le détail de l\'erreur.'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement échoué</h1>
        <p className="text-gray-500 mb-6">{errorMessage}</p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 mb-8 text-left">
          <p className="font-semibold mb-2">ℹ️ Causes possibles :</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Solde insuffisant sur votre carte CIB / Dahabia</li>
            <li>Carte expirée ou bloquée</li>
            <li>Code PIN incorrect</li>
            <li>Plafond de paiement en ligne dépassé</li>
            <li>Problème temporaire avec le serveur SATIM</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-8 text-left">
          <p className="font-semibold mb-1">📞 Contactez SATIM :</p>
          <p className="text-blue-700">Numéro vert : <strong>3020</strong></p>
          <p className="text-blue-600 text-xs mt-1">Disponible 24h/24, 7j/7</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/checkout"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Réessayer le paiement
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
