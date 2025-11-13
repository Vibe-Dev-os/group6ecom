import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Get user account activity
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

    const user = await User.findById(session.user.id).select("lastLogin createdAt updatedAt")
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Mock activity data - in a real app, you'd have an activity log collection
    const mockActivity = [
      {
        id: "1",
        action: "Profile Updated",
        timestamp: new Date().toISOString(),
        details: "Updated personal information",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0...",
      },
      {
        id: "2",
        action: "Password Changed",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        details: "Password was successfully changed",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0...",
      },
      {
        id: "3",
        action: "Login",
        timestamp: user.lastLogin?.toISOString() || new Date().toISOString(),
        details: "Successful login",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0...",
      },
    ]

    return NextResponse.json({
      success: true,
      activity: mockActivity,
      accountInfo: {
        lastLogin: user.lastLogin,
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
      },
    })
  } catch (error) {
    console.error("Get activity error:", error)
    return NextResponse.json(
      { error: "Failed to get account activity" },
      { status: 500 }
    )
  }
}

// POST - Log user activity (for future use)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, details } = body

    // Validate required fields
    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Update last login time
    await User.findByIdAndUpdate(session.user.id, {
      lastLogin: new Date(),
    })

    // In a real app, you would save this to an activity log collection
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Activity logged successfully",
    })
  } catch (error) {
    console.error("Log activity error:", error)
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    )
  }
}
