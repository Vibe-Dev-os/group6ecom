"use client"

import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Home, Shield, User, Download, Trash2, Eye, EyeOff, ArrowLeft, Phone, MapPin, Bell, Palette, Globe, CheckCircle, AlertCircle } from "lucide-react"

// Form schemas
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

interface UserPreferences {
  emailNotifications: boolean
  marketingEmails: boolean
  orderUpdates: boolean
  theme: "light" | "dark" | "system"
  language: string
}

function SettingsContent() {
  const { data: session, update: updateSession } = useSession()
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    theme: "system",
    language: "en"
  })

  // Form instances
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user.name || "",
      email: session?.user.email || "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })


  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load full profile
        const profileResponse = await fetch('/api/profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const user = profileData.user
          
          // Update form with user data
          profileForm.reset({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
          })
          
          // Update preferences
          if (user.preferences) {
            setPreferences(user.preferences)
          }
        }
        
        // Load preferences separately as fallback
        const preferencesResponse = await fetch('/api/settings/preferences')
        if (preferencesResponse.ok) {
          const preferencesData = await preferencesResponse.json()
          setPreferences(preferencesData.preferences)
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
      }
    }

    if (session) {
      loadUserData()
    }
  }, [session, profileForm])

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

  // Profile update handler
  const onProfileSubmit = async (data: ProfileFormData) => {
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
      // Update session with new data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
        }
      })
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Password change handler
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    setMessage("")
    setMessageType(null)

    try {
      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        showMessage(result.error || "Failed to change password", "error")
        return
      }

      showMessage("Password changed successfully!", "success")
      passwordForm.reset()
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Preferences update handler
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences }
    
    // Optimistic update
    setPreferences(updatedPreferences)

    try {
      const response = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: updatedPreferences }),
      })

      if (!response.ok) {
        // Revert on error
        setPreferences(preferences)
        showMessage("Failed to update preferences", "error")
      } else {
        showMessage("Preferences updated successfully!", "success")
      }
    } catch (error) {
      // Revert on error
      setPreferences(preferences)
      showMessage("An error occurred. Please try again.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account preferences and security settings
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <Link href="/profile">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button asChild style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>


            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
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
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Address Information</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={profileForm.control}
                            name="address.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter street address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter state or province" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="address.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter ZIP or postal code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="address.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
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
                          onClick={() => profileForm.reset()}
                          style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #666666' }}
                        >
                          Reset
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Password & Authentication
                  </CardTitle>
                  <CardDescription>
                    Manage your password and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your current password"
                                  {...field}
                                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted text-muted-foreground hover:text-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your new password"
                                {...field}
                                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm your new password"
                                {...field}
                                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50 hover:text-black"
                      >
                        {isLoading ? "Changing Password..." : "Change Password"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">SMS Authentication</h4>
                        <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      Not Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Authenticator App</h4>
                        <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      Not Enabled
                    </Badge>
                  </div>
                  
                  <Button className="w-full bg-white text-black border-2 border-gray-400 hover:bg-gray-100 hover:text-black shadow-md">
                    Set Up Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage your notification and communication preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive important account notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => updatePreferences({ emailNotifications: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium">Order Updates</h4>
                          <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.orderUpdates}
                        onCheckedChange={(checked) => updatePreferences({ orderUpdates: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium">Marketing Emails</h4>
                          <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.marketingEmails}
                        onCheckedChange={(checked) => updatePreferences({ marketingEmails: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance & Language
                  </CardTitle>
                  <CardDescription>
                    Customize your interface preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h4 className="font-medium">Theme</h4>
                          <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                        </div>
                      </div>
                      <Select
                        value={preferences.theme}
                        onValueChange={(value: "light" | "dark" | "system") => updatePreferences({ theme: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium">Language</h4>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                      </div>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => updatePreferences({ language: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                  <CardDescription>
                    Control your data and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Download Your Data</h4>
                          <p className="text-sm text-muted-foreground">Get a copy of all your account data</p>
                        </div>
                      </div>
                      <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Download</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium">Account Activity</h4>
                          <p className="text-sm text-muted-foreground">View your recent account activity</p>
                        </div>
                      </div>
                      <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>View Activity</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium">Login Sessions</h4>
                          <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                        </div>
                      </div>
                      <Button size="sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Manage Sessions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions that will permanently affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" size="sm">
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

          {/* Global Message Display */}
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
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}
