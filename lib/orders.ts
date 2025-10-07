export interface Order {
  id: string
  orderNumber: string
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    phone?: string
  }
  shippingAddress: {
    address: string
    apartment?: string
    city: string
    region: string
    zipCode: string
    country: string
  }
  items: {
    productId: string
    name: string
    price: number
    quantity: number
    image: string
    color: string
    size: string
  }[]
  paymentMethod: "bank" | "cod" | "gcash"
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping: number
  total: number
  createdAt: string
  updatedAt: string
}

// In-memory storage (replace with database in production)
let orders: Order[] = []

export function createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Order {
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  const order: Order = {
    ...orderData,
    id: `order_${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  orders.push(order)
  return order
}

export function getOrderById(id: string): Order | undefined {
  return orders.find(order => order.id === id)
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return orders.find(order => order.orderNumber === orderNumber)
}

export function getAllOrders(): Order[] {
  return orders
}

export function updateOrderStatus(orderId: string, status: Order["orderStatus"]): Order | undefined {
  const order = orders.find(o => o.id === orderId)
  if (order) {
    order.orderStatus = status
    order.updatedAt = new Date().toISOString()
  }
  return order
}

export function updatePaymentStatus(orderId: string, status: Order["paymentStatus"]): Order | undefined {
  const order = orders.find(o => o.id === orderId)
  if (order) {
    order.paymentStatus = status
    order.updatedAt = new Date().toISOString()
  }
  return order
}
