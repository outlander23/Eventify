"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Bell, Shield, User, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    eventReminders: true,
    marketingEmails: false,
    weeklyDigest: true,
    twoFactorAuth: false,
    profileVisibility: "public",
    dataCollection: true,
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth")
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setIsUpdating(true)
    try {
      // In real app, save settings to backend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Settings saved:", settings)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // In real app, call delete account API
        await signOut()
        navigate("/")
      } catch (error) {
        console.error("Error deleting account:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate("/account")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Button>
            <h1 className="text-h1 text-foreground mb-2">Settings</h1>
            <p className="text-body text-muted-foreground">Manage your account preferences and privacy settings</p>
          </div>

          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account">
                <Trash2 className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <div className="text-small text-muted-foreground">
                        Receive notifications about your registrations via email
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <div className="text-small text-muted-foreground">Receive push notifications on your device</div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Event Reminders</Label>
                      <div className="text-small text-muted-foreground">
                        Get reminded about upcoming events you're registered for
                      </div>
                    </div>
                    <Switch
                      checked={settings.eventReminders}
                      onCheckedChange={(checked) => handleSettingChange("eventReminders", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <div className="text-small text-muted-foreground">
                        Receive emails about new events and promotions
                      </div>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Digest</Label>
                      <div className="text-small text-muted-foreground">
                        Get a weekly summary of new events in your area
                      </div>
                    </div>
                    <Switch
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <div className="text-small text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Data Collection</Label>
                      <div className="text-small text-muted-foreground">
                        Allow us to collect analytics data to improve our service
                      </div>
                    </div>
                    <Switch
                      checked={settings.dataCollection}
                      onCheckedChange={(checked) => handleSettingChange("dataCollection", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base">Profile Visibility</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="public"
                          name="visibility"
                          value="public"
                          checked={settings.profileVisibility === "public"}
                          onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                        />
                        <Label htmlFor="public">Public - Anyone can see your profile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="private"
                          name="visibility"
                          value="private"
                          checked={settings.profileVisibility === "private"}
                          onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                        />
                        <Label htmlFor="private">Private - Only you can see your profile</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={user?.name?.split(" ")[0] || ""} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={user?.name?.split(" ")[1] || ""} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself" />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Your city or region" />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="https://yourwebsite.com" />
                  </div>

                  <Button>Update Profile</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-small">
                      <div>
                        <Label className="text-muted-foreground">Account Created</Label>
                        <div>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Account Type</Label>
                        <div className="capitalize">{user?.role || "User"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">User ID</Label>
                        <div className="font-mono">{user?.id}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email Verified</Label>
                        <div>Yes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Delete Account</h4>
                      <p className="text-small text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
