import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Optional: you can add extra middleware logic here later if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // ✅ If there is a token, user is authenticated
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // ✅ Force redirect to /login instead of /api/auth/signin
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/order/:path*",
    "/booking/:path*",
    "/api/orders/:path*",
    "/api/bookings/:path*",
    "/api/admin/:path*",
  ],
};
