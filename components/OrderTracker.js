"use client"

import { CheckCircle, Clock, Package, Truck } from "lucide-react"

export default function OrderTracker({ status, type = "order" }) {
  const getSteps = () => {
    if (type === "booking") {
      return [
        { key: "pending", label: "Booking Requested", icon: Clock },
        { key: "confirmed", label: "Confirmed", icon: CheckCircle },
        { key: "completed", label: "Completed", icon: Package },
      ]
    }

    return [
      { key: "pending", label: "Order Placed", icon: Clock },
      { key: "preparing", label: "Preparing", icon: Package },
      { key: "ready", label: "Ready", icon: CheckCircle },
      { key: "delivered", label: "Delivered", icon: Truck },
    ]
  }

  const steps = getSteps()
  const currentStepIndex = steps.findIndex((step) => step.key === status)

  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = index <= currentStepIndex
        const isCurrent = index === currentStepIndex

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted
                  ? "bg-ocean-blue border-ocean-blue text-white"
                  : isCurrent
                    ? "border-ocean-blue text-ocean-blue"
                    : "border-gray-300 text-gray-300"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="ml-2">
              <p
                className={`text-sm font-medium ${
                  isCompleted ? "text-ocean-blue" : isCurrent ? "text-ocean-blue" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-4 ${index < currentStepIndex ? "bg-ocean-blue" : "bg-gray-300"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
