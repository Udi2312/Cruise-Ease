import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // ✅ correct import
import dbConnect from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)  // ✅ now includes user.id

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const service = searchParams.get("service")

    const filter = {}
    if (session.user.role === "voyager") {
      filter.userId = session.user.id
    }
    if (service) {
      filter.service = service
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)  // ✅ fix here
    console.log("📌 FULL SESSION:", JSON.stringify(session, null, 2)) // 👈 add this

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { service, bookingDate, details, price } = await request.json()

    await dbConnect()

    // ✅ log session to debug
    console.log("📌 SESSION OBJECT:", session)

    // ✅ Ensure userId exists
    if (!session.user?.id) {
      return NextResponse.json({ message: "User ID missing in session" }, { status: 400 })
    }
    console.log("📌 USER ID:", session.user.id)
    
    const booking = await Booking.create({
      userId: session.user.id,  // ✅ this will now be set
      service,
      bookingDate,
      details,
      price,
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
