import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import User from "@/models/User"
import Product from "@/models/Product"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Fetch dashboard statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    await connectDB()

    // Fetch all data
    const [orders, users, products] = await Promise.all([
      Order.find({}).lean(),
      User.find({}).lean(),
      Product.find({}).lean(),
    ])

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0)

    // Count orders
    const totalOrders = orders.length

    // Count products
    const totalProducts = products.length

    // Count customers (users with role 'user')
    const totalCustomers = users.filter((user: any) => user.role === "user").length

    // Get recent orders (last 5)
    const recentOrders = orders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((order: any) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customer: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
        amount: order.total,
        status: order.orderStatus,
        date: order.createdAt,
      }))

    // Calculate product sales from orders
    const productSales: { [key: string]: { name: string; sales: number; revenue: number; category: string } } = {}
    
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        if (!productSales[item.name]) {
          productSales[item.name] = {
            name: item.name,
            sales: 0,
            revenue: 0,
            category: item.category || "Unknown",
          }
        }
        productSales[item.name].sales += item.quantity
        productSales[item.name].revenue += item.price * item.quantity
      })
    })

    // Get top 4 products by revenue
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Count low stock items (stock < 10)
    const lowStockItems = products.filter((product: any) => (product.stock || 0) < 10).length

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
      },
      recentOrders,
      topProducts,
      quickStats: {
        avgOrderValue,
        lowStockItems,
      },
    })
  } catch (error) {
    console.error("Fetch stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}
