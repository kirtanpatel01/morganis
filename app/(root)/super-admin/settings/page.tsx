"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Settings saved successfully")
        }, 1000)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and platform configuration.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Appearance Section */}
                <Card className="col-span-full lg:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <CardTitle>Appearance</CardTitle>
                        </div>
                        <CardDescription>Customize how the platform looks for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Theme Mode</Label>
                                <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                            </div>
                            <ThemeToggle />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between opacity-50 pointer-events-none">
                            <div className="space-y-0.5">
                                <Label>Compact Mode</Label>
                                <p className="text-xs text-muted-foreground">Dense UI for more data visibility.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Section */}
                <Card className="col-span-full lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle>Super Admin Profile</CardTitle>
                        </div>
                        <CardDescription>Update your personal information and contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="Super Admin" placeholder="Enter your name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue="admin@morganiz.com" placeholder="admin@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <div className="flex items-center gap-2">
                                <Input id="role" defaultValue="Global Administrator" disabled className="bg-muted" />
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Verified</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Configure how you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="new-orders">New Store Requests</Label>
                            <Switch id="new-orders" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="critical-errors">Critical System Errors</Label>
                            <Switch id="critical-errors" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="marketing">Weekly Summary</Label>
                            <Switch id="marketing" />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>Manage your account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start gap-2">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            Two-Factor Authentication
                        </Button>
                        <div className="pt-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Login History</p>
                            <p className="text-xs text-muted-foreground">Last login: Today at 02:45 AM from Ahmedabad, India</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle>Platform</CardTitle>
                        </div>
                        <CardDescription>Global platform configuration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Global Currency</Label>
                            <Input id="currency" defaultValue="INR (₹)" disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Default Timezone</Label>
                            <Input id="timezone" defaultValue="IST (UTC+5:30)" disabled className="bg-muted" />
                        </div>
                        <p className="text-[10px] text-red-500 font-bold italic">
                            * Global settings require secondary authorization.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
