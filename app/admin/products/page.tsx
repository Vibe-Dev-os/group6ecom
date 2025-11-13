"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Search, Package, FileText, Image, DollarSign, Hash, Tag, Activity } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { processImageUrls, formatImageUrlsForForm, getPreviewUrl } from "@/lib/image-utils"

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Stock must be a non-negative number"),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  images: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

// Mock products data
const initialProducts = [
  {
    id: "1",
    name: "Gaming Laptop Pro X1",
    description: "High-performance gaming laptop with RTX 4090",
    price: 1299.99,
    category: "laptops",
    stock: 15,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Wireless Gaming Mouse",
    description: "Ergonomic wireless mouse with RGB lighting",
    price: 89.99,
    category: "mice",
    stock: 50,
    status: "active" as const,
  },
  {
    id: "3",
    name: "Gaming Chair Elite",
    description: "Premium gaming chair with lumbar support",
    price: 449.99,
    category: "chairs",
    stock: 0,
    status: "out_of_stock" as const,
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<typeof initialProducts>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [productToDelete, setProductToDelete] = useState<typeof initialProducts[0] | null>(null)
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)

  // Fetch products from API on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          // Sort products consistently by name for stable ordering
          const sortedProducts = data.sort((a, b) => a.name.localeCompare(b.name))
          setProducts(sortedProducts)
        } else {
          console.error("Products data is not an array:", data)
          setProducts([])
        }
      } else {
        console.error("Failed to fetch products")
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      status: "active",
      images: "",
    },
  })

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    
    try {
      if (editingProduct) {
        // Update existing product via API - process Google Images URLs and other complex URLs
        const imageUrls = data.images ? processImageUrls(data.images) : []
        const stockQuantity = Number(data.stock)
        
        // Auto-determine status based on stock quantity if not manually set to out_of_stock
        let finalStatus = data.status
        if (data.status !== "out_of_stock") {
          finalStatus = stockQuantity === 0 ? "out_of_stock" : "active"
        }
        
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            price: Number(data.price),
            category: data.category,
            stock: stockQuantity,
            status: finalStatus,
            images: imageUrls.length > 0 ? imageUrls : undefined,
          }),
        })
        
        if (response.ok) {
          await fetchProducts() // Refresh products from server
        }
      } else {
        // Add new product via API - process Google Images URLs and other complex URLs
        const imageUrls = data.images ? processImageUrls(data.images) : []
        const stockQuantity = Number(data.stock)
        
        // Auto-determine status based on stock quantity if not manually set to out_of_stock
        let finalStatus = data.status
        if (data.status !== "out_of_stock") {
          finalStatus = stockQuantity === 0 ? "out_of_stock" : "active"
        }
        
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            price: Number(data.price),
            category: data.category,
            stock: stockQuantity,
            status: finalStatus,
            images: imageUrls.length > 0 ? imageUrls : undefined,
          }),
        })
        
        if (response.ok) {
          await fetchProducts() // Refresh products from server
        }
      }
      
      setIsDialogOpen(false)
      setEditingProduct(null)
      form.reset()
    } catch (error) {
      console.error("Failed to save product:", error)
      setAlertMessage({type: 'error', message: 'Failed to save product. Please try again.'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
    // Use setTimeout to prevent text selection highlighting
    setTimeout(() => {
      form.reset({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        stock: String(product.stock),
        status: product.status,
        images: product.images ? product.images.join(', ') : "",
      })
      // Clear any text selection
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges()
      }
    }, 100)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        await fetchProducts() // Refresh products from server
        setProductToDelete(null)
        setAlertMessage({type: 'success', message: 'Product deleted successfully!'})
      } else {
        setAlertMessage({type: 'error', message: 'Failed to delete product. Please try again.'})
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      setAlertMessage({type: 'error', message: 'Failed to delete product. Please try again.'})
    }
  }

  const handleAddNew = () => {
    setIsDialogOpen(true)
    setEditingProduct(null)
    form.reset()
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 font-medium" }
    if (stock < 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700 font-medium" }
    return { label: "In Stock", color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 font-medium" }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex-shrink-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg border-0 relative z-10 min-w-[140px]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product details" : "Create a new product in your inventory"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" className="border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50" autoFocus={false} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter product description" 
                          className="min-h-[100px] border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Product Images (URLs)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter image URLs separated by commas&#10;Supports Google Images links, Unsplash, direct URLs, etc.&#10;Example:&#10;https://images.unsplash.com/photo-123456, https://www.google.com/imgres?imgurl=..."
                          className="min-h-[100px] border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50"
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        ✅ Supports Google Images links, Unsplash, Pexels, and direct image URLs. Separate multiple URLs with commas.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Price (₱)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" className="border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Stock Quantity
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" className="border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="laptops">Gaming Laptops</SelectItem>
                            <SelectItem value="mice">Gaming Mice</SelectItem>
                            <SelectItem value="chairs">Gaming Chairs</SelectItem>
                            <SelectItem value="keyboards">Keyboards</SelectItem>
                            <SelectItem value="monitors">Monitors</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Status
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/30 text-foreground hover:bg-white/10">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>View and manage all products in your store</CardDescription>
            </div>
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading products...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell>₱{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge className={getStockStatus(product.stock || 0).color}>
                      {getStockStatus(product.stock || 0).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="h-8 w-8 p-0 lg:h-9 lg:w-9"
                      >
                        <Pencil className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProductToDelete(product)}
                        className="h-8 w-8 p-0 lg:h-9 lg:w-9 text-red-500 hover:text-red-600 hover:bg-red-50/50"
                      >
                        <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDelete(productToDelete.id)}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success/Error Alert Dialog */}
      <AlertDialog open={!!alertMessage} onOpenChange={() => setAlertMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertMessage?.type === 'success' ? 'Success' : 'Error'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setAlertMessage(null)}
              className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
