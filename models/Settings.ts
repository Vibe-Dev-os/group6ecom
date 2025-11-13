import mongoose, { Schema, Document } from "mongoose"

export interface ISettings extends Document {
  storeName: string
  storeDescription: string
  contactEmail: string
  contactPhone: string
  currency: string
  currencySymbol: string
  freeShippingThreshold: number
  standardShippingRate: number
  maintenanceMode: boolean
  guestCheckout: boolean
  productReviews: boolean
  orderNotifications: boolean
  lowStockAlerts: boolean
  createdAt?: Date
  updatedAt?: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: {
      type: String,
      required: true,
      default: "CAD STORE",
    },
    storeDescription: {
      type: String,
      required: true,
      default: "Modern e-commerce store built with Next.js",
    },
    contactEmail: {
      type: String,
      required: true,
      default: "support@cadstore.com",
    },
    contactPhone: {
      type: String,
      required: true,
      default: "+63 (555) 123-4567",
    },
    currency: {
      type: String,
      required: true,
      default: "PHP",
    },
    currencySymbol: {
      type: String,
      required: true,
      default: "₱",
    },
    freeShippingThreshold: {
      type: Number,
      required: true,
      default: 1000,
    },
    standardShippingRate: {
      type: Number,
      required: true,
      default: 150,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    guestCheckout: {
      type: Boolean,
      default: true,
    },
    productReviews: {
      type: Boolean,
      default: true,
    },
    orderNotifications: {
      type: Boolean,
      default: true,
    },
    lowStockAlerts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true })

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema)
