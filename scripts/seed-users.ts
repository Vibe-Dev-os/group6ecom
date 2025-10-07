import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User"

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env file")
  process.exit(1)
}

console.log("📝 Using MongoDB URI:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"))

// Default users
const defaultUsers = [
  {
    email: "group6@gmail.com",
    password: "group6ecom",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    email: "user@example.com",
    password: "password",
    name: "Regular User",
    role: "user" as const,
  },
]

async function seedUsers() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI!)
    console.log("Connected!")

    console.log("\nSeeding users...")

    for (const userData of defaultUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email })

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`)
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Create user
      await User.create({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
      })

      console.log(`✅ Created ${userData.role}: ${userData.email}`)
    }

    console.log("\n✅ User seeding complete!")
    console.log("\n📧 Login Credentials:")
    console.log("-------------------")
    defaultUsers.forEach((user) => {
      console.log(`${user.role.toUpperCase()}:`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Password: ${user.password}`)
    })

    mongoose.connection.close()
    console.log("\nDatabase connection closed.")
  } catch (error) {
    console.error("Error seeding users:", error)
    process.exit(1)
  }
}

seedUsers()
