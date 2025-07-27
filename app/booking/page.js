"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { Film, Scissors, Dumbbell, PartyPopper, Calendar } from "lucide-react"

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const service = searchParams.get("service") || "movie"

  const [bookingData, setBookingData] = useState({
    service: service,
    bookingDate: "",
    bookingTime: "",
    details: {},
  })
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])

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

    setBookingData((prev) => ({ ...prev, service }))
    generateAvailableSlots()
  }, [session, status, router, service])

  const generateAvailableSlots = () => {
    const slots = []
    const today = new Date()

    // Generate slots for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const timeSlots = getTimeSlotsForService(service)
      timeSlots.forEach((time) => {
        slots.push({
          date: date.toISOString().split("T")[0],
          time: time,
          available: Math.random() > 0.3, // Random availability
        })
      })
    }

    setAvailableSlots(slots)
  }

  const getTimeSlotsForService = (serviceType) => {
    switch (serviceType) {
      case "movie":
        return ["14:00", "17:00", "20:00", "23:00"]
      case "salon":
        return ["09:00", "11:00", "14:00", "16:00", "18:00"]
      case "fitness":
        return ["06:00", "08:00", "10:00", "14:00", "16:00", "18:00", "20:00"]
      case "party":
        return ["18:00", "20:00", "22:00"]
      default:
        return ["10:00", "14:00", "18:00"]
    }
  }

  const getServiceDetails = (serviceType) => {
    switch (serviceType) {
      case "movie":
        return {
          title: "Movie Theater",
          icon: Film,
          price: 15,
          description: "Enjoy the latest blockbusters in our luxury cinema",
          options: ["Standard Seat", "Premium Seat", "VIP Suite"],
        }
      case "salon":
        return {
          title: "Beauty Salon & Spa",
          icon: Scissors,
          price: 80,
          description: "Relax and rejuvenate with our premium beauty services",
          options: ["Haircut & Style", "Facial Treatment", "Massage", "Manicure & Pedicure"],
        }
      case "fitness":
        return {
          title: "Fitness Center",
          icon: Dumbbell,
          price: 25,
          description: "State-of-the-art fitness equipment and personal training",
          options: ["Gym Access", "Personal Training", "Group Classes", "Pool Access"],
        }
      case "party":
        return {
          title: "Party Hall",
          icon: PartyPopper,
          price: 200,
          description: "Celebrate special occasions in our elegant event space",
          options: ["Small Party (10-20)", "Medium Party (20-50)", "Large Party (50-100)"],
        }
      default:
        return {
          title: "Service",
          icon: Calendar,
          price: 50,
          description: "Premium cruise service",
          options: ["Standard"],
        }
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const serviceDetails = getServiceDetails(service)
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: bookingData.service,
          bookingDate: new Date(`${bookingData.bookingDate}T${bookingData.bookingTime}`),
          details: bookingData.details,
          price: serviceDetails.price,
        }),
      })

      if (response.ok) {
        alert("Booking confirmed successfully!")
        router.push("/dashboard/voyager")
      } else {
        alert("Failed to create booking")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Error creating booking")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "voyager") {
    return null
  }

  const serviceDetails = getServiceDetails(service)
  const ServiceIcon = serviceDetails.icon

  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <ServiceIcon className="h-12 w-12 text-ocean-blue" />
            <div>
              <h1 className="font-playfair text-4xl font-bold text-navy">{serviceDetails.title}</h1>
              <p className="text-gray-600 text-lg">{serviceDetails.description}</p>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {["movie", "salon", "fitness", "party"].map((serviceType) => {
            const details = getServiceDetails(serviceType)
            const Icon = details.icon
            return (
              <button
                key={serviceType}
                onClick={() => router.push(`/booking?service=${serviceType}`)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  service === serviceType
                    ? "border-ocean-blue bg-ocean-blue/5"
                    : "border-gray-200 hover:border-ocean-blue/50"
                }`}
              >
                <Icon
                  className={`h-8 w-8 mx-auto mb-2 ${service === serviceType ? "text-ocean-blue" : "text-gray-400"}`}
                />
                <p className={`font-medium ${service === serviceType ? "text-ocean-blue" : "text-gray-600"}`}>
                  {details.title.split(" ")[0]}
                </p>
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="card">
            <h2 className="font-playfair text-2xl font-bold text-navy mb-6">Make a Reservation</h2>

            <form onSubmit={handleBooking} className="space-y-6">
              {/* Service Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  value={bookingData.details.option || ""}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      details: { ...bookingData.details, option: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {serviceDetails.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={bookingData.bookingDate}
                  onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {getTimeSlotsForService(service).map((time) => {
                    const slot = availableSlots.find((s) => s.date === bookingData.bookingDate && s.time === time)
                    const isAvailable = slot?.available !== false

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, bookingTime: time })}
                        disabled={!isAvailable}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          bookingData.bookingTime === time
                            ? "border-ocean-blue bg-ocean-blue text-white"
                            : isAvailable
                              ? "border-gray-200 hover:border-ocean-blue"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Additional Details */}
              {service === "party" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={bookingData.details.guests || ""}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        details: { ...bookingData.details, guests: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Number of guests"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  value={bookingData.details.notes || ""}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      details: { ...bookingData.details, notes: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !bookingData.bookingDate || !bookingData.bookingTime}
                className="w-full btn-primary"
              >
                {loading ? "Booking..." : `Book Now - $${serviceDetails.price}`}
              </button>
            </form>
          </div>

          {/* Service Information */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-playfair text-xl font-bold text-navy mb-4">Service Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ServiceIcon className="h-5 w-5 text-ocean-blue" />
                  <span className="font-medium">{serviceDetails.title}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-sunset-gold">${serviceDetails.price}</span>
                  <span className="text-gray-600">per booking</span>
                </div>
                <p className="text-gray-600">{serviceDetails.description}</p>
              </div>
            </div>

            <div className="card">
              <h3 className="font-playfair text-xl font-bold text-navy mb-4">Available Options</h3>
              <ul className="space-y-2">
                {serviceDetails.options.map((option) => (
                  <li key={option} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal rounded-full"></div>
                    <span className="text-gray-700">{option}</span>
                  </li>
                ))}
              </ul>
            </div>

            {service === "movie" && (
              <div className="card">
                <h3 className="font-playfair text-xl font-bold text-navy mb-4">Now Showing</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold">The Ocean's Call</h4>
                    <p className="text-sm text-gray-600">Adventure • 2h 15m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold">Luxury Voyage</h4>
                    <p className="text-sm text-gray-600">Romance • 1h 45m</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
