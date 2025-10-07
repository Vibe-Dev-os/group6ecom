import mongoose, { Schema, models } from "mongoose"

export interface IUser {
  email: string
  password: string
  name: string
  role: "user" | "admin"
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
  },
  {
    timestamps: true,
  }
)

// Note: email index is automatically created by unique: true

const User = models.User || mongoose.model<IUser>("User", UserSchema)

export default User
