import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Order, { IOrder } from "@/models/Order"
import { Types } from "mongoose"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Type for lean Order documents (includes MongoDB metadata)
type OrderDocument = IOrder & {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    // Fetch orders for this user
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Most recent first
      .lean() as unknown as OrderDocument[]

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      date: order.createdAt,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items,
      shippingAddress: order.shippingAddress,
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Fetch orders error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    // Get session to link order to user
    const session = await getServerSession(authOptions)
    
    const body = await request.json()
    
    const {
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      subtotal,
      shipping,
      total,
    } = body

    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Determine initial payment and order status based on payment method
    let paymentStatus: "pending" | "paid" | "failed" = "pending"
    let orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled" = "processing"

    // COD orders are pending payment until delivery
    if (paymentMethod === "cod") {
      paymentStatus = "pending"
      orderStatus = "confirmed"
    }

    // Connect to database
    await connectDB()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create the order with userId if logged in
    const order = await Order.create({
      orderNumber,
      userId: session?.user?.id, // Link to user if logged in
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      paymentStatus,
      orderStatus,
      subtotal,
      shipping,
      total,
    })

    // Return different responses based on payment method
    let responseData: any = {
      success: true,
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
    }

    // Add payment instructions based on method
    if (paymentMethod === "bank") {
      responseData.paymentInstructions = {
        type: "bank_transfer",
        bankName: "BDO Unibank",
        accountName: "CAD Gaming Store",
        accountNumber: "1234-5678-9012",
        amount: total,
        reference: order.orderNumber,
        instructions: "Please send proof of payment to orders@cadstore.com with your order number.",
      }
    } else if (paymentMethod === "gcash") {
      responseData.paymentInstructions = {
        type: "gcash",
        gcashNumber: "0917-123-4567",
        accountName: "CAD Gaming Store",
        amount: total,
        reference: order.orderNumber,
        instructions: "Send payment via GCash and screenshot the confirmation. Send to orders@cadstore.com with your order number.",
      }
    } else if (paymentMethod === "cod") {
      responseData.paymentInstructions = {
        type: "cash_on_delivery",
        amount: total,
        instructions: "Please prepare the exact amount. Our delivery rider will collect payment upon delivery.",
      }
    }

    return NextResponse.json(responseData, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
