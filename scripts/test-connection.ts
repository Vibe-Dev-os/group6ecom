import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env")
  process.exit(1)
}

console.log("🔗 Connection String:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"))
console.log("\n🔄 Testing MongoDB connection...")

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log("✅ Successfully connected to MongoDB Atlas!")
    console.log("📊 Database:", mongoose.connection.db.databaseName)
    await mongoose.connection.close()
    console.log("✅ Connection test complete!")
  } catch (error: any) {
    console.error("❌ Connection failed!")
    console.error("Error:", error.message)
    
    if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Possible issues:")
      console.log("   1. Check if cluster URL is correct in your connection string")
      console.log("   2. Verify your internet connection")
      console.log("   3. Check if VPN/firewall is blocking MongoDB")
    }
    
    if (error.message.includes("authentication")) {
      console.log("\n💡 Possible issues:")
      console.log("   1. Check if password is correct")
      console.log("   2. Verify database user exists in MongoDB Atlas")
    }
    
    process.exit(1)
  }
}

testConnection()
