"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { signOut } from "next-auth/react"
import { useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <nav className="flex flex-col gap-3 p-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md",
            pathname === item.href
              ? "bg-white text-gray-800 shadow-lg"
              : "text-muted-foreground hover:bg-white hover:text-gray-800 border border-transparent"
          )}
        >
          <item.icon className="h-6 w-6" />
          {item.title}
        </Link>
      ))}
      
      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutDialog(true)}
        className="flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md text-muted-foreground hover:bg-white hover:text-gray-800 border border-transparent"
      >
        <LogOut className="h-6 w-6" />
        Log Out
      </button>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will be redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  )
}
