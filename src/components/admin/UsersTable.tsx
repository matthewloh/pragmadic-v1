"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { updateUserRolesAction } from "@/features/admin/actions/users"
import { RoleType } from "@/lib/auth/get-user-role"
import useSupabaseBrowser from "@/utils/supabase/client"
import { Role } from "@/utils/supabase/permissions"
import { getAllRoles } from "@/utils/supabase/roles"
import {
    useInsertMutation,
    useUpdateMutation,
    useUpsertMutation,
    useDeleteMutation,
} from "@supabase-cache-helpers/postgrest-react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface User {
    id: string
    email: string
    display_name: string | null
    roles: Role[]
    created_at?: string
}

interface UsersTableProps {
    initialUsers: User[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const supabase = useSupabaseBrowser()
    const queryClient = useQueryClient()

    const filteredUsers = users.filter(
        (user) =>
            user.display_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const updateUserRolesMutation = useMutation({
        mutationFn: async ({
            userId,
            roles,
        }: {
            userId: string
            roles: RoleType[]
        }) => {
            await updateUserRolesAction(userId, roles)
        },
        onSuccess: (_, variables) => {
            toast.success("User roles updated successfully")
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === variables.userId
                        ? { ...user, roles: variables.roles }
                        : user,
                ),
            )
        },
        onError: (error) => {
            toast.error(`Error updating user roles: ${error.message}`)
        },
    })

    const handleRoleToggle = (
        userId: string,
        role: Role,
        currentRoles: Role[],
    ) => {
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter((r) => r !== role)
            : [...currentRoles, role]

        updateUserRolesMutation.mutate({ userId, roles: newRoles })
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">User Management</h2>
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
                            <TableHead>Roles</TableHead>
                            <TableHead>Created At</TableHead>
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
                                    <div className="flex flex-col gap-2">
                                        {getAllRoles().map((role) => (
                                            <div
                                                key={role}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`${user.id}-${role}`}
                                                    checked={user.roles.includes(
                                                        role,
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleRoleToggle(
                                                            user.id,
                                                            role,
                                                            user.roles,
                                                        )
                                                    }
                                                    disabled={
                                                        updateUserRolesMutation.isPending
                                                    }
                                                />
                                                <label
                                                    htmlFor={`${user.id}-${role}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {role}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.created_at
                                        ? new Date(
                                              user.created_at,
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    )
}
