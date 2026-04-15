import { products, categories } from '@/lib/products'
import ProductCard from '@/app/components/product-card'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 mb-10 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Boutique CIB Shop 🛍️</h1>
        <p className="text-green-100 text-lg">
          Paiement sécurisé par carte <strong>CIB</strong> et <strong>Dahabia</strong> via SATIM
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 text-sm text-green-200">
          <span>✅ Paiement 100% sécurisé</span>
          <span>·</span>
          <span>🏦 Certifié SATIM</span>
          <span>·</span>
          <span>🇩🇿 Livraison partout en Algérie</span>
        </div>
      </div>

      {/* Products by category */}
      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products
              .filter((p) => p.category === category)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
