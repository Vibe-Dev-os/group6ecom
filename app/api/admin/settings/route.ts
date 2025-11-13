import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Settings from "@/models/Settings"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET admin settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()
    let settings = await Settings.findOne({})
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        storeName: "CAD STORE",
        storeDescription: "Modern e-commerce store built with Next.js",
        contactEmail: "support@cadstore.com",
        contactPhone: "+63 (555) 123-4567",
        currency: "PHP",
        currencySymbol: "₱",
        freeShippingThreshold: 1000,
        standardShippingRate: 150,
        maintenanceMode: false,
        guestCheckout: true,
        productReviews: true,
        orderNotifications: true,
        lowStockAlerts: true,
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// PUT update admin settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    await connectDB()
    
    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          storeName: body.storeName,
          storeDescription: body.storeDescription,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          currency: body.currency,
          currencySymbol: body.currencySymbol,
          freeShippingThreshold: body.freeShippingThreshold,
          standardShippingRate: body.standardShippingRate,
          maintenanceMode: body.maintenanceMode,
          guestCheckout: body.guestCheckout,
          productReviews: body.productReviews,
          orderNotifications: body.orderNotifications,
          lowStockAlerts: body.lowStockAlerts,
          updatedAt: new Date(),
        }
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    )
    
    return NextResponse.json({ 
      message: "Settings updated successfully",
      settings 
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
