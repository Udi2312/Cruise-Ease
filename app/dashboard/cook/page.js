"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { ChefHat, Clock, CheckCircle, Package } from "lucide-react"

export default function CookDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    if (session.user.role !== "cook") {
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?type=catering")
      const data = await response.json()
      setOrders(data)

      // Calculate stats
      const pending = data.filter((order) => order.status === "pending").length
      const preparing = data.filter((order) => order.status === "preparing").length
      const ready = data.filter((order) => order.status === "ready").length

      setStats({
        pending,
        preparing,
        ready,
        total: data.length,
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders() // Refresh orders
      }
    } catch (error) {
      console.error("Error updating order status:", error)
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
      case "delivered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "cook") {
    return null
  }

  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-navy mb-2">Kitchen Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage catering orders and kitchen operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-navy">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-navy" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="card">
          <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Catering Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-navy">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-gray-600">Customer: {order.userId?.name || "Unknown"}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-lg font-bold text-ocean-blue mt-2">${order.totalAmount}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-navy mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.itemId?.itemName || "Unknown Item"} x{item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "preparing")}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "ready")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button
                        onClick={() => updateOrderStatus(order._id, "delivered")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
