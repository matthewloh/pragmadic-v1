"use client"

import { useState, useEffect } from "react"
import { Role, Permission } from "@/utils/supabase/permissions"
import { getAllRoles, getAllPermissions } from "@/utils/supabase/roles"
import useSupabaseBrowser from "@/utils/supabase/client"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { nanoid } from "@/lib/utils"

type RolePermissions = Record<Role, Permission[]>

export function RolePermissionsTable() {
    const supabase = useSupabaseBrowser()
    const allRoles = getAllRoles()
    const allPermissions = getAllPermissions()

    const [localPermissions, setLocalPermissions] = useState<RolePermissions>(
        () => {
            return allRoles.reduce((acc, role) => {
                acc[role] = []
                return acc
            }, {} as RolePermissions)
        },
    )

    const fetchRolePermissions = async (): Promise<RolePermissions> => {
        const { data, error } = await supabase
            .from("role_permissions")
            .select("role, permission")

        if (error) throw error

        return allRoles.reduce((acc, role) => {
            acc[role] = data
                .filter((rp) => rp.role === role)
                .map((rp) => rp.permission as Permission)
            return acc
        }, {} as RolePermissions)
    }

    const {
        data: rolePermissions,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["rolePermissions"],
        queryFn: fetchRolePermissions,
    })

    useEffect(() => {
        if (rolePermissions) {
            setLocalPermissions(rolePermissions)
        }
    }, [rolePermissions])

    const updateRolePermissionsMutation = useMutation({
        mutationFn: async ({
            role,
            permissions,
        }: {
            role: Role
            permissions: Permission[]
        }) => {
            // Delete existing permissions for the role
            await supabase.from("role_permissions").delete().eq("role", role)

            // Insert new permissions with unique IDs
            const { error } = await supabase.from("role_permissions").insert(
                permissions.map((permission) => ({
                    id: nanoid(), // Generate a unique ID for each permission
                    role,
                    permission,
                })),
            )

            if (error) throw error
        },
        onSuccess: (_, variables) => {
            setLocalPermissions((prev) => ({
                ...prev,
                [variables.role]: variables.permissions,
            }))
            toast.success(`Permissions updated for ${variables.role}`)
        },
        onError: (error) => {
            toast.error("Failed to update permissions", {
                description: error.message,
            })
        },
    })

    const handlePermissionChange = (
        role: Role,
        permission: Permission,
        isChecked: boolean,
    ) => {
        const updatedPermissions = isChecked
            ? [...localPermissions[role], permission]
            : localPermissions[role].filter((p) => p !== permission)

        updateRolePermissionsMutation.mutate({
            role,
            permissions: updatedPermissions,
        })
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                Error loading role permissions: {error.message}
            </div>
        )
    }

    return (
        <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">
                Role and Permission Management
            </h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(localPermissions).map(
                        ([role, permissions]) => (
                            <TableRow key={role}>
                                <TableCell>{role}</TableCell>
                                <TableCell>
                                    {permissions.join(", ") ||
                                        "No permissions set"}
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Edit Permissions
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Edit Permissions for {role}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                {allPermissions.map(
                                                    (permission) => (
                                                        <label
                                                            key={permission}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                checked={localPermissions[
                                                                    role as Role
                                                                ].includes(
                                                                    permission,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) => {
                                                                    handlePermissionChange(
                                                                        role as Role,
                                                                        permission,
                                                                        checked as boolean,
                                                                    )
                                                                }}
                                                                id={`${role}-${permission}`}
                                                            />
                                                            <span>
                                                                {permission}
                                                            </span>
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
