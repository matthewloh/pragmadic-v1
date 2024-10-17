"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectUser } from "@/lib/db/schema/users"
import useSupabaseBrowser from "@/utils/supabase/client"
import { UserRole } from "@/utils/supabase/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowUpRight, BarChart3, MapPin, Search, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
interface AdminDashboardProps {
    initialUsers: SelectUser[]
}

export function AdminDashboard({ initialUsers }: AdminDashboardProps) {
    const [users, setUsers] = useState<SelectUser[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null)
    const supabase = useSupabaseBrowser()
    const queryClient = useQueryClient()

    const {
        data: userRoles,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["userRoles"],
        queryFn: async () => {
            const { data, error } = await supabase.from("user_roles").select(`
                id,
                role,
                user(id, display_name, email)
            `)
            if (error) throw error
            return data
        },
    })

    const updateUserMutation = useMutation({
        mutationFn: async (updatedUser: Partial<SelectUser>) => {
            const { data, error } = await supabase
                .from("user")
                .update({
                    display_name: updatedUser.display_name,
                    role: updatedUser.role,
                    // Use 'created_at' instead of 'createdAt' if you need to update this field
                    // created_at: updatedUser.created_at,
                })
                .eq("id", updatedUser.id as string)
                .select()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userRoles"] })
            toast.success("User updated successfully")
        },
        onError: (error) => {
            toast.error("Error updating user", {
                description: error.message,
            })
        },
    })

    const filteredUsers = users.filter(
        (user) =>
            user.display_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const statsCards = [
        {
            title: "Total Users",
            value: users.length,
            icon: Users,
            change: "+2.1% from last month",
        },
        {
            title: "Active Regions",
            value: 12,
            icon: MapPin,
            change: "+1 new region this month",
        },
        {
            title: "Visa Applications",
            value: 573,
            icon: BarChart3,
            change: "+201 since last week",
        },
        {
            title: "Active Hubs",
            value: 24,
            icon: ArrowUpRight,
            change: "+3 new hubs this quarter",
        },
    ]

    const handleUpdateUser = (updatedUser: Partial<SelectUser>) => {
        updateUserMutation.mutate(updatedUser)
    }

    return (
        <div className="container mx-auto space-y-8 py-6">
            <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

            {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {card.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {card.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div> */}

            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 rounded-md bg-card text-card-foreground">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="roles">System Roles</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="upload">
                        Manage Knowledge Base
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            User Management
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.display_name || "N/A"}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.role === "admin"
                                                        ? "destructive"
                                                        : "default"
                                                }
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Edit User
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label
                                                                htmlFor="name"
                                                                className="text-right"
                                                            >
                                                                Name
                                                            </label>
                                                            <Input
                                                                id="name"
                                                                value={
                                                                    selectedUser?.display_name ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedUser(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev!,
                                                                            display_name:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }),
                                                                    )
                                                                }
                                                                className="col-span-3"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label
                                                                htmlFor="role"
                                                                className="text-right"
                                                            >
                                                                Role
                                                            </label>
                                                            <Select
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    setSelectedUser(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev!,

                                                                            role: value as UserRole,
                                                                        }),
                                                                    )
                                                                }
                                                                defaultValue={
                                                                    selectedUser?.role
                                                                }
                                                            >
                                                                <SelectTrigger className="col-span-3">
                                                                    <SelectValue placeholder="Select a role" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="regular">
                                                                        Regular
                                                                    </SelectItem>
                                                                    <SelectItem value="owner">
                                                                        Owner
                                                                    </SelectItem>
                                                                    <SelectItem value="admin">
                                                                        Admin
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            handleUpdateUser(
                                                                selectedUser!,
                                                            )
                                                        }
                                                    >
                                                        Save changes
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="roles">
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Manage System Roles</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                            >
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Role</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userRoles?.map((userRole) => (
                                        <TableRow key={userRole.id}>
                                            <TableCell>
                                                {userRole.role}
                                            </TableCell>
                                            <TableCell>
                                                {userRole?.user?.display_name ||
                                                    "Unknown User"}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Implement permission management here based on
                                the userAppPermissions enum.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
