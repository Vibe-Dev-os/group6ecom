import mongoose, { Schema, models } from "mongoose"

export interface IUser {
  email: string
  password: string
  name: string
  role: "user" | "admin"
  phone?: string
  address?: {
    street?: string
    barangay?: string
    municipality?: string
    city?: string
    region?: string
    zipCode?: string
    country?: string
  }
  avatar?: string
  preferences?: {
    emailNotifications: boolean
    marketingEmails: boolean
    orderUpdates: boolean
    theme: "light" | "dark" | "system"
    language: string
  }
  lastLogin?: Date
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      barangay: { type: String, trim: true },
      municipality: { type: String, trim: true },
      city: { type: String, trim: true },
      region: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    avatar: {
      type: String,
      trim: true,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true },
      theme: { 
        type: String, 
        enum: ["light", "dark", "system"], 
        default: "system" 
      },
      language: { type: String, default: "en" },
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Note: email index is automatically created by unique: true

const User = models.User || mongoose.model<IUser>("User", UserSchema)

export default User
