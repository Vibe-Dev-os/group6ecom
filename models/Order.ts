import mongoose, { Schema, models } from "mongoose"

export interface IOrder {
  orderNumber: string
  userId?: string
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    phone?: string
  }
  shippingAddress: {
    address: string
    apartment?: string
    city: string
    region: string
    zipCode: string
    country: string
  }
  items: {
    productId: string
    name: string
    price: number
    quantity: number
    image: string
    color: string
    size: string
  }[]
  paymentMethod: "bank" | "cod" | "gcash"
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping: number
  total: number
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: false,
    },
    customerInfo: {
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: String,
    },
    shippingAddress: {
      address: { type: String, required: true },
      apartment: String,
      city: { type: String, required: true },
      region: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        color: String,
        size: String,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["bank", "cod", "gcash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    subtotal: Number,
    shipping: Number,
    total: Number,
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
// Note: orderNumber index is automatically created by unique: true
OrderSchema.index({ userId: 1 })
OrderSchema.index({ "customerInfo.email": 1 })
OrderSchema.index({ orderStatus: 1 })

const Order = models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order
