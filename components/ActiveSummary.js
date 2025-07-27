"use client"

import { Utensils, Gift, Film, Calendar, TrendingUp } from "lucide-react"

export default function ActivitySummary({ orders, bookings }) {
  const getRecentActivity = () => {
    const allActivity = [
      ...orders.map((order) => ({
        ...order,
        type: "order",
        activityType: order.type,
        date: new Date(order.createdAt),
      })),
      ...bookings.map((booking) => ({
        ...booking,
        type: "booking",
        activityType: booking.service,
        date: new Date(booking.createdAt),
      })),
    ]

    return allActivity.sort((a, b) => b.date - a.date).slice(0, 5)
  }

  const getActivityIcon = (activityType, type) => {
    if (type === "order") {
      return activityType === "catering" ? Utensils : Gift
    } else {
      switch (activityType) {
        case "movie":
          return Film
        case "salon":
          return Calendar
        case "fitness":
          return TrendingUp
        case "party":
          return Calendar
        default:
          return Calendar
      }
    }
  }

  const recentActivity = getRecentActivity()

  return (
    <div className="card">
      <h3 className="font-playfair text-xl font-bold text-navy mb-4">Recent Activity</h3>

      {recentActivity.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {recentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.activityType, activity.type)
            return (
              <div
                key={`${activity.type}-${activity._id}`}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-ocean-blue/10 rounded-full flex items-center justify-center">
                  <Icon className="h-4 w-4 text-ocean-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">
                    {activity.type === "order" ? `${activity.activityType} order` : `${activity.activityType} booking`}
                  </p>
                  <p className="text-xs text-gray-600">{activity.date.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ocean-blue">
                    ${(activity.totalAmount || activity.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">{activity.status}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
