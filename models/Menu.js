import mongoose from "mongoose"

const MenuSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["catering", "stationery"],
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema)
