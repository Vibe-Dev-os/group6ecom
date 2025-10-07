import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Search in name and description using text search
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
      status: "active"
    })
      .limit(50)
      .lean()

    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images,
      category: product.category,
      stock: product.stock,
      colors: product.colors,
      sizes: product.sizes,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    )
  }
}
