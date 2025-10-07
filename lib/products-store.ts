// Centralized product store using MongoDB
import connectDB from "./mongodb"
import Product from "@/models/Product"

// Get all products
export async function getAllProducts() {
  await connectDB()
  const products = await Product.find({}).sort({ createdAt: -1 }).lean()
  return products.map(p => ({
    ...p,
    _id: p._id.toString(),
  }))
}

// Get product by ID
export async function getProductById(id: string) {
  await connectDB()
  const product = await Product.findOne({ id }).lean()
  if (!product) return null
  return {
    ...product,
    _id: product._id.toString(),
  }
}

// Get products by category
export async function getProductsByCategory(category: string) {
  await connectDB()
  const products = await Product.find({ category }).lean()
  return products.map(p => ({
    ...p,
    _id: p._id.toString(),
  }))
}

// Add new product
export async function addProduct(product: any) {
  await connectDB()
  
  const newProduct = await Product.create({
    ...product,
    id: `product_${Date.now()}`,
    images: product.images || ["/placeholder.svg"],
    colors: product.colors || [{ name: "Black", value: "black" }],
    sizes: product.sizes || ["Standard"],
  })
  
  return {
    ...newProduct.toObject(),
    _id: newProduct._id.toString(),
  }
}

// Update product
export async function updateProduct(id: string, updates: any) {
  await connectDB()
  
  const product = await Product.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true }
  ).lean()
  
  if (!product) return null
  
  return {
    ...product,
    _id: product._id.toString(),
  }
}

// Delete product
export async function deleteProduct(id: string) {
  await connectDB()
  
  const result = await Product.deleteOne({ id })
  return result.deletedCount > 0
}
