import Link from 'next/link'
import { redirect } from 'next/navigation'
import { satimConfirmOrder } from '@/lib/satim'
import { updateOrder, getOrderByOrderNumber } from '@/lib/orders'

interface PageProps {
  searchParams: Promise<{ orderId?: string; order_id?: string }>
}

export default async function PaymentReturnPage({ searchParams }: PageProps) {
  const { orderId, order_id } = await searchParams

  if (!orderId || !order_id) {
    redirect('/cart?error=' + encodeURIComponent('Paramètres de retour invalides.'))
  }

  let errorMessage = 'Erreur inconnue lors de la confirmation.'

  try {
    const response = await satimConfirmOrder(orderId)
    const code = String(response.ErrorCode)

    if (code === '0') {
      await updateOrder(order_id, { status: 'paid', satimOrderId: orderId })
    } else {
      if (response.params?.respCode_desc) errorMessage = response.params.respCode_desc
      else if (response.actionCodeDescription) errorMessage = response.actionCodeDescription
      else if (response.ErrorMessage) errorMessage = response.ErrorMessage

      redirect('/cart?error=' + encodeURIComponent(errorMessage))
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Impossible de contacter SATIM.'
    redirect('/cart?error=' + encodeURIComponent(errorMessage))
  }

  // Fetch order details for the summary
  const order = await getOrderByOrderNumber(order_id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header succès */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Merci {order?.customer.firstName} ! 🎉
        </h1>
        <p className="text-gray-500 text-sm">
          Votre commande a été confirmée et votre paiement validé par <strong>SATIM</strong>.
        </p>
        <p className="text-xs text-gray-400 mt-3 font-mono bg-gray-50 inline-block px-3 py-1 rounded-full">
          Réf. SATIM : {orderId}
        </p>
      </div>

      {/* Résumé commande */}
      {order && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Récapitulatif de la commande</h2>
          </div>

          {/* Articles */}
          <div className="divide-y divide-gray-50">
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-12 h-12 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-0.5">×{quantity}</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {(product.price * quantity).toLocaleString('fr-DZ')} DA
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total payé</span>
            <span className="font-bold text-xl text-green-700">
              {order.total.toLocaleString('fr-DZ')} DA
            </span>
          </div>
        </div>
      )}

      {/* Infos livraison */}
      {order && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Informations de livraison</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Nom complet</p>
              <p className="font-medium text-gray-800">{order.customer.firstName} {order.customer.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Téléphone</p>
              <p className="font-medium text-gray-800">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Wilaya</p>
              <p className="font-medium text-gray-800">{order.customer.wilaya}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Email</p>
              <p className="font-medium text-gray-800 truncate">{order.customer.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-xs mb-0.5">Adresse</p>
              <p className="font-medium text-gray-800">{order.customer.address}</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-xl transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  )
}
