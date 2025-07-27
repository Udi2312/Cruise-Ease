"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { ShoppingCart, Plus, Minus } from "lucide-react"

export default function OrderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderType = searchParams.get("type") || "catering"

  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

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

    fetchMenuItems()
  }, [session, status, router, orderType])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/menu?category=${orderType}`)
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error("Error fetching menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            itemId: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          type: orderType,
          totalAmount: getTotalAmount(),
        }),
      })

      if (response.ok) {
        setCart([])
        alert("Order placed successfully!")
      } else {
        alert("Failed to place order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Error placing order")
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
          <h1 className="font-playfair text-4xl font-bold text-navy mb-2">
            {orderType === "catering" ? "Food & Beverages" : "Gift Shop"}
          </h1>
          <p className="text-gray-600 text-lg">
            {orderType === "catering"
              ? "Order delicious meals and refreshing drinks"
              : "Browse our collection of gifts and souvenirs"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="card">
                  <h3 className="font-semibold text-navy text-lg mb-2">{item.itemName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-ocean-blue">${item.price}</span>
                    <button onClick={() => addToCart(item)} className="btn-secondary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="card h-fit sticky top-8">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-ocean-blue" />
              <h2 className="font-playfair text-xl font-bold text-navy">Your Cart</h2>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-navy">{item.itemName}</h4>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-navy">Total:</span>
                    <span className="text-xl font-bold text-ocean-blue">${getTotalAmount().toFixed(2)}</span>
                  </div>
                  <button onClick={handlePlaceOrder} className="w-full btn-primary">
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
