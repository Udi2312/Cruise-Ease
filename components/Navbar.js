"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Anchor, LogOut, User } from "lucide-react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      })
      // Force page reload to clear any cached state
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      // Fallback: force redirect
      window.location.href = "/"
    }
  }

  // Don't render session-dependent content until client-side
  if (!isClient) {
    return (
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Anchor className="h-8 w-8 text-sunset-gold" />
                <span className="font-playfair text-xl font-bold text-sunset-gold">Cruise-Ease</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="space-x-4">
                <Link href="/login" className="text-white hover:text-sunset-gold transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Anchor className="h-8 w-8 text-sunset-gold" />
              <span className="font-playfair text-xl font-bold text-sunset-gold">Cruise-Ease</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session && status === "authenticated" ? (
              <>
                <Link
                  href={`/dashboard/${session.user.role}`}
                  className="text-white hover:text-sunset-gold transition-colors"
                >
                  Dashboard
                </Link>
                {session.user.role === "voyager" && (
                  <>
                    <Link href="/order" className="text-white hover:text-sunset-gold transition-colors">
                      Order
                    </Link>
                    <Link href="/booking" className="text-white hover:text-sunset-gold transition-colors">
                      Booking
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-4 w-4" />
                  <span>
                    {session.user.name} ({session.user.role})
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-white hover:text-sunset-gold transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="text-white hover:text-sunset-gold transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
