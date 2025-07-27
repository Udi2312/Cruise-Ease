"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Anchor, LogOut, User } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
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
            {session ? (
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
                  <span>{session.user.name}</span>
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
