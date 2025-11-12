"use client"

import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Home, Shield, User, Palette, Globe, Download, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react"

function SettingsContent() {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("security")
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveSettings = async () => {
    setMessage("")
    
    try {
      // In a real app, you would call your settings API here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage("✅ Settings saved successfully!")
    } catch (error) {
      setMessage("❌ An error occurred. Please try again.")
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match")
      return
    }
    
    if (newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters long")
      return
    }

    try {
      // In a real app, you would call your password change API here
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage("✅ Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage("❌ Failed to change password. Please try again.")
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
            <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>


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
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-foreground font-medium">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current password"
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
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-foreground font-medium">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                      />
                    </div>
                    
                    <Button onClick={handlePasswordChange} className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50 hover:text-black">
                      Change Password
                    </Button>
                  </div>
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

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Display Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize how the application looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Theme</Label>
                      <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        <Button className="h-auto p-4" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 mx-auto mb-2"></div>
                            <span className="text-sm">Light</span>
                          </div>
                        </Button>
                        <Button className="h-auto p-4" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-800 mx-auto mb-2"></div>
                            <span className="text-sm">Dark</span>
                          </div>
                        </Button>
                        <Button className="h-auto p-4" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-800 mx-auto mb-2"></div>
                            <span className="text-sm">System</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                  <CardDescription>
                    Set your language and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Button className="w-full justify-start" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                        🇺🇸 English (US)
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Button className="w-full justify-start" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                        ₱ Philippine Peso (PHP)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          {message && (
            <Alert className={message.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={message.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button 
              onClick={() => window.location.reload()} 
              style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #666666' }}
            >
              Reset Changes
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #666666' }}
            >
              Save All Settings
            </Button>
          </div>
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
