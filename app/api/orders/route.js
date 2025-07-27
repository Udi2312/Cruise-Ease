import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Menu from "@/models/Menu";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const filter = {}

    // Only filter by user for voyagers, admins and managers can see all
    if (session.user.role === "voyager") {
      filter.userId = session.user.id
    }

    if (type) {
      filter.type = type
    }

    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .populate("items.itemId", "itemName price")
      .sort({ createdAt: -1 })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { items, type, totalAmount } = await request.json()

    await dbConnect()

    const order = await Order.create({
      userId: session.user.id,
      items,
      type,
      totalAmount,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
