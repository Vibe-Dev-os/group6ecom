"use client"

import { X, Minus, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/currency"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-border bg-background transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-xl font-bold">My Cart</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-white/30">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" quality={100} unoptimized />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.color} / {item.size}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <button
                          onClick={() => removeItem(item.productId, item.color, item.size)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-accent"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2 rounded-full border border-white/30 px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center transition-colors hover:text-muted-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center transition-colors hover:text-muted-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₱0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
