import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    type: {
      type: String,
      enum: ["catering", "stationery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
