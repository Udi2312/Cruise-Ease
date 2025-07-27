import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic if needed
    return
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow public routes
        if (pathname === "/" || pathname === "/login" || pathname === "/register") {
          return true
        }

        // Always allow NextAuth API routes
        if (pathname.startsWith("/api/auth")) {
          return true
        }

        // For protected routes, require a valid token
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/order") ||
          pathname.startsWith("/booking") ||
          (pathname.startsWith("/api") && !pathname.startsWith("/api/auth"))
        ) {
          return !!token
        }

        // Allow everything else
        return true
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
