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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/db"
import { profileTable } from "@/lib/db/schema"
import { ProfilePage } from "@/features/profile/components/profile"
import { createClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { Profiler } from "react"
import { getSession } from "../../../../../../supabase/queries/cached-queries"

type UserProfile = {
    id: string
    updatedAt: Date | null
    userId: string
    bio: string | null
    occupation: string | null
    location: string | null
    website: string | null
}

export default async function Profile({
    params,
}: {
    params: { userId: string }
}) {
    const {
        data: { session },
    } = await getSession()

    const user = session?.user

    if (!user) {
        throw new Error("User not found")
    }

    const data = await db?.query.profileTable.findFirst({
        where: eq(profileTable.userId, user!.id),
    })
    if (!data) {
        throw new Error("Profile not found")
    }
    // const [user, setUser] = useState({
    //     name: "Sarah Johnson",
    //     email: "sarah.johnson@example.com",
    //     avatar: "https://i.pravatar.cc/150?u=sarah.johnson@example.com",
    //     occupation: "UX Designer",
    //     location: "Penang, Malaysia",
    //     bio: "Digital nomad passionate about creating user-centric designs and exploring new cultures.",
    //     visaStatus: "Approved",
    //     notificationsEnabled: true,
    //     language: "en",
    //     timezone: "Asia/Kuala_Lumpur",
    // })

    // const handleInputChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    // ) => {
    //     setUser({ ...user, [e.target.name]: e.target.value })
    // }

    // const handleSwitchChange = (checked: boolean) => {
    //     setUser({ ...user, notificationsEnabled: checked })
    // }

    // const handleSelectChange = (name: string, value: string) => {
    //     setUser({ ...user, [name]: value })

    return (
        <ProfilePage user={user} profile={data} />
        // <div className="mx-auto py-8">
        //     <SidebarTrigger />
        //     <div className="mb-8 flex items-center justify-between">
        //         <h1 className="text-3xl font-bold">Account Settings</h1>
        //         <Avatar className="h-20 w-20">
        //             <AvatarImage
        //                 src={user?.user_metadata.avatar_url}
        //                 alt={user?.user_metadata.full_name}
        //             />
        //             <AvatarFallback>
        //                 {user.user_metadata.full_name}
        //             </AvatarFallback>
        //         </Avatar>
        //     </div>
        //     <Tabs defaultValue="general" className="space-y-4">
        //         <TabsList>
        //             <TabsTrigger value="general">General</TabsTrigger>
        //             <TabsTrigger value="profile">Profile</TabsTrigger>
        //             <TabsTrigger value="notifications">
        //                 Notifications
        //             </TabsTrigger>
        //             <TabsTrigger value="security">Security</TabsTrigger>
        //             <TabsTrigger value="billing">Billing</TabsTrigger>
        //         </TabsList>
        //         <TabsContent value="general">
        //             <Card>
        //                 <CardHeader>
        //                     <CardTitle>General Information</CardTitle>
        //                     <CardDescription>
        //                         Update your basic account information.
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="name">Full Name</Label>
        //                         <Input
        //                             id="name"
        //                             name="name"
        //                             value={user.user_metadata.full_name}
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="email">Email</Label>
        //                         <Input
        //                             id="email"
        //                             name="email"
        //                             type="email"
        //                             value={user.email}
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="occupation">Occupation</Label>
        //                         <Input
        //                             id="occupation"
        //                             name="occupation"
        //                             value={data.occupation as string}
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="location">Location</Label>
        //                         <Input
        //                             id="location"
        //                             name="location"
        //                             value={data.location as string}
        //                         />
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button>Save Changes</Button>
        //                 </CardFooter>
        //             </Card>
        //         </TabsContent>
        //         <TabsContent value="profile">
        //             <Card>
        //                 <CardHeader>
        //                     <CardTitle>Public Profile</CardTitle>
        //                     <CardDescription>
        //                         Manage your public profile information.
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="bio">Bio</Label>
        //                         <Textarea
        //                             id="bio"
        //                             name="bio"
        //                             value={data.bio as string}
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="visaStatus">Visa Status</Label>
        //                         <Select value={"Test"}>
        //                             <SelectTrigger>
        //                                 <SelectValue placeholder="Select visa status" />
        //                             </SelectTrigger>
        //                             <SelectContent>
        //                                 <SelectItem value="Applied">
        //                                     Applied
        //                                 </SelectItem>
        //                                 <SelectItem value="Approved">
        //                                     Approved
        //                                 </SelectItem>
        //                                 <SelectItem value="Expired">
        //                                     Expired
        //                                 </SelectItem>
        //                             </SelectContent>
        //                         </Select>
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button>Update Profile</Button>
        //                 </CardFooter>
        //             </Card>
        //         </TabsContent>
        //         <TabsContent value="notifications">
        //             {/* <Card>
        //                 <CardHeader>
        //                     <CardTitle>Notification Preferences</CardTitle>
        //                     <CardDescription>
        //                         Manage your notification settings.
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent className="space-y-4">
        //                     <div className="flex items-center justify-between">
        //                         <Label htmlFor="notifications">
        //                             Enable Notifications
        //                         </Label>
        //                         <Switch
        //                             id="notifications"
        //                             checked={user.notificationsEnabled}
        //                             onCheckedChange={handleSwitchChange}
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="language">
        //                             Preferred Language
        //                         </Label>
        //                         <Select
        //                             value={user.language}
        //                             onValueChange={(value) =>
        //                                 handleSelectChange("language", value)
        //                             }
        //                         >
        //                             <SelectTrigger>
        //                                 <SelectValue placeholder="Select language" />
        //                             </SelectTrigger>
        //                             <SelectContent>
        //                                 <SelectItem value="en">
        //                                     English
        //                                 </SelectItem>
        //                                 <SelectItem value="ms">
        //                                     Bahasa Melayu
        //                                 </SelectItem>
        //                                 <SelectItem value="zh">中文</SelectItem>
        //                             </SelectContent>
        //                         </Select>
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="timezone">Timezone</Label>
        //                         <Select
        //                             value={user.timezone}
        //                             onValueChange={(value) =>
        //                                 handleSelectChange("timezone", value)
        //                             }
        //                         >
        //                             <SelectTrigger>
        //                                 <SelectValue placeholder="Select timezone" />
        //                             </SelectTrigger>
        //                             <SelectContent>
        //                                 <SelectItem value="Asia/Kuala_Lumpur">
        //                                     Asia/Kuala_Lumpur
        //                                 </SelectItem>
        //                                 <SelectItem value="Asia/Singapore">
        //                                     Asia/Singapore
        //                                 </SelectItem>
        //                                 <SelectItem value="Asia/Bangkok">
        //                                     Asia/Bangkok
        //                                 </SelectItem>
        //                             </SelectContent>
        //                         </Select>
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button>Save Preferences</Button>
        //                 </CardFooter>
        //             </Card> */}
        //         </TabsContent>
        //         <TabsContent value="security">
        //             {/* <Card>
        //                 <CardHeader>
        //                     <CardTitle>Security Settings</CardTitle>
        //                     <CardDescription>
        //                         Manage your account security.
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="current-password">
        //                             Current Password
        //                         </Label>
        //                         <Input id="current-password" type="password" />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="new-password">
        //                             New Password
        //                         </Label>
        //                         <Input id="new-password" type="password" />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="confirm-password">
        //                             Confirm New Password
        //                         </Label>
        //                         <Input id="confirm-password" type="password" />
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button>Update Password</Button>
        //                 </CardFooter>
        //             </Card> */}
        //         </TabsContent>
        //         <TabsContent value="billing">
        //             {/* <Card>
        //                 <CardHeader>
        //                     <CardTitle>Billing Information</CardTitle>
        //                     <CardDescription>
        //                         Manage your billing details and subscription.
        //                     </CardDescription>
        //                 </CardHeader>
        //                 <CardContent className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label>Current Plan</Label>
        //                         <p className="text-sm text-muted-foreground">
        //                             DE Rantau Digital Nomad (1 Year)
        //                         </p>
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label>Next Billing Date</Label>
        //                         <p className="text-sm text-muted-foreground">
        //                             July 1, 2024
        //                         </p>
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="card">Payment Method</Label>
        //                         <Input
        //                             id="card"
        //                             placeholder="**** **** **** 1234"
        //                             icon={CreditCard}
        //                         />
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button>Update Billing Info</Button>
        //                 </CardFooter>
        //             </Card> */}
        //         </TabsContent>
        //     </Tabs>
        // </div>
    )
}
