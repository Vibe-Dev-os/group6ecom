"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, Package, Calendar, User, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Order {
  id: string
  orderNumber: string
  customerInfo: {
    email: string
    firstName: string
    lastName: string
  }
  date: string
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  items: {
    name: string
    quantity: number
    price: number
  }[]
  shippingAddress: {
    address: string
    city: string
    region: string
    zipCode: string
    country: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderStatus,
          paymentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order")
      }

      // Refresh orders
      await fetchOrders()
      setAlertMessage({type: 'success', message: 'Order updated successfully!'})
    } catch (err) {
      console.error("Error updating order:", err)
      setAlertMessage({type: 'error', message: 'Failed to update order'})
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading orders...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-500">
        <AlertDescription className="text-red-600">{error}</AlertDescription>
      </Alert>
    )
  }

  const filteredOrders = orders.filter((order) => {
    const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await handleUpdateStatus(orderId, newStatus)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 font-medium"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 font-medium"
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700 font-medium"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700 font-medium"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700 font-medium"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 font-medium"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700 font-medium"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>View and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>₱{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                          <DialogDescription>
                            Complete order information and management
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <Card className="border-white/20 bg-background/50">
                                <CardHeader className="pb-4">
                                  <CardTitle className="text-base flex items-center gap-2 font-semibold">
                                    <User className="h-5 w-5 text-blue-500" />
                                    Customer Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="py-2 border-b border-white/10">
                                    <span className="text-muted-foreground font-medium text-sm">Name</span>
                                    <p className="font-semibold text-foreground mt-1">{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</p>
                                  </div>
                                  <div className="py-2">
                                    <span className="text-muted-foreground font-medium text-sm">Email</span>
                                    <p className="font-semibold text-foreground mt-1 break-all">{selectedOrder.customerInfo.email}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-white/20 bg-background/50">
                                <CardHeader className="pb-4">
                                  <CardTitle className="text-base flex items-center gap-2 font-semibold">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    Order Info
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="py-2 border-b border-white/10">
                                    <span className="text-muted-foreground font-medium text-sm">Order Date</span>
                                    <p className="font-semibold text-foreground mt-1">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                                  </div>
                                  <div className="py-2">
                                    <span className="text-muted-foreground font-medium text-sm">Total</span>
                                    <p className="font-semibold text-foreground text-lg mt-1">₱{selectedOrder.total.toFixed(2)}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Update Order Status</h4>
                              <Select
                                value={selectedOrder.status}
                                onValueChange={(value) => {
                                  updateOrderStatus(selectedOrder.id, value)
                                  setSelectedOrder({ ...selectedOrder, status: value as typeof selectedOrder.status })
                                }}
                              >
                                <SelectTrigger className="w-full border-white/30 bg-background text-foreground focus:border-white focus-visible:ring-white/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Separator />

                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Order Items
                              </h4>
                              <div className="border border-white/30 rounded-lg divide-y divide-white/20 bg-background/50">
                                {selectedOrder.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-4">
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="border border-white/30 rounded-lg p-4 bg-background/50">
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region} {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                              </p>
                            </div>
                          </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
