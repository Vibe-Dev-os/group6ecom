"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
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

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
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

  // Filter products by category
  const filteredProducts = products.filter((p) => p.category === params.category)

  const categoryNames: Record<string, string> = {
    laptops: "Gaming Laptops",
    mice: "Gaming Mice",
    chairs: "Gaming Chairs",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="mx-auto max-w-[1920px] px-3 py-8 sm:px-4 lg:px-6">
        <h1 className="mb-8 text-3xl font-bold">{categoryNames[params.category] || "Products"}</h1>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No products found in this category.</div>
        )}

        {/* Featured Products Section */}
        <div className="mt-16">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Featured Products</h2>
          <InfiniteScrollProducts products={products} />
        </div>
      </main>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
