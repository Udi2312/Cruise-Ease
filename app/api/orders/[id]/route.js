import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Only allow cook and supervisor to update orders
    if (!["cook", "supervisor", "admin"].includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { status } = await request.json()
    const { id } = await params

    await dbConnect()

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("userId", "name email")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
