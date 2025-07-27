import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ["/login", "/register", "/"]
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/order/:path*",
    "/booking/:path*",
    "/api/orders/:path*",
    "/api/bookings/:path*",
    "/api/admin/:path*",
  ],
}
