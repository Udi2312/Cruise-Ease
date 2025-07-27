"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import {
  Utensils,
  Gift,
  Film,
  Scissors,
  Dumbbell,
  PartyPopper,
  Clock,
  CheckCircle,
  Package,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function VoyagerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalSpent: 0,
    pendingItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    // Redirect non-voyagers to their appropriate dashboard
    if (session.user.role !== "voyager") {
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    fetchUserData()
  }, [session, status, router])

  const fetchUserData = async () => {
    try {
      // Fetch user's orders
      const ordersResponse = await fetch("/api/orders")
      const ordersData = await ordersResponse.json()

      // Fetch user's bookings
      const bookingsResponse = await fetch("/api/bookings")
      const bookingsData = await bookingsResponse.json()

      setOrders(ordersData)
      setBookings(bookingsData)

      // Calculate stats
      const totalSpent =
        ordersData.reduce((sum, order) => sum + order.totalAmount, 0) +
        bookingsData.reduce((sum, booking) => sum + booking.price, 0)

      const pendingItems =
        ordersData.filter((order) => ["pending", "preparing"].includes(order.status)).length +
        bookingsData.filter((booking) => booking.status === "pending").length

      setStats({
        totalOrders: ordersData.length,
        totalBookings: bookingsData.length,
        totalSpent,
        pendingItems,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "delivered":
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getServiceIcon = (service) => {
    switch (service) {
      case "movie":
        return Film
      case "salon":
        return Scissors
      case "fitness":
        return Dumbbell
      case "party":
        return PartyPopper
      default:
        return Calendar
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-pearl-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-navy text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (session.user.role !== "voyager") {
    return null
  }

  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-navy mb-2">Welcome, {session.user.name}</h1>
          <p className="text-gray-600 text-lg">Your luxury cruise experience dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-ocean-blue">{stats.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-ocean-blue" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-teal">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-teal" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-sunset-gold">${stats.totalSpent.toFixed(2)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-sunset-gold" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Items</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingItems}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/order?type=catering" className="dashboard-card hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                <Utensils className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Order Food</h3>
                <p className="text-sm text-gray-600">Delicious meals</p>
              </div>
            </div>
          </Link>

          <Link href="/order?type=stationery" className="dashboard-card hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sunset-gold/10 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6 text-sunset-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Buy Gifts</h3>
                <p className="text-sm text-gray-600">Souvenirs & more</p>
              </div>
            </div>
          </Link>

          <Link href="/booking?service=movie" className="dashboard-card hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-ocean-blue/10 rounded-full flex items-center justify-center">
                <Film className="h-6 w-6 text-ocean-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Movie Tickets</h3>
                <p className="text-sm text-gray-600">Latest releases</p>
              </div>
            </div>
          </Link>

          <Link href="/booking?service=salon" className="dashboard-card hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                <Scissors className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Beauty Salon</h3>
                <p className="text-sm text-gray-600">Spa & beauty</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Dining & Shopping</h2>
            <div className="space-y-4">
              <Link
                href="/order?type=catering"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Utensils className="h-5 w-5 text-teal" />
                  <span className="font-medium">Catering Orders</span>
                </div>
                <span className="text-sm text-gray-500">Order now →</span>
              </Link>

              <Link
                href="/order?type=stationery"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-sunset-gold" />
                  <span className="font-medium">Gift Shop</span>
                </div>
                <span className="text-sm text-gray-500">Browse items →</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Entertainment & Wellness</h2>
            <div className="space-y-4">
              <Link
                href="/booking?service=movie"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Film className="h-5 w-5 text-ocean-blue" />
                  <span className="font-medium">Movie Theater</span>
                </div>
                <span className="text-sm text-gray-500">Book seats →</span>
              </Link>

              <Link
                href="/booking?service=fitness"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Dumbbell className="h-5 w-5 text-teal" />
                  <span className="font-medium">Fitness Center</span>
                </div>
                <span className="text-sm text-gray-500">Reserve time →</span>
              </Link>

              <Link
                href="/booking?service=party"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <PartyPopper className="h-5 w-5 text-sunset-gold" />
                  <span className="font-medium">Party Hall</span>
                </div>
                <span className="text-sm text-gray-500">Book event →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
