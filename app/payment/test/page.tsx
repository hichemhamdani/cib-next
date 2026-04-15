interface PageProps {
  searchParams: Promise<{
    order_id?: string
    amount?: string
    returnUrl?: string
    failUrl?: string
  }>
}

export default async function MockPaymentPage({ searchParams }: PageProps) {
  const { order_id, amount, returnUrl, failUrl } = await searchParams

  const mockOrderId = `MOCK_${order_id}`
  const successUrl = returnUrl
    ? `${decodeURIComponent(returnUrl)}&orderId=${mockOrderId}`
    : `/payment/return?order_id=${order_id}&orderId=${mockOrderId}`
  const failureUrl = failUrl
    ? `${decodeURIComponent(failUrl)}&orderId=${mockOrderId}`
    : `/payment/fail?order_id=${order_id}&orderId=${mockOrderId}`

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">

        {/* Header SATIM simulé */}
        <div className="bg-[#006837] px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#006837] text-sm">
            S
          </div>
          <div>
            <p className="text-white font-bold text-sm">SATIM — Simulation</p>
            <p className="text-green-200 text-xs">Paiement sécurisé (mode test)</p>
          </div>
          <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
            MOCK
          </span>
        </div>

        <div className="p-6">
          {/* Infos commande */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">N° commande</span>
              <span className="font-mono font-medium text-gray-700">{order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Montant</span>
              <span className="font-bold text-gray-900 text-base">
                {amount ? Number(amount).toLocaleString('fr-DZ') : '—'} DA
              </span>
            </div>
          </div>

          {/* Faux formulaire carte */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Numéro de carte
              </label>
              <input
                type="text"
                defaultValue="0000 0000 0000 0000"
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Date d&apos;expiration
                </label>
                <input
                  type="text"
                  defaultValue="MM/AA"
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Code PIN
                </label>
                <input
                  type="password"
                  defaultValue="0000"
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5 text-center">
            ⚠️ Ceci est une simulation — aucun paiement réel n&apos;est effectué
          </p>

          {/* Boutons de simulation */}
          <div className="space-y-3">
            <a
              href={successUrl}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              ✅ Simuler un paiement réussi
            </a>
            <a
              href={failureUrl}
              className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              ❌ Simuler un paiement échoué
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
