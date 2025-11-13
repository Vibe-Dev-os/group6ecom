import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// PUT - Update user avatar
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
    const { avatar } = body

    // Validate avatar URL if provided
    if (avatar && typeof avatar !== 'string') {
      return NextResponse.json(
        { error: "Invalid avatar data" },
        { status: 400 }
      )
    }

    await connectDB()

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { avatar: avatar || null },
      { new: true }
    ).select("avatar")

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      avatar: updatedUser.avatar,
      message: "Avatar updated successfully",
    })
  } catch (error) {
    console.error("Avatar update error:", error)
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    )
  }
}

// DELETE - Remove user avatar
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    // Remove user avatar
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $unset: { avatar: 1 } },
      { new: true }
    ).select("avatar")

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Avatar removed successfully",
    })
  } catch (error) {
    console.error("Avatar removal error:", error)
    return NextResponse.json(
      { error: "Failed to remove avatar" },
      { status: 500 }
    )
  }
}
