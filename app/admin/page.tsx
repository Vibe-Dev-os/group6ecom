"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DashboardData {
  stats: {
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    totalCustomers: number
  }
  recentOrders: {
    id: string
    orderNumber: string
    customer: string
    amount: number
    status: string
    date: string
  }[]
  topProducts: {
    name: string
    category: string
    sales: number
    revenue: number
  }[]
  quickStats: {
    avgOrderValue: number
    lowStockItems: number
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-500">
        <AlertDescription className="text-red-600">{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  const stats = [
    {
      title: "Total Revenue",
      value: `₱${data.stats.totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: "total sales",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      iconColor: "text-white",
      textColor: "text-white"
    },
    {
      title: "Orders",
      value: data.stats.totalOrders.toString(),
      icon: ShoppingCart,
      description: "total orders",
      bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
      iconColor: "text-white",
      textColor: "text-white"
    },
    {
      title: "Products",
      value: data.stats.totalProducts.toString(),
      icon: Package,
      description: "in catalog",
      bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
      iconColor: "text-white",
      textColor: "text-white"
    },
    {
      title: "Customers",
      value: data.stats.totalCustomers.toString(),
      icon: Users,
      description: "registered users",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
      iconColor: "text-white",
      textColor: "text-white"
    },
  ]
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 font-medium border"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 font-medium border"
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700 font-medium border"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700 font-medium border"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700 font-medium border"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 font-medium border"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700 font-medium border"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your e-commerce store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-sm font-semibold ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</div>
              <div className={`flex items-center gap-1 text-xs ${stat.textColor} opacity-90`}>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best selling products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topProducts.length > 0 ? (
              data.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₱{product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No sales data yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>₱{order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
