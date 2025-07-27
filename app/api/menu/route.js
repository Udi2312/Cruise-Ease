import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Menu from "@/models/Menu"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const filter = category ? { category } : {}
    const menuItems = await Menu.find(filter).sort({ itemName: 1 })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { itemName, category, subcategory, price, description } = await request.json()

    await dbConnect()

    const menuItem = await Menu.create({
      itemName,
      category,
      subcategory,
      price,
      description,
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
