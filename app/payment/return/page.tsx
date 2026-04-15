import Link from 'next/link'
import { satimConfirmOrder } from '@/lib/satim'
import { updateOrder } from '@/lib/orders'

interface PageProps {
  searchParams: Promise<{ orderId?: string; order_id?: string }>
}

export default async function PaymentReturnPage({ searchParams }: PageProps) {
  const { orderId, order_id } = await searchParams

  // Missing params
  if (!orderId || !order_id) {
    return <ErrorView message="Paramètres de retour invalides." />
  }

  // Confirm with SATIM
  let confirmed = false
  let errorMessage = 'Erreur inconnue lors de la confirmation.'

  try {
    const response = await satimConfirmOrder(orderId)
    const code = String(response.ErrorCode)

    if (code === '0') {
      confirmed = true
      // Update order status in MongoDB
      await updateOrder(order_id, { status: 'paid', satimOrderId: orderId })
    } else {
      if (response.params?.respCode_desc) {
        errorMessage = response.params.respCode_desc
      } else if (response.actionCodeDescription) {
        errorMessage = response.actionCodeDescription
      } else if (response.ErrorMessage) {
        errorMessage = response.ErrorMessage
      }
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Impossible de contacter SATIM.'
  }

  if (!confirmed) {
    return <ErrorView message={errorMessage} />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
        <p className="text-gray-500 mb-2">
          Votre paiement a été confirmé avec succès via <strong>SATIM</strong>.
        </p>
        <p className="text-xs text-gray-400 mb-8 font-mono bg-gray-50 inline-block px-3 py-1 rounded-full">
          Réf. SATIM : {orderId}
        </p>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800 mb-8 text-left">
          <p className="font-semibold mb-1">✅ Ce que vous venez de faire :</p>
          <ul className="list-disc list-inside space-y-1 text-green-700">
            <li>Paiement débité de votre carte CIB / Dahabia</li>
            <li>Commande enregistrée et confirmée</li>
            <li>Un email de confirmation vous sera envoyé</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  )
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Échec de confirmation</h1>
        <p className="text-gray-500 mb-6">{message}</p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 mb-8 text-left">
          <p className="font-semibold mb-1">ℹ️ En cas de problème :</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Vérifiez votre solde CIB / Dahabia</li>
            <li>Contactez le numéro vert SATIM</li>
            <li>Réessayez dans quelques minutes</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/cart"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Retour au panier
          </Link>
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
