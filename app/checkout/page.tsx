'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import type { Customer } from '@/lib/types'

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
  'Aïn Témouchent', 'Ghardaïa', 'Relizane',
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Customer>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    wilaya: '',
    address: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError('Votre panier est vide.')
      return
    }

    if (total < 50) {
      setError('Le montant minimum pour payer par CIB/Dahabia est 50 DA.')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer: form, items, total }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          setError(data.error ?? 'Une erreur est survenue. Veuillez réessayer.')
          return
        }

        // Redirect to SATIM payment page
        if (data.formUrl) {
          clearCart()
          window.location.href = data.formUrl
        } else {
          setError('Impossible d\'obtenir le lien de paiement SATIM.')
        }
      } catch {
        setError('Erreur de connexion. Vérifiez votre connexion internet.')
      }
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Panier vide</h1>
        <Link href="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-medium">
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Customer form */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">Informations personnelles</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Mohammed"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Benali"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="exemple@email.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="0555 00 00 00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <select
                  name="wilaya"
                  value={form.wilaya}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Sélectionner une wilaya</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="N° rue, quartier, commune..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">Moyen de paiement</h2>
            <div className="flex items-center gap-3 border-2 border-green-500 bg-green-50 rounded-xl p-4">
              <input
                type="radio"
                id="cib"
                name="payment"
                value="cib"
                defaultChecked
                className="accent-green-600"
              />
              <label htmlFor="cib" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="flex gap-2 text-2xl">💳</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Carte CIB / Dahabia</p>
                  <p className="text-xs text-gray-500">Paiement sécurisé via SATIM · Algérie</p>
                </div>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Recommandé
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-72">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Votre commande</h2>

            <div className="space-y-2 text-sm text-gray-600 mb-4 max-h-48 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between gap-2">
                  <span className="truncate">
                    {product.emoji} {product.name} ×{quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {(product.price * quantity).toLocaleString('fr-DZ')} DA
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-xl text-green-700">
                  {total.toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion à SATIM...
                </>
              ) : (
                <>💳 Payer par CIB / Dahabia</>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <span>🔒</span> Paiement sécurisé SSL via SATIM
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
