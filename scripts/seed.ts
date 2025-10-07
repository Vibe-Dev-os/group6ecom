import dotenv from "dotenv"
import mongoose from "mongoose"
import { products } from "../lib/products"
import Product from "../models/Product"

// Load environment variables from .env file
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env file")
  process.exit(1)
}

console.log("📝 Using MongoDB URI:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")) // Hide credentials

async function seed() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Connected!")

    // Clear existing products
    console.log("Clearing existing products...")
    await Product.deleteMany({})
    console.log("Products cleared!")

    // Insert all products
    console.log("Seeding products...")
    const createdProducts = await Product.insertMany(products)
    console.log(`✅ Successfully seeded ${createdProducts.length} products!`)

    // Display products
    console.log("\nSeeded Products:")
    createdProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ₱${p.price} (${p.category})`)
    })

    mongoose.connection.close()
    console.log("\nDatabase connection closed.")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()
