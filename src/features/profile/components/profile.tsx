"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Bell, Lock, DollarSign } from "lucide-react"
import { type User } from "@supabase/supabase-js"
import { SelectProfile } from "@/db/schema"
type ProfileProps = {
    user: User
    profile: SelectProfile
}
export function ProfilePage({ user, profile }: ProfileProps) {
    // const [formData, setFormData] = useState({
    //     fullName: user.user_metadata.full_name,
    //     email: user.email,
    //     occupation: profile.occupation || "",
    //     location: profile.location || "",
    //     bio: profile.bio || "",
    //     visaStatus: profile.visaStatus || "Applied",
    //     notificationsEnabled: profile.notificationsEnabled || false,
    //     language: profile.language || "en",
    //     timezone: profile.timezone || "Asia/Kuala_Lumpur",
    // })

    // const handleInputChange = (e as any) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value })
    // }

    // const handleSelectChange = (name, value) => {
    //     setFormData({ ...formData, [name]: value })
    // }

    // const handleSwitchChange = (checked) => {
    //     setFormData({ ...formData, notificationsEnabled: checked })
    // }

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     // Handle form submission here
    //     console.log("Form submitted:", formData)
    // }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <Avatar className="h-20 w-20">
                    <AvatarImage
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.full_name}
                    />
                    <AvatarFallback>
                        {user.user_metadata.full_name[0]}
                    </AvatarFallback>
                </Avatar>
            </div>
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 gap-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                <form>
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Information</CardTitle>
                                <CardDescription>
                                    Update your basic account information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={user.user_metadata.full_name}
                                            // onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={user.email}
                                            // onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="occupation">
                                            Occupation
                                        </Label>
                                        <Input
                                            id="occupation"
                                            name="occupation"
                                            value={"Test"}
                                            // onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            value={"Test"}
                                            // onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Public Profile</CardTitle>
                                <CardDescription>
                                    Manage your public profile information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={"Test"}
                                        // onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="visaStatus">
                                        Visa Status
                                    </Label>
                                    <Select
                                        value={"Selected"}
                                        // onValueChange={(value) =>
                                        //     handleSelectChange(
                                        //         "visaStatus",
                                        //         value,
                                        //     )
                                        // }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select visa status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Applied">
                                                Applied
                                            </SelectItem>
                                            <SelectItem value="Approved">
                                                Approved
                                            </SelectItem>
                                            <SelectItem value="Expired">
                                                Expired
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Update Profile</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Manage your notification settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="notifications">
                                            Enable Notifications
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive updates about your account
                                            activity.
                                        </p>
                                    </div>
                                    <Switch
                                        id="notifications"
                                        checked={true}
                                        // onCheckedChange={handleSwitchChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">
                                        Preferred Language
                                    </Label>
                                    <Select
                                        value={"England"}
                                        // onValueChange={(value) =>
                                        //     handleSelectChange(
                                        //         "language",
                                        //         value,
                                        //     )
                                        // }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">
                                                English
                                            </SelectItem>
                                            <SelectItem value="ms">
                                                Bahasa Melayu
                                            </SelectItem>
                                            <SelectItem value="zh">
                                                中文
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select
                                        value={"Asia/Kuala_Lumpur"}
                                        // onValueChange={(value) =>
                                        //     handleSelectChange(
                                        //         "timezone",
                                        //         value,
                                        //     )
                                        // }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Kuala_Lumpur">
                                                Asia/Kuala_Lumpur
                                            </SelectItem>
                                            <SelectItem value="Asia/Singapore">
                                                Asia/Singapore
                                            </SelectItem>
                                            <SelectItem value="Asia/Bangkok">
                                                Asia/Bangkok
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Manage your account security.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">
                                        New Password
                                    </Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Update Password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="billing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing Information</CardTitle>
                                <CardDescription>
                                    Manage your billing details and
                                    subscription.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Plan</Label>
                                    <p className="text-sm text-muted-foreground">
                                        DE Rantau Digital Nomad (1 Year)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Next Billing Date</Label>
                                    <p className="text-sm text-muted-foreground">
                                        July 1, 2024
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card">Payment Method</Label>
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="card"
                                            placeholder="**** **** **** 1234"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">
                                    Update Billing Info
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Tabs>
        </div>
    )
}
