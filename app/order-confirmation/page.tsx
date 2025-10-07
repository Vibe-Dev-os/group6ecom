"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Copy, Mail } from "lucide-react"

interface OrderConfirmation {
  orderNumber: string
  total: number
  paymentMethod: string
  paymentInstructions?: {
    type: string
    bankName?: string
    accountName?: string
    accountNumber?: string
    gcashNumber?: string
    amount: number
    reference: string
    instructions: string
  }
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderConfirmation | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data))
        setOrderData(parsed)
      } catch (error) {
        console.error("Failed to parse order data:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [searchParams, router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  const { paymentMethod, paymentInstructions } = orderData

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your purchase</p>
        </div>

        {/* Order Number */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-2xl font-bold">{orderData.orderNumber}</p>
            </div>
            <button
              onClick={() => copyToClipboard(orderData.orderNumber)}
              className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm transition-colors hover:bg-muted/80"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentInstructions && (
          <div className="mt-6 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-bold">
              {paymentMethod === "bank" && "Bank Transfer Instructions"}
              {paymentMethod === "gcash" && "GCash Payment Instructions"}
              {paymentMethod === "cod" && "Cash on Delivery"}
            </h2>

            {paymentMethod === "bank" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-semibold">{paymentInstructions.bankName}</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-semibold">{paymentInstructions.accountName}</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{paymentInstructions.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(paymentInstructions.accountNumber!)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="text-xl font-bold text-blue-600">₱{paymentInstructions.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Important:</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{paymentInstructions.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "gcash" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">GCash Number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{paymentInstructions.gcashNumber}</p>
                      <button
                        onClick={() => copyToClipboard(paymentInstructions.gcashNumber!)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-semibold">{paymentInstructions.accountName}</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-4 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="text-xl font-bold text-blue-600">₱{paymentInstructions.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Next Steps:</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{paymentInstructions.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="rounded-md bg-green-50 dark:bg-green-950/30 p-4">
                <p className="text-sm text-green-800 dark:text-green-200">{paymentInstructions.instructions}</p>
                <p className="mt-2 text-sm font-semibold text-green-900 dark:text-green-100">
                  Amount to prepare: ₱{paymentInstructions.amount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* What's Next */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-3 font-semibold">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
              <span>You will receive an email confirmation at the address you provided</span>
            </li>
            {paymentMethod !== "cod" && (
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                <span>Complete the payment using the instructions above</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
              <span>Your order will be processed and shipped within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
              <span>Delivery time: 5-7 business days</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-full border-2 border-input px-8 py-3 font-semibold transition-colors hover:bg-muted"
          >
            Print Order Details
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help? Contact us at <a href="mailto:orders@acmestore.com" className="text-blue-600 hover:underline">orders@acmestore.com</a></p>
          <p className="mt-1">Or call us at <a href="tel:+639171234567" className="text-blue-600 hover:underline">0917-123-4567</a></p>
        </div>
      </div>
    </div>
  )
}
