import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET - Get user sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Mock session data - in a real app, you'd track sessions in a database
    const mockSessions = [
      {
        id: "current",
        device: "Chrome on Windows",
        location: "New York, NY",
        ipAddress: "192.168.1.1",
        lastActive: new Date().toISOString(),
        isCurrent: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      {
        id: "session-2",
        device: "Safari on iPhone",
        location: "New York, NY",
        ipAddress: "192.168.1.2",
        lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isCurrent: false,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
      },
      {
        id: "session-3",
        device: "Firefox on Linux",
        location: "San Francisco, CA",
        ipAddress: "10.0.0.1",
        lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isCurrent: false,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
      },
    ]

    return NextResponse.json({
      success: true,
      sessions: mockSessions,
    })
  } catch (error) {
    console.error("Get sessions error:", error)
    return NextResponse.json(
      { error: "Failed to get sessions" },
      { status: 500 }
    )
  }
}

// DELETE - Revoke a session
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    // Prevent revoking current session
    if (sessionId === "current") {
      return NextResponse.json(
        { error: "Cannot revoke current session" },
        { status: 400 }
      )
    }

    // In a real app, you would revoke the session from your session store
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Session revoked successfully",
    })
  } catch (error) {
    console.error("Revoke session error:", error)
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    )
  }
}
