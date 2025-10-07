import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl
        
        // Protect admin routes
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }
        
        // Protect user profile and account routes
        if (pathname.startsWith("/profile") || pathname.startsWith("/orders") || pathname.startsWith("/settings")) {
          return !!token
        }
        
        // Allow access to other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*", 
    "/orders/:path*",
    "/settings/:path*"
  ]
}
