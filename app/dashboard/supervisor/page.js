"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { Package, Gift, Truck, CheckCircle, Clock, Plus, Minus, AlertTriangle } from "lucide-react"

export default function SupervisorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    ready: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    if (session.user.role !== "supervisor") {
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      // Fetch stationery orders
      const ordersResponse = await fetch("/api/orders?type=stationery")
      const ordersData = await ordersResponse.json()

      // Fetch stationery menu items for inventory
      const menuResponse = await fetch("/api/menu?category=stationery")
      const menuData = await menuResponse.json()

      setOrders(ordersData)
      setMenuItems(menuData)

      // Calculate stats
      const pending = ordersData.filter((order) => order.status === "pending").length
      const processing = ordersData.filter((order) => order.status === "preparing").length
      const ready = ordersData.filter((order) => order.status === "ready").length

      setStats({
        pending,
        processing,
        ready,
        total: ordersData.length,
      })

      // Generate mock inventory data based on menu items
      const inventoryData = menuData.map((item) => ({
        ...item,
        stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
        lowStockThreshold: 20,
        reorderPoint: 15,
        lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      }))

      setInventory(inventoryData)
    } catch (error) {
      console.error("Error fetching data:", error)
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
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const updateInventoryStock = (itemId, change) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? {
              ...item,
              stock: Math.max(0, item.stock + change),
            }
          : item,
      ),
    )
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

  const getDeliveryStatus = (order) => {
    if (order.status === "delivered") return "Delivered"
    if (order.status === "ready") return "Ready for Pickup"
    if (order.status === "preparing") return "In Transit"
    return "Pending"
  }

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "supervisor") {
    return null
  }

  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-navy mb-2">Supervisor Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage gift shop and stationery orders</p>
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
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
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
              <Gift className="h-8 w-8 text-navy" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "overview", label: "Overview" },
                { key: "orders", label: `Orders (${stats.total})` },
                { key: "inventory", label: `Inventory (${inventory.length})` },
                { key: "deliveries", label: "Deliveries" },
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
            {/* Orders List */}
            <div className="card mb-8">
              <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Recent Stationery & Gift Orders</h2>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
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
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                          >
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
                            Start Processing
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

            {/* Management Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="dashboard-card text-center">
                <Package className="h-12 w-12 text-teal mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">Inventory Management</h3>
                <p className="text-gray-600 mb-4">Manage gift shop inventory and stock levels</p>
                <button onClick={() => setActiveTab("inventory")} className="btn-secondary w-full">
                  Manage Inventory
                </button>
              </div>

              <div className="dashboard-card text-center">
                <Truck className="h-12 w-12 text-sunset-gold mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">Delivery Management</h3>
                <p className="text-gray-600 mb-4">Track and manage order deliveries</p>
                <button onClick={() => setActiveTab("deliveries")} className="btn-secondary w-full">
                  View Deliveries
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">All Stationery & Gift Orders</h2>

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
                        Start Processing
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
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-navy">Inventory Management</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Low Stock Items: {inventory.filter((item) => item.stock <= item.lowStockThreshold).length}
                </span>
              </div>
            </div>

            {/* Low Stock Alert */}
            {inventory.filter((item) => item.stock <= item.lowStockThreshold).length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  {inventory.filter((item) => item.stock <= item.lowStockThreshold).length} items need restocking
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((item) => (
                <div key={item._id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-teal/10 text-teal rounded-full text-sm capitalize">
                      {item.subcategory}
                    </span>
                    {item.stock <= item.lowStockThreshold && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  </div>

                  <h3 className="font-semibold text-navy mb-2">{item.itemName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Stock:</span>
                      <span
                        className={`font-bold ${item.stock <= item.lowStockThreshold ? "text-red-600" : item.stock <= item.reorderPoint ? "text-yellow-600" : "text-green-600"}`}
                      >
                        {item.stock} units
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-bold text-ocean-blue">${item.price}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Restocked:</span>
                      <span className="text-sm text-gray-600">{item.lastRestocked.toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => updateInventoryStock(item._id, -1)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                        disabled={item.stock === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="font-semibold text-navy">{item.stock}</span>

                      <button
                        onClick={() => updateInventoryStock(item._id, 1)}
                        className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {item.stock <= item.lowStockThreshold && (
                      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors">
                        Reorder Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "deliveries" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">Delivery Management</h2>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Items</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Delivery Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Order Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                        <td className="py-3 px-4">{order.userId?.name || "Unknown"}</td>
                        <td className="py-3 px-4">{order.items?.length || 0} items</td>
                        <td className="py-3 px-4 font-semibold">${order.totalAmount}</td>
                        <td className="py-3 px-4">
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
                            {getDeliveryStatus(order)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          {order.status === "ready" && (
                            <button
                              onClick={() => updateOrderStatus(order._id, "delivered")}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() => updateOrderStatus(order._id, "ready")}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Ready for Pickup
                            </button>
                          )}
                          {order.status === "pending" && (
                            <button
                              onClick={() => updateOrderStatus(order._id, "preparing")}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Start Processing
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Statistics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card text-center">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Pending Deliveries</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
              </div>

              <div className="card text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">In Transit</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o) => o.status === "preparing").length}
                </p>
              </div>

              <div className="card text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Ready for Pickup</h3>
                <p className="text-2xl font-bold text-green-600">{orders.filter((o) => o.status === "ready").length}</p>
              </div>

              <div className="card text-center">
                <Truck className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-semibold text-navy">Delivered</h3>
                <p className="text-2xl font-bold text-gray-600">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
