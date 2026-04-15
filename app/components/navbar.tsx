'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { itemCount } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-green-700">
          <span className="text-2xl">🛒</span>
          <span>CIB Shop</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-green-700 transition-colors">
            Accueil
          </Link>
          <Link href="/" className="hover:text-green-700 transition-colors">
            Boutique
          </Link>
        </nav>

        {/* Cart button */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Panier</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
