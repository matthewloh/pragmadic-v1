import { RoleType } from "@/lib/auth/get-user-role"
import { nanoid } from "@/lib/utils"
import { Permission, PERMISSIONS, ROLES } from "@/utils/supabase/permissions"
import { sql } from "drizzle-orm"
import {
    pgEnum,
    pgSchema,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

const authSchema = pgSchema("auth")

export const userRoleEnum = pgEnum(
    "user_role",
    Object.values(ROLES) as [string, ...string[]],
)

export const userAppPermissions = pgEnum(
    "user_app_permissions",
    Object.values(PERMISSIONS) as [string, ...string[]],
)

export const authUsers = authSchema.table("users", {
    id: uuid("id").primaryKey(),
})

export const users = pgTable("users", {
    createdAt: timestamp("created_at").defaultNow(),
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey()
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").unique().notNull(),
    display_name: varchar("display_name", { length: 256 }),
    image_url: text("image_url"),
    role: userRoleEnum("roles")
        .array()
        .notNull()
        .default(sql`ARRAY['regular']::"user_role"[]`), // can't use double quotes in default value
})

export const userRoles = pgTable(
    "user_roles",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        role: userRoleEnum("role").notNull(),
    },
    (t) => ({
        unq: unique().on(t.userId, t.role),
    }),
)

export const rolePermissions = pgTable(
    "role_permissions",
    {
        id: varchar("id", { length: 191 })
            .primaryKey()
            .$defaultFn(() => nanoid()),
        role: userRoleEnum("role").notNull(),
        permission: userAppPermissions("permission").notNull(),
    },
    (t) => ({
        unq: unique().on(t.role, t.permission),
    }),
)

export type SelectUser = typeof users.$inferSelect

// New type for user with roles and permissions
export type UserWithRolesAndPermissions = SelectUser & {
    roles: RoleType[]
    permissions: Permission[]
}
export const userIdSchema = createSelectSchema(users).pick({ id: true })
export type UserId = z.infer<typeof userIdSchema>["id"]

export type UsersWithInviteStatus = {
    id: string
    createdAt: Date
    email: string
    display_name: string | null
    image_url: string | null
    invite_status: "pending" | "accepted" | "rejected" | null
    invite_role_type: "admin" | "member" | null
    hub_id: string
}
