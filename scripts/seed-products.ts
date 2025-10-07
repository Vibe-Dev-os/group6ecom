import dotenv from "dotenv"
import mongoose from "mongoose"
import { products } from "../lib/products"

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in .env file")
  process.exit(1)
}

console.log("📝 Using MongoDB URI:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"))

// Define Product schema inline
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [String],
  colors: [{
    name: String,
    value: String
  }],
  sizes: [String],
  category: { type: String, required: true },
  stock: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

async function seedProducts() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI!)
    console.log("Connected!")

    console.log("\nSeeding products...")

    // Clear existing products
    const deleteResult = await Product.deleteMany({})
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing products`)

    // Insert new products
    const insertedProducts = await Product.insertMany(
      products.map(product => ({
        ...product,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    console.log(`✅ Successfully inserted ${insertedProducts.length} products`)

    // Display summary by category
    const categories = [...new Set(products.map(p => p.category))]
    console.log("\n📊 Products by category:")
    for (const category of categories) {
      const count = products.filter(p => p.category === category).length
      console.log(`  ${category}: ${count} products`)
    }

    console.log("\n✅ Product seeding complete!")

    mongoose.connection.close()
    console.log("\nDatabase connection closed.")
  } catch (error) {
    console.error("Error seeding products:", error)
    process.exit(1)
  }
}

seedProducts()
