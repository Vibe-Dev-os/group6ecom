"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminNav } from "@/components/admin/admin-nav"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-background shadow-lg">
          <div className="flex h-20 items-center border-b px-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          </div>
          <div className="h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <AdminNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
