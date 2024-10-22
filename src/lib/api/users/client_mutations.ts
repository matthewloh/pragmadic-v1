import { Client } from "@/utils/supabase/types"
import { Permission, Role } from "./client_queries"

type UpdateRolePermissionsParams = {
    role: Role
    permissions: Permission[]
}

export function updateRolePermissionsMutation(client: Client) {
    return client.from("role_permissions").upsert
}
