"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { Users, Menu, Package, UserPlus, Settings, Plus, Trash2 } from "lucide-react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalMenuItems: 0,
    totalBookings: 0,
  })
  const [users, setUsers] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddMenuItem, setShowAddMenuItem] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    if (session.user.role !== "admin") {
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    fetchAdminData()
  }, [session, status, router])

  const fetchAdminData = async () => {
    try {
      // Fetch all data
      const [usersRes, menuRes, ordersRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/menu"),
        fetch("/api/orders"),
        fetch("/api/bookings"),
      ])

      const usersData = await usersRes.json()
      console.log("🔥 API Response for Users:", usersData)
      const menuData = await menuRes.json()
      const ordersData = await ordersRes.json()
      const bookingsData = await bookingsRes.json()

      setUsers(usersData.users || usersData) 
      setMenuItems(menuData.items || menuData) 
      setOrders(ordersData.orders || ordersData)
      setBookings(bookingsData.bookings || bookingsData)
      
      setStats({
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalMenuItems: menuData.length,
        totalBookings: bookingsData.length,
      })
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchAdminData()
      } else {
        alert("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Error deleting user")
    }
  }

  const deleteMenuItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return

    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchAdminData()
      } else {
        alert("Failed to delete menu item")
      }
    } catch (error) {
      console.error("Error deleting menu item:", error)
      alert("Error deleting menu item")
    }
  }

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-navy mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your cruise ship operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-navy">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-teal" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-navy">{stats.totalMenuItems}</p>
              </div>
              <Menu className="h-8 w-8 text-sunset-gold" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-navy">{stats.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-ocean-blue" />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-navy">{stats.totalBookings}</p>
              </div>
              <Settings className="h-8 w-8 text-teal" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "overview", label: "Overview" },
                { key: "users", label: `Users (${stats.totalUsers})` },
                { key: "menu", label: `Menu (${stats.totalMenuItems})` },
                { key: "orders", label: `Orders (${stats.totalOrders})` },
                { key: "bookings", label: `Bookings (${stats.totalBookings})` },
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="dashboard-card">
              <div className="text-center">
                <Menu className="h-12 w-12 text-sunset-gold mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">Menu Management</h3>
                <p className="text-gray-600 mb-4">Add, edit, and delete menu items</p>
                <button onClick={() => setActiveTab("menu")} className="btn-secondary w-full">
                  Manage Menu
                </button>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="text-center">
                <UserPlus className="h-12 w-12 text-teal mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">User Management</h3>
                <p className="text-gray-600 mb-4">Register new voyagers and staff</p>
                <button onClick={() => setActiveTab("users")} className="btn-secondary w-full">
                  Manage Users
                </button>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="text-center">
                <Package className="h-12 w-12 text-ocean-blue mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-navy mb-2">Orders & Bookings</h3>
                <p className="text-gray-600 mb-4">Monitor all orders and bookings</p>
                <button onClick={() => setActiveTab("orders")} className="btn-secondary w-full">
                  View Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-navy">User Management</h2>
              <button onClick={() => setShowAddUser(true)} className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-ocean-blue/10 text-ocean-blue rounded-full text-sm capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold text-navy">Menu Management</h2>
              <button onClick={() => setShowAddMenuItem(true)} className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Menu Item</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-teal/10 text-teal rounded-full text-sm capitalize">
                      {item.category}
                    </span>
                    <button onClick={() => deleteMenuItem(item._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-navy mb-2">{item.itemName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-ocean-blue">${item.price}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">Order Management</h2>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-navy">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-navy">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                        <td className="py-3 px-4">{order.userId?.name || "Unknown"}</td>
                        <td className="py-3 px-4 capitalize">{order.type}</td>
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

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-navy">Booking Management</h2>

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
                    {bookings.map((booking) => (
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
      </div>

      {/* Add User Modal */}
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onSuccess={fetchAdminData} />}

      {/* Add Menu Item Modal */}
      {showAddMenuItem && <AddMenuItemModal onClose={() => setShowAddMenuItem(false)} onSuccess={fetchAdminData} />}
    </div>
  )
}

// Add User Modal Component
function AddUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "voyager",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        alert("Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      alert("Error creating user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-playfair text-xl font-bold text-navy mb-4">Add New User</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
            >
              <option value="voyager">Voyager</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cook">Head Cook</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Menu Item Modal Component
function AddMenuItemModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "catering",
    subcategory: "",
    price: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        alert("Failed to create menu item")
      }
    } catch (error) {
      console.error("Error creating menu item:", error)
      alert("Error creating menu item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-playfair text-xl font-bold text-navy mb-4">Add Menu Item</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
            >
              <option value="catering">Catering</option>
              <option value="stationery">Stationery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              placeholder="e.g., main-course, appetizer, gifts"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              placeholder="Describe the item..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
