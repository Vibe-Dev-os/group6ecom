"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowLeft, CreditCard, Banknote, Smartphone, Shield, CheckCircle2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/currency"

type CheckoutStep = "information" | "shipping" | "payment"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, totalPrice } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      // Save that user was trying to checkout
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', '/checkout')
      }
      router.push('/auth/signin')
    }
  }, [session, status, router])
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    barangay: "",
    apartment: "",
    city: "",
    region: "",
    zipCode: "",
    country: "Philippines",
    newsletter: false,
  })
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod" | "gcash">("cod")

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === "information") {
      setCurrentStep("shipping")
    } else if (currentStep === "shipping") {
      setCurrentStep("payment")
    } else {
      // Process payment and create order
      setIsProcessing(true)
      
      try {
        const orderData = {
          customerInfo: {
            email: formData.email,
            phone: formData.phone,
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          shippingAddress: {
            address: formData.address,
            barangay: formData.barangay,
            apartment: formData.apartment,
            city: formData.city,
            region: formData.region,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            color: item.color,
            size: item.size,
          })),
          paymentMethod,
          subtotal,
          shipping,
          total,
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          throw new Error("Failed to create order")
        }

        const result = await response.json()

        // Redirect to confirmation page with order details
        const confirmationData = {
          orderNumber: result.order.orderNumber,
          total: result.order.total,
          paymentMethod: result.order.paymentMethod,
          paymentInstructions: result.paymentInstructions,
        }

        router.push(`/order-confirmation?data=${encodeURIComponent(JSON.stringify(confirmationData))}`)
      } catch (error) {
        console.error("Order creation error:", error)
        alert("Failed to create order. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const subtotal = totalPrice
  const shipping = 0
  const taxes = 0
  const total = subtotal + shipping + taxes

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-[1920px] lg:grid-cols-2">
        {/* Left side - Form */}
        <div className="border-r border-border px-6 py-12 lg:px-12">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentStep("information")}
              className={
                currentStep === "information" ? "font-semibold" : "text-muted-foreground hover:text-foreground"
              }
            >
              Information
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => currentStep !== "information" && setCurrentStep("shipping")}
              className={currentStep === "shipping" ? "font-semibold" : "text-muted-foreground hover:text-foreground"}
              disabled={currentStep === "information"}
            >
              Shipping
            </button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              className={currentStep === "payment" ? "font-semibold" : "text-muted-foreground"}
              disabled={currentStep !== "payment"}
            >
              Payment
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === "information" && (
              <>
                <div>
                  <h2 className="mb-4 text-xl font-bold">Contact</h2>
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile number (e.g., 09171234567)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{11}"
                      className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border border-white/30"
                      />
                      <span className="text-sm">Send me news and exclusive offers via SMS/Email</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-bold">Shipping address</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value="Philippines"
                        disabled
                        className="h-12 w-full rounded-md border border-white/30 bg-muted px-4 text-sm outline-none cursor-not-allowed"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        🇵🇭 Shipping within Philippines only
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name (optional)"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                      />
                    </div>

                    <input
                      type="text"
                      name="address"
                      placeholder="House No., Building, Street Name"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                    />

                    <input
                      type="text"
                      name="barangay"
                      placeholder="Barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                    />

                    <input
                      type="text"
                      name="apartment"
                      placeholder="Unit/Floor No., Building Name (optional)"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                      />
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                      >
                        <option value="">Region</option>
                        <option value="NCR">NCR - Metro Manila</option>
                        <option value="CAR">CAR - Cordillera Administrative Region</option>
                        <option value="I">Region I - Ilocos Region</option>
                        <option value="II">Region II - Cagayan Valley</option>
                        <option value="III">Region III - Central Luzon</option>
                        <option value="IV-A">Region IV-A - CALABARZON</option>
                        <option value="IV-B">Region IV-B - MIMAROPA</option>
                        <option value="V">Region V - Bicol Region</option>
                        <option value="VI">Region VI - Western Visayas</option>
                        <option value="VII">Region VII - Central Visayas</option>
                        <option value="VIII">Region VIII - Eastern Visayas</option>
                        <option value="IX">Region IX - Zamboanga Peninsula</option>
                        <option value="X">Region X - Northern Mindanao</option>
                        <option value="XI">Region XI - Davao Region</option>
                        <option value="XII">Region XII - SOCCSKSARGEN</option>
                        <option value="XIII">Region XIII - Caraga</option>
                        <option value="BARMM">BARMM - Bangsamoro</option>
                      </select>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Postal/ZIP Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{4}"
                        maxLength={4}
                        className="h-12 w-full rounded-md border border-white/30 bg-background px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/50"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === "shipping" && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Shipping method</h2>
                <div className="rounded-md border border-white/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Standard Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">5-7 business days</p>
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div>
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold">Payment Method</h2>
                  <p className="text-sm text-muted-foreground">Choose your preferred payment method</p>
                </div>
                
                <div className="space-y-4">
                  {/* Bank Transfer */}
                  <label className="group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 border-white/20 bg-gradient-to-r from-white/5 to-transparent p-5 transition-all duration-300 hover:border-blue-400/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-transparent hover:shadow-lg has-[:checked]:border-blue-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-blue-500/20 has-[:checked]:to-blue-500/5 has-[:checked]:shadow-xl">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value as "bank" | "cod" | "gcash")}
                      className="mt-1.5 h-5 w-5 accent-blue-600"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Bank Transfer</span>
                        <Shield className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Transfer funds directly to our bank account. Order will be processed after payment confirmation.
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Secure & Verified</span>
                      </div>
                    </div>
                    {paymentMethod === "bank" && (
                      <div className="absolute right-4 top-4 rounded-full bg-blue-500 p-1">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </label>

                  {/* Cash on Delivery */}
                  <label className="group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 border-white/20 bg-gradient-to-r from-white/5 to-transparent p-5 transition-all duration-300 hover:border-green-400/50 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-transparent hover:shadow-lg has-[:checked]:border-green-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-green-500/20 has-[:checked]:to-green-500/5 has-[:checked]:shadow-xl">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value as "bank" | "cod" | "gcash")}
                      className="mt-1.5 h-5 w-5 accent-green-600"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Banknote className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Cash on Delivery (COD)</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                          Popular
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pay with cash when your order is delivered to your doorstep.
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>No upfront payment required</span>
                      </div>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="absolute right-4 top-4 rounded-full bg-green-500 p-1">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </label>

                  {/* GCash */}
                  <label className="group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 border-white/20 bg-gradient-to-r from-white/5 to-transparent p-5 transition-all duration-300 hover:border-blue-400/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-transparent hover:shadow-lg has-[:checked]:border-blue-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-blue-500/20 has-[:checked]:to-blue-500/5 has-[:checked]:shadow-xl">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={paymentMethod === "gcash"}
                      onChange={(e) => setPaymentMethod(e.target.value as "bank" | "cod" | "gcash")}
                      className="mt-1.5 h-5 w-5 accent-blue-600"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">GCash</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                          Instant
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pay instantly using your GCash mobile wallet. Fast and secure payment.
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Instant confirmation</span>
                      </div>
                    </div>
                    {paymentMethod === "gcash" && (
                      <div className="absolute right-4 top-4 rounded-full bg-blue-500 p-1">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </label>
                </div>

                {/* Enhanced Payment Instructions */}
                {paymentMethod === "bank" && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:border-blue-800 dark:from-blue-950/50 dark:to-blue-900/30">
                    <div className="border-b border-blue-200 bg-blue-100/50 px-6 py-4 dark:border-blue-800 dark:bg-blue-900/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Bank Account Details</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Complete your payment using these details</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg bg-white/70 p-4 dark:bg-blue-950/50">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Bank Name</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">BDO Unibank</p>
                        </div>
                        <div className="rounded-lg bg-white/70 p-4 dark:bg-blue-950/50">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Account Name</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">CAD Gaming Store</p>
                        </div>
                        <div className="rounded-lg bg-white/70 p-4 dark:bg-blue-950/50 sm:col-span-2">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Account Number</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">1234-5678-9012</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg bg-blue-600 p-4 text-white">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Important Instructions:</p>
                            <p className="mt-1 text-sm text-blue-100">
                              Please send proof of payment to <span className="font-semibold">orders@cadstore.com</span> with your order number for faster processing.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "gcash" && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:border-blue-800 dark:from-blue-950/50 dark:to-blue-900/30">
                    <div className="border-b border-blue-200 bg-blue-100/50 px-6 py-4 dark:border-blue-800 dark:bg-blue-900/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                          <Smartphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">GCash Payment Details</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Send payment to this GCash number</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg bg-white/70 p-4 dark:bg-blue-950/50">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">GCash Number</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">0917-123-4567</p>
                        </div>
                        <div className="rounded-lg bg-white/70 p-4 dark:bg-blue-950/50">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Account Name</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">CAD Gaming Store</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg bg-blue-600 p-4 text-white">
                        <div className="flex items-start gap-3">
                          <Smartphone className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Next Steps:</p>
                            <p className="mt-1 text-sm text-blue-100">
                              Send payment via GCash and screenshot the confirmation. Email the screenshot to <span className="font-semibold">orders@cadstore.com</span> with your order number.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 dark:border-green-800 dark:from-green-950/50 dark:to-green-900/30">
                    <div className="border-b border-green-200 bg-green-100/50 px-6 py-4 dark:border-green-800 dark:bg-green-900/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                          <Banknote className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-900 dark:text-green-100">Cash on Delivery</h3>
                          <p className="text-sm text-green-700 dark:text-green-300">Payment instructions for delivery</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="rounded-lg bg-green-600 p-4 text-white">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Payment Instructions:</p>
                            <p className="mt-1 text-sm text-green-100">
                              Please prepare the exact amount for faster transaction. Our delivery rider will collect the payment upon delivery.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-white hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to cart
              </Link>
              <button
                type="submit"
                disabled={isProcessing}
                className="h-12 rounded-full bg-blue-600 px-8 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : currentStep === "payment" ? (
                  "Complete order"
                ) : (
                  "Continue to " + (currentStep === "information" ? "shipping" : "payment")
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Order Summary */}
        <div className="bg-muted/30 px-6 py-12 lg:px-12">
          <h2 className="mb-6 text-xl font-bold">Order summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-white/30">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" quality={100} unoptimized />
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.color} / {item.size}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">
                {currentStep === "information" ? "Calculated at next step" : "Free"}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span>
                <span className="text-sm font-normal text-muted-foreground">PHP </span>
                {formatPrice(total).replace("₱", "")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
