import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Menu from "@/models/Menu"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await dbConnect()

    const menuItem = await Menu.findByIdAndDelete(id)

    if (!menuItem) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const updateData = await request.json()

    await dbConnect()

    const menuItem = await Menu.findByIdAndUpdate(id, updateData, { new: true })

    if (!menuItem) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
