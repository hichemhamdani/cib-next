'use client'

import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'
import { useState } from 'react'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Product image placeholder */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-40 flex items-center justify-center text-6xl">
        {product.emoji}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString('fr-DZ')} <span className="text-sm font-normal text-gray-500">DA</span>
          </span>
          <button
            onClick={handleAdd}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              added
                ? 'bg-green-100 text-green-700'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {added ? '✓ Ajouté' : '+ Panier'}
          </button>
        </div>
      </div>
    </div>
  )
}
