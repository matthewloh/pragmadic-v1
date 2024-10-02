import { nanoid } from "@/lib/utils"
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

const authSchema = pgSchema("auth")

export const userRoleEnum = pgEnum("user_role", ["regular", "owner", "admin"])

export const userAppPermissions = pgEnum("user_app_permissions", [
    "hubs.create",
    "hubs.delete",
    "hubs.posts.create",
    "communities.posts.create",
])

export const authUsers = authSchema.table("users", {
    id: uuid("id").primaryKey(),
})

export const users = pgTable("user", {
    createdAt: timestamp("created_at").defaultNow(),
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey()
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").unique().notNull(),
    display_name: varchar("display_name", { length: 256 }),
    image_url: text("image_url"),
    role: userRoleEnum("role").default("regular").notNull(),
})

export const userRoles = pgTable(
    "user_roles",
    {
        id: varchar("id", { length: 191 })
            .primaryKey()
            .$defaultFn(() => nanoid()),
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
