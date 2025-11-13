"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 transform border-r bg-background shadow-lg transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex h-16 items-center justify-between border-b px-4 lg:px-8 bg-background">
            <h2 className="text-lg lg:text-xl font-bold text-foreground">Admin Panel</h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <AdminNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto lg:ml-0">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          <div className="container mx-auto py-4 px-4 lg:py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
