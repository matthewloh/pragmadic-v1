import { Client, Database } from "@/utils/supabase/types"

export function getUserRolesQuery(client: Client) {
    return client.from("user_roles").select(
        `
          id,
          role,
          user(display_name)
      `,
    )
}
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"]

export type Permission = Database["public"]["Enums"]["user_app_permissions"]
export type Role = Database["public"]["Enums"]["user_role"]

export type RolePermissions =
    Database["public"]["Tables"]["role_permissions"]["Row"]

export function getAllRolePermissionsQuery(client: Client) {
    return client.from("role_permissions").select("*")
}
