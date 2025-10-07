"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { UserNav } from "@/components/auth/user-nav"
import { useState } from "react"

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { totalItems } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-3 sm:px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
              <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">C.A.D.</span>
            <span className="text-xs text-blue-500 font-semibold">Tech</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-muted-foreground">
            All
          </Link>
          <Link href="/category/laptops" className="text-sm font-medium transition-colors hover:text-muted-foreground">
            Gaming Laptops
          </Link>
          <Link href="/category/mice" className="text-sm font-medium transition-colors hover:text-muted-foreground">
            Gaming Mice
          </Link>
          <Link href="/category/chairs" className="text-sm font-medium transition-colors hover:text-muted-foreground">
            Gaming Chairs
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70 pointer-events-none z-10" />
            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-md border-2 border-white/30 bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-white/50 focus:border-white focus-visible:ring-2 focus-visible:ring-white/50"
            />
          </form>

          <button
            onClick={onCartClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                {totalItems}
              </span>
            )}
          </button>

          <UserNav />
        </div>
      </div>
    </header>
  )
}
