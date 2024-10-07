import type { SupabaseClient } from "@supabase/supabase-js"
import { Database, Tables, Enums } from "../types/db"

export type Client = SupabaseClient<Database>

export type UserRoleRow = Tables<"user_roles">

export type InviteRoleEnum = Enums<"invite_role_type">

export type InviteStatus = Enums<"invite_status">

export type UserAppPermissions = Enums<"user_app_permissions">

export type UserCommunityPermissions = Enums<"user_community_permissions">

export type UserRole = Enums<"user_role">

export * from "../types/db"
