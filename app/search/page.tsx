"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Loader2, Search as SearchIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  category: string
  stock: number
  colors: { name: string; value: string }[]
  sizes: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    if (query) {
      searchProducts(query)
    } else {
      setLoading(false)
    }
  }, [query])

  const searchProducts = async (searchQuery: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      
      if (!response.ok) {
        throw new Error("Failed to search products")
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search products")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <main className="mx-auto max-w-[1920px] px-3 sm:px-4 lg:px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">
              {query ? `Search Results for "${query}"` : "Search Products"}
            </h1>
            {!loading && query && (
              <p className="text-muted-foreground mt-2">
                Found {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Searching...</span>
            </div>
          )}

          {error && (
            <Alert className="border-red-500">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && query && products.length === 0 && (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!loading && !error && !query && (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Search for products</h2>
              <p className="text-muted-foreground">
                Use the search bar above to find products
              </p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
