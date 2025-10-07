import mongoose, { Schema, models } from "mongoose"

export interface IProduct {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  colors: {
    name: string
    value: string
  }[]
  sizes: string[]
  category: string
  stock?: number
  status?: string
}

const ProductSchema = new Schema<IProduct>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: ["/placeholder.svg"],
    },
    colors: {
      type: [
        {
          name: String,
          value: String,
        },
      ],
      default: [{ name: "Black", value: "black" }],
    },
    sizes: {
      type: [String],
      default: ["Standard"],
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
ProductSchema.index({ category: 1 })
ProductSchema.index({ name: "text", description: "text" })

const Product = models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product
