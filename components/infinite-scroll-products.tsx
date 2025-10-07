"use client"

import { useRef, useState, useEffect } from "react"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

interface InfiniteScrollProductsProps {
  products: Product[]
}

export function InfiniteScrollProducts({ products }: InfiniteScrollProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)

  // Duplicate products array multiple times for seamless infinite loop
  const duplicatedProducts = [...products, ...products, ...products, ...products]

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollSpeed = 1 // Pixels per frame (adjust for faster/slower)
    let lastTime = 0

    const animate = (currentTime: number) => {
      if (!isPaused && container) {
        // Calculate delta time for smooth animation
        if (lastTime !== 0) {
          const deltaTime = currentTime - lastTime
          const scrollAmount = scrollSpeed * (deltaTime / 16) // Normalize to 60fps
          
          container.scrollLeft += scrollAmount

          // Reset scroll position for infinite loop
          const maxScroll = container.scrollWidth / 4 // Since we have 4x duplication
          if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = 0
          }
        }
        lastTime = currentTime
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused])

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient overlays for smooth fade effect on edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background/80 via-background/20 to-transparent" />

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-muted/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-foreground/60"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "hsl(var(--foreground) / 0.4) hsl(var(--muted) / 0.5)",
          }}
        >
          {duplicatedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="w-80 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
