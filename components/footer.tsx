"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-[1920px] px-3 py-8 sm:px-4 lg:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                  <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold">C.A.D.</span>
                <span className="text-xs text-blue-500 font-semibold">Tech</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for gaming laptops and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/laptops" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/mice" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gaming Mice
                </Link>
              </li>
              <li>
                <Link href="/category/chairs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gaming Chairs
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} C.A.D. Tech. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by{" "}
            <span className="font-semibold text-foreground">Group 6</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
