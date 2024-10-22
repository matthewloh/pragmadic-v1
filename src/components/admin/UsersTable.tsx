"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SelectUser } from "@/lib/db/schema/users"
import { Role } from "@/utils/supabase/permissions"
import { getAllRoles } from "@/utils/supabase/roles"
import useSupabaseBrowser from "@/utils/supabase/client"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Search } from "lucide-react"
import { nanoid } from "@/lib/utils"

interface UsersTableProps {
    initialUsers: SelectUser[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
    const [users, setUsers] = useState<SelectUser[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null)
    const supabase = useSupabaseBrowser()
    const queryClient = useQueryClient()

    const filteredUsers = users.filter(
        (user) =>
            user.display_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const updateUserRoleMutation = useMutation({
        mutationFn: async ({
            userId,
            role,
        }: {
            userId: string
            role: Role
        }) => {
            await supabase
                .from("user_roles")
                .upsert(
                    { id: nanoid(), user_id: userId, role },
                    { onConflict: "user_id" },
                )
        },
    })

    const handleUpdateUserRole = (userId: string, role: Role) => {
        updateUserRoleMutation.mutate({ userId, role })
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
                                    <Select
                                        onValueChange={(value) =>
                                            handleUpdateUserRole(
                                                user.id,
                                                value as Role,
                                            )
                                        }
                                        defaultValue={user.role}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAllRoles().map((role) => (
                                                <SelectItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    )
}
