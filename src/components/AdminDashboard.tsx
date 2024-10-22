"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/UsersTable"
import { RolePermissionsTable } from "@/components/admin/RolePermissionsTable"
import { SelectUser } from "@/lib/db/schema/users"

interface AdminDashboardProps {
    initialUsers: SelectUser[]
}

export function AdminDashboard({ initialUsers }: AdminDashboardProps) {
    return (
        <div className="container mx-auto space-y-8 py-6">
            <h1 className="mb-6 text-3xl font-bold text-card-foreground">
                Admin Dashboard
            </h1>

            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 rounded-md bg-card text-card-foreground">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="roles_permissions">Roles & Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <UsersTable initialUsers={initialUsers} />
                </TabsContent>

                <TabsContent value="roles_permissions" className="space-y-4">
                    <RolePermissionsTable />
                </TabsContent>
            </Tabs>
        </div>
    )
}
