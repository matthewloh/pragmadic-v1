"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import {
    ArrowUpRight,
    BarChart3,
    MapPin,
    Moon,
    Search,
    Sun,
    Users,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { SidebarTrigger } from "./ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"

interface AdminDashboardProps {
    initialUsers: SelectUser[]
}

export function AdminDashboard({ initialUsers }: AdminDashboardProps) {
    const [users, setUsers] = useState<SelectUser[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const { theme, setTheme } = useTheme()

    const filteredUsers = users.filter(
        (user) =>
            user.display_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="flex h-[60px] items-center justify-between">
                    <MainNavBar />
                </div>
            </header>

            <main className="container py-6">
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
                            <TabsTrigger value="regions">Regions</TabsTrigger>
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
                        <TabsContent value="regions">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Regions Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Region management functionality to be
                                        implemented.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
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
            </main>
        </div>
    )
}
