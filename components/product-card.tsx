import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/currency"
import { getStockStatus } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Plus, Check } from "lucide-react"

interface ProductCardProps {
  product: Product
  featured?: boolean
  transparent?: boolean
}

export function ProductCard({ product, featured = false, transparent = false }: ProductCardProps) {
  const formattedPrice = formatPrice(product.price)
  const stockStatus = getStockStatus(product.stock || 0)
  const { data: session } = useSession()
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation()

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (product.stock === 0) {
      return // Don't add out of stock items
    }

    setIsAdding(true)
    
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
        color: product.colors[0]?.name || "Default",
        size: product.sizes[0] || "Standard",
      })
      
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000) // Reset after 2 seconds
      
      // Show success toast
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsAdding(false)
    }
  }

  if (featured) {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-border bg-black transition-all duration-300 hover:border-green-500"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-black">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={100}
            priority
            unoptimized
          />
          {/* Stock Status Badge */}
          {product.stock !== undefined && (
            <div className="absolute top-4 right-4">
              <Badge className={stockStatus.color}>
                {stockStatus.quantityLabel}
              </Badge>
            </div>
          )}

          {/* Cart Button */}
          <div className="absolute top-4 left-4">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              size="sm"
              className={`h-10 w-10 rounded-full p-0 transition-all duration-200 ${
                justAdded 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-white hover:bg-gray-100 text-black border border-gray-200"
              } ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isAdding ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              ) : justAdded ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 sm:px-4 w-full max-w-[calc(100%-1rem)]">
          <span className="rounded-full bg-background px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-foreground truncate max-w-full">
            {product.name}
          </span>
          <span className="rounded-full bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap">{formattedPrice}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border-2 transition-all duration-300 hover:border-green-500 ${
        transparent ? "border-border/50 bg-transparent" : "border-border bg-black"
      }`}
    >
      <div className={`relative aspect-square w-full overflow-hidden ${transparent ? "bg-transparent" : "bg-black"}`}>
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          quality={100}
          unoptimized
        />
        {/* Stock Status Badge */}
        {product.stock !== undefined && (
          <div className="absolute top-4 right-4">
            <Badge className={stockStatus.color}>
              {stockStatus.quantityLabel}
            </Badge>
          </div>
        )}

        {/* Cart Button */}
        <div className="absolute top-4 left-4">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            size="sm"
            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0 transition-all duration-200 ${
              justAdded 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-white hover:bg-gray-100 text-black border border-gray-200"
            } ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-black"></div>
            ) : justAdded ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 sm:px-4 w-full max-w-[calc(100%-1rem)]">
        <span className="rounded-full bg-background px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-foreground truncate max-w-full">
          {product.name}
        </span>
        <span className="rounded-full bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
          {formattedPrice}
        </span>
      </div>
    </Link>
  )
}
