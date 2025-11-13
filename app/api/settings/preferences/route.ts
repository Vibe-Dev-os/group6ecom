import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Get user preferences
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

    const user = await User.findById(session.user.id).select("preferences")
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      preferences: user.preferences || {
        emailNotifications: true,
        marketingEmails: false,
        orderUpdates: true,
        theme: "system",
        language: "en"
      },
    })
  } catch (error) {
    console.error("Get preferences error:", error)
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 }
    )
  }
}

// PUT - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { preferences } = body

    // Validate preferences object
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: "Invalid preferences data" },
        { status: 400 }
      )
    }

    // Validate theme if provided
    if (preferences.theme && !["light", "dark", "system"].includes(preferences.theme)) {
      return NextResponse.json(
        { error: "Invalid theme value" },
        { status: 400 }
      )
    }

    await connectDB()

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          "preferences.emailNotifications": preferences.emailNotifications ?? true,
          "preferences.marketingEmails": preferences.marketingEmails ?? false,
          "preferences.orderUpdates": preferences.orderUpdates ?? true,
          "preferences.theme": preferences.theme ?? "system",
          "preferences.language": preferences.language ?? "en",
        }
      },
      { new: true }
    ).select("preferences")

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      preferences: updatedUser.preferences,
      message: "Preferences updated successfully",
    })
  } catch (error) {
    console.error("Update preferences error:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}
