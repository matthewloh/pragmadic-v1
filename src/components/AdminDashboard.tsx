"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { getUserRolesQuery } from "@/lib/api/users/client_queries"
import { SelectUser } from "@/lib/db/schema/users"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { ArrowUpRight, BarChart3, MapPin, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

interface AdminDashboardProps {
    initialUsers: SelectUser[]
}

export function AdminDashboard({ initialUsers }: AdminDashboardProps) {
    const [users, setUsers] = useState<SelectUser[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const supabase = useSupabaseBrowser()
    // const { data: userRoles, refetch } = useQuery(getUserRolesQuery(supabase))

    const filteredUsers = users.filter(
        (user) =>
            user.display_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="container relative flex h-full flex-grow overflow-hidden">
            <div className="container py-6">
                <div className="flex flex-col space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {users.length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +2.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Regions
                                </CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">
                                    +1 new region this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Visa Applications
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">
                                    +201 since last week
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Hubs
                                </CardTitle>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24</div>
                                <p className="text-xs text-muted-foreground">
                                    +3 new hubs this quarter
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="users" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="users">Users</TabsTrigger>
                            <TabsTrigger value="roles">
                                System Role Management
                            </TabsTrigger>
                            <TabsTrigger value="info">
                                Additional Info
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="users" className="space-y-4">
                            <div className="rounded-md border">
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
                                                <TableCell>
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            user.role ===
                                                            "admin"
                                                                ? "destructive"
                                                                : "default"
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>
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
                            </div>
                        </TabsContent>
                        {/* <TabsContent value="roles">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manage System Roles</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                refetch()
                                            }}
                                        >
                                            Refresh
                                        </Button>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {userRoles?.map((userRole) => (
                                                    <TableRow key={userRole.id}>
                                                        <TableCell>
                                                            {userRole.role}
                                                        </TableCell>
                                                        <TableCell>
                                                            {userRole?.user
                                                                ?.display_name ||
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
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent> */}
                        <TabsContent value="info">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Additional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Additional information and statistics to
                                        be added here.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
