"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { InfiniteScrollProducts } from "@/components/infinite-scroll-products"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  colors: { name: string; value: string }[]
  sizes: string[]
  category: string
  stock?: number
  status?: "active" | "inactive" | "out_of_stock"
}

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  const featuredProduct = filteredProducts[0]
  const otherProducts = filteredProducts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="mx-auto max-w-[1920px] px-3 py-8 sm:px-4 lg:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Featured product - takes up 2 columns on large screens */}
          <div className="lg:col-span-2 lg:row-span-2">
            <ProductCard product={featuredProduct} featured />
          </div>

          {/* Other products in a grid */}
          {otherProducts.slice(0, 2).map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Featured Products</h2>
          <InfiniteScrollProducts products={filteredProducts} />
        </div>
      </main>

      <Footer />
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
