"use client"

import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, User, Settings, Package, Camera, Mail, Phone, MapPin, Calendar, Shield, Edit3, CheckCircle, AlertCircle } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type ProfileFormData = z.infer<typeof profileSchema>

function ProfileContent() {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [userProfile, setUserProfile] = useState<any>(null)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user.name || "",
      email: session?.user.email || "",
    },
  })

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!session) return
      
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data.user)
          // Update form with latest data
          form.reset({
            name: data.user.name || "",
            email: data.user.email || "",
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }

    loadProfile()
  }, [session, form])

  // Helper function to show messages
  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        setMessage("")
        setMessageType(null)
      }, 5000)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setMessage("")
    setMessageType(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        showMessage(result.error || "Failed to update profile", "error")
        return
      }

      showMessage("Profile updated successfully!", "success")
      
      // Refresh session to get updated data
      window.location.reload()
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <Link href="/orders">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
              </Button>
              <Button asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
            </div>
          </div>

          {/* Profile Header Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={userProfile?.avatar || ""} alt={userProfile?.name || session?.user.name} />
                    <AvatarFallback 
                      className="text-2xl font-bold"
                      style={{ backgroundColor: '#f0f0f0', color: '#000000' }}
                    >
                      {(userProfile?.name || session?.user.name) ? getInitials(userProfile?.name || session?.user.name || "") : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #666666' }}
                  >
                    <Camera className="h-4 w-4" style={{ color: '#000000' }} />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{userProfile?.name || session?.user.name}</h2>
                    <Badge variant={(userProfile?.role || session?.user.role) === 'admin' ? 'default' : 'secondary'} className="capitalize">
                      <Shield className="mr-1 h-3 w-3" />
                      {userProfile?.role || session?.user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Mail className="h-4 w-4" />
                    <span>{userProfile?.email || session?.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Account Status</div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">0</div>
                  <p className="text-sm text-muted-foreground">Orders this month</p>
                  <Button size="sm" className="mt-3 w-full" asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-green-600" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Profile Complete</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <Link href="/settings">Manage Settings</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Password Protected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>2FA Not Enabled</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    Enhance Security
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="justify-start h-auto p-4" asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <Link href="/orders">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-6 w-6" />
                        <span>View Orders</span>
                      </div>
                    </Link>
                  </Button>
                  <Button className="justify-start h-auto p-4 bg-white text-black border border-gray-300 hover:bg-gray-50 shadow-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Edit3 className="h-6 w-6" />
                      <span>Edit Profile</span>
                    </div>
                  </Button>
                  <Button className="justify-start h-auto p-4" asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <Link href="/settings">
                      <div className="flex flex-col items-center gap-2">
                        <Settings className="h-6 w-6" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </Button>
                  <Button className="justify-start h-auto p-4" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="h-6 w-6" />
                      <span>Security</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {message && messageType && (
                      <Alert 
                        className={
                          messageType === "success" 
                            ? "border-green-200 bg-green-50 text-green-800" 
                            : "border-red-200 bg-red-50 text-red-800"
                        }
                      >
                        {messageType === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {messageType === "success" ? "Success" : "Error"}
                        </AlertTitle>
                        <AlertDescription>
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="min-w-[120px]"
                        style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #666666' }}
                      >
                        {isLoading ? "Updating..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => form.reset()}
                        style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #666666' }}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your account information and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">User ID</Label>
                        <p className="text-sm text-muted-foreground font-mono">{session?.user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Account Role</Label>
                        <p className="text-sm text-muted-foreground capitalize">{session?.user.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Member Since</Label>
                        <p className="text-sm text-muted-foreground">{new Date().getFullYear()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Account Status</Label>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Change Password</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Enable 2FA</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                      </div>
                    </div>
                    <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Preferences
                </CardTitle>
                <CardDescription>
                  Customize your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">Receive promotional offers</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Privacy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Export</p>
                          <p className="text-sm text-muted-foreground">Download your account data</p>
                        </div>
                        <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Download</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Account Deletion</p>
                          <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                        </div>
                        <Button variant="destructive" size="sm">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
