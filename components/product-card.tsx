import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/currency"
import { getStockStatus } from "@/lib/products"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
  featured?: boolean
  transparent?: boolean
}

export function ProductCard({ product, featured = false, transparent = false }: ProductCardProps) {
  const formattedPrice = formatPrice(product.price)
  const stockStatus = getStockStatus(product.stock || 0)

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
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4">
          <span className="rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground whitespace-nowrap">
            {product.name}
          </span>
          <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap">{formattedPrice}</span>
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
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4">
        <span className="rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground whitespace-nowrap">
          {product.name}
        </span>
        <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap">
          {formattedPrice}
        </span>
      </div>
    </Link>
  )
}
