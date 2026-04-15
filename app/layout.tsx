import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import Navbar from '@/app/components/navbar'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CIB Shop — Paiement par Carte CIB & Dahabia',
  description: 'Boutique en ligne avec paiement sécurisé par carte CIB et Dahabia (SATIM)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
              <p>© 2025 CIB Shop — Paiement sécurisé par carte CIB &amp; Dahabia (SATIM)</p>
              <p className="mt-1">Développé par <strong>Web Rocket</strong></p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
