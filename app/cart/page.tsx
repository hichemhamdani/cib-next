'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Ajoutez des produits pour commencer vos achats.</p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-full transition-colors"
        >
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Mon panier{' '}
        <span className="text-base font-normal text-gray-500">({itemCount} article{itemCount > 1 ? 's' : ''})</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
            >
              {/* Emoji thumbnail */}
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {product.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                <p className="text-green-700 font-bold mt-1 text-sm">
                  {product.price.toLocaleString('fr-DZ')} DA
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 font-medium transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 font-medium transition-colors"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[90px]">
                <p className="font-bold text-gray-900 text-sm">
                  {(product.price * quantity).toLocaleString('fr-DZ')} DA
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(product.id)}
                className="text-gray-300 hover:text-red-500 transition-colors ml-1"
                title="Supprimer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-72">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Récapitulatif</h2>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between">
                  <span className="truncate pr-2">{product.name} ×{quantity}</span>
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
              <p className="text-xs text-gray-400 mt-1">TVA incluse</p>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Passer la commande →
            </Link>

            <Link
              href="/"
              className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
