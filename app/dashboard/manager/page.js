"use client"

import {useSession} from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { BarChart3, Users, Calendar, TrendingUp, Package, Utensils, Settings } from "lucide-react"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default function ManagerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showReports, setShowReports] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [showOperations, setShowOperations] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    if (session.user.role !== "manager") {
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsResponse = await fetch("/api/bookings")
      const bookings = await bookingsResponse.json()

      // Fetch orders
      const ordersResponse = await fetch("/api/orders")
      const orders = await ordersResponse.json()

      // Fetch users
      const usersResponse = await fetch("/api/admin/users")
      const usersData = await usersResponse.json()
      console.log("🔥 API Response for Users:", usersData)

      // Calculate stats
      const totalRevenue = [...bookings, ...orders].reduce(
        (sum, item) => sum + (item.totalAmount || item.price || 0),
        0,
      )

      setStats({
        totalBookings: bookings.length,
        totalOrders: orders.length,
        totalRevenue,
        activeUsers: new Set([...bookings.map((b) => b.userId), ...orders.map((o) => o.userId)]).size,
      })

      setRecentBookings(bookings.slice(0, 5))
      setRecentOrders(orders.slice(0, 5))
      setUsers(usersData) 
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "manager") {
    return null
  }

  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-navy mb-2">Manager Dashboard</h1>
          <p className="text-gray-600 text-lg">Overview of all cruise operations and bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-ocean-blue">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-ocean-blue" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-teal">{stats.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-teal" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-sunset-gold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-sunset-gold" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-navy">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-navy" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "overview", label: "Overview" },
                { key: "reports", label: "Reports & Analytics" },
                { key: "users", label: `Users (${users.length})` },
                { key: "operations", label: "Operations" },
                { key: "bookings", label: `Recent Bookings (${recentBookings.length})` },
                { key: "orders", label: `Recent Orders (${recentOrders.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? "border-ocean-blue text-ocean-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Bookings */}
              <div className="card">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Recent Bookings</h2>

                {recentBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookings found</p>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-navy capitalize">{booking.service}</h3>
                            <p className="text-sm text-gray-600">{booking.userId?.name || "Unknown User"}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                            <p className="text-sm font-bold text-ocean-blue mt-1">${booking.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="card">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Recent Orders</h2>

                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-navy capitalize">{order.type}</h3>
                            <p className="text-sm text-gray-600">{order.userId?.name || "Unknown User"}</p>
                            <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "ready"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "preparing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                            <p className="text-sm font-bold text-ocean-blue mt-1">${order.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="dashboard-card text-center">
                <BarChart3 className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">Analytics</h3>
                <p className="text-gray-600 mb-4">View detailed reports and analytics</p>
                <button onClick={() => setActiveTab("reports")} className="btn-secondary w-full">
                  View Reports
                </button>
              </div>

              <div className="dashboard-card text-center">
                <Users className="h-12 w-12 text-teal mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">User Management</h3>
                <p className="text-gray-600 mb-4">Manage voyagers and staff</p>
                <button onClick={() => setActiveTab("users")} className="btn-secondary w-full">
                  Manage Users
                </button>
              </div>

              <div className="dashboard-card text-center">
                <Utensils className="h-12 w-12 text-sunset-gold mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">Operations</h3>
                <p className="text-gray-600 mb-4">Monitor all ship operations</p>
                <button onClick={() => setActiveTab("operations")} className="btn-secondary w-full">
                  View Operations
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">Reports & Analytics</h2>

            {/* Revenue Analytics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Daily Revenue</h3>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {[...recentBookings, ...recentOrders]
                    .filter((item) => {
                      const itemDate = new Date(item.createdAt || item.bookingDate)
                      const today = new Date()
                      return itemDate.toDateString() === today.toDateString()
                    })
                    .reduce((sum, item) => sum + (item.totalAmount || item.price || 0), 0)
                    .toFixed(2)}
                </p>
              </div>

              <div className="card text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Weekly Bookings</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    recentBookings.filter((booking) => {
                      const bookingDate = new Date(booking.createdAt)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return bookingDate >= weekAgo
                    }).length
                  }
                </p>
              </div>

              <div className="card text-center">
                <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Monthly Orders</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {
                    recentOrders.filter((order) => {
                      const orderDate = new Date(order.createdAt)
                      const monthAgo = new Date()
                      monthAgo.setMonth(monthAgo.getMonth() - 1)
                      return orderDate >= monthAgo
                    }).length
                  }
                </p>
              </div>

              <div className="card text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">New Users</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    users.filter((user) => {
                      const userDate = new Date(user.createdAt)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return userDate >= weekAgo
                    }).length
                  }
                </p>
              </div>
            </div>

            {/* Service Performance */}
            <div className="card">
              <h3 className="font-playfair text-xl font-bold text-navy mb-4">Service Performance</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-navy mb-3">Popular Services</h4>
                  <div className="space-y-2">
                    {["movie", "salon", "fitness", "party"].map((service) => {
                      const count = recentBookings.filter((b) => b.service === service).length
                      const percentage = recentBookings.length > 0 ? (count / recentBookings.length) * 100 : 0
                      return (
                        <div key={service} className="flex items-center justify-between">
                          <span className="capitalize text-gray-700">{service}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-ocean-blue h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-navy mb-3">Order Categories</h4>
                  <div className="space-y-2">
                    {["catering", "stationery"].map((category) => {
                      const count = recentOrders.filter((o) => o.type === category).length
                      const percentage = recentOrders.length > 0 ? (count / recentOrders.length) * 100 : 0
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="capitalize text-gray-700">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-teal h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">User Management</h2>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Orders</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Bookings</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Total Spent</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const userOrders = recentOrders.filter((o) => o.userId?._id === user._id)
                      const userBookings = recentBookings.filter((b) => b.userId?._id === user._id)
                      const totalSpent =
                        userOrders.reduce((sum, o) => sum + o.totalAmount, 0) +
                        userBookings.reduce((sum, b) => sum + b.price, 0)

                      return (
                        <tr key={user._id} className="border-b border-gray-100">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-ocean-blue/10 text-ocean-blue rounded-full text-sm capitalize">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">{userOrders.length}</td>
                          <td className="py-3 px-4">{userBookings.length}</td>
                          <td className="py-3 px-4 font-semibold">${totalSpent.toFixed(2)}</td>
                          <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "operations" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">Ship Operations</h2>

            {/* Operations Status */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <Utensils className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Kitchen Status</h3>
                <p className="text-sm text-green-600">Operational</p>
                <p className="text-xs text-gray-600 mt-1">
                  {recentOrders.filter((o) => o.type === "catering" && o.status === "preparing").length} orders
                  preparing
                </p>
              </div>

              <div className="card text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Gift Shop</h3>
                <p className="text-sm text-blue-600">Operational</p>
                <p className="text-xs text-gray-600 mt-1">
                  {recentOrders.filter((o) => o.type === "stationery" && o.status === "preparing").length} orders
                  processing
                </p>
              </div>

              <div className="card text-center">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Entertainment</h3>
                <p className="text-sm text-purple-600">Operational</p>
                <p className="text-xs text-gray-600 mt-1">
                  {recentBookings.filter((b) => b.status === "confirmed").length} active bookings
                </p>
              </div>

              <div className="card text-center">
                <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Maintenance</h3>
                <p className="text-sm text-green-600">All Clear</p>
                <p className="text-xs text-gray-600 mt-1">No issues reported</p>
              </div>
            </div>

            {/* Department Performance */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-playfair text-xl font-bold text-navy mb-4">Department Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Utensils className="h-5 w-5 text-teal" />
                      <div>
                        <p className="font-medium text-navy">Kitchen</p>
                        <p className="text-sm text-gray-600">
                          {recentOrders.filter((o) => o.type === "catering").length} orders today
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Excellent</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-sunset-gold" />
                      <div>
                        <p className="font-medium text-navy">Gift Shop</p>
                        <p className="text-sm text-gray-600">
                          {recentOrders.filter((o) => o.type === "stationery").length} orders today
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Good</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-ocean-blue" />
                      <div>
                        <p className="font-medium text-navy">Entertainment</p>
                        <p className="text-sm text-gray-600">{recentBookings.length} bookings today</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Excellent</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-playfair text-xl font-bold text-navy mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Database Connection</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Payment System</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Booking System</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">User Authentication</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">All Bookings</h2>
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Booking ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono text-sm">#{booking._id.slice(-6)}</td>
                        <td className="py-3 px-4">{booking.userId?.name || "Unknown"}</td>
                        <td className="py-3 px-4 capitalize">{booking.service}</td>
                        <td className="py-3 px-4 font-semibold">${booking.price}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs capitalize ${
                              booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">All Orders</h2>
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Items</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                        <td className="py-3 px-4">{order.userId?.name || "Unknown"}</td>
                        <td className="py-3 px-4 capitalize">{order.type}</td>
                        <td className="py-3 px-4">{order.items?.length || 0} items</td>
                        <td className="py-3 px-4 font-semibold">${order.totalAmount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs capitalize ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "ready"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "preparing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
