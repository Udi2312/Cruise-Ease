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
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "voyager") {
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

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-ocean-blue text-ocean-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Quick Actions
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-ocean-blue text-ocean-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-ocean-blue text-ocean-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Bookings ({bookings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
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
          </>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-navy">My Orders</h2>
              <div className="flex space-x-2">
                <Link href="/order?type=catering" className="btn-secondary text-sm px-4 py-2">
                  Order Food
                </Link>
                <Link href="/order?type=stationery" className="btn-secondary text-sm px-4 py-2">
                  Buy Gifts
                </Link>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="card text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-gray-600 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">Start by ordering some delicious food or browsing our gift shop</p>
                <div className="space-x-4">
                  <Link href="/order?type=catering" className="btn-primary">
                    Order Food
                  </Link>
                  <Link href="/order?type=stationery" className="btn-secondary">
                    Browse Gifts
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-ocean-blue/10 rounded-full flex items-center justify-center">
                          {order.type === "catering" ? (
                            <Utensils className="h-6 w-6 text-ocean-blue" />
                          ) : (
                            <Gift className="h-6 w-6 text-sunset-gold" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy capitalize">
                            {order.type} Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} at{" "}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-ocean-blue mt-1">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-navy mb-2">Items Ordered:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.itemId?.itemName || "Unknown Item"} x{item.quantity}
                            </span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.status === "ready" && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-800 font-medium">Your order is ready for pickup!</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-navy">My Bookings</h2>
              <div className="flex space-x-2">
                <Link href="/booking?service=movie" className="btn-secondary text-sm px-4 py-2">
                  Book Movie
                </Link>
                <Link href="/booking?service=salon" className="btn-secondary text-sm px-4 py-2">
                  Book Salon
                </Link>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="card text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-gray-600 mb-2">No Bookings Yet</h3>
                <p className="text-gray-500 mb-6">
                  Book entertainment and wellness services for your cruise experience
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/booking?service=movie" className="btn-primary text-sm px-3 py-2">
                    Movies
                  </Link>
                  <Link href="/booking?service=salon" className="btn-secondary text-sm px-3 py-2">
                    Salon
                  </Link>
                  <Link href="/booking?service=fitness" className="btn-secondary text-sm px-3 py-2">
                    Fitness
                  </Link>
                  <Link href="/booking?service=party" className="btn-secondary text-sm px-3 py-2">
                    Party Hall
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const ServiceIcon = getServiceIcon(booking.service)
                  return (
                    <div key={booking._id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                            <ServiceIcon className="h-6 w-6 text-teal" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy capitalize">
                              {booking.service} Booking #{booking._id.slice(-6)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                              {new Date(booking.bookingDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-lg font-bold text-ocean-blue mt-1">${booking.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-navy mb-2">Booking Details:</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          {booking.details.option && (
                            <p>
                              <span className="font-medium">Service:</span> {booking.details.option}
                            </p>
                          )}
                          {booking.details.guests && (
                            <p>
                              <span className="font-medium">Guests:</span> {booking.details.guests}
                            </p>
                          )}
                          {booking.details.notes && (
                            <p>
                              <span className="font-medium">Notes:</span> {booking.details.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {booking.status === "confirmed" && new Date(booking.bookingDate) > new Date() && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <span className="text-blue-800 font-medium">Confirmed! Don't forget your appointment.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
