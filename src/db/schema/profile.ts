import { relations, sql } from "drizzle-orm"
import {
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { userTable } from "./auth-users"

export const profileTable = pgTable("profile", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => userTable.id)
        .unique(),
    bio: text("bio"),
    occupation: varchar("occupation", { length: 256 }),
    location: varchar("location", { length: 256 }),
    website: text("website"),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const userRelations = relations(userTable, ({ one }) => ({
    profile: one(profileTable, {
        fields: [userTable.id],
        references: [profileTable.userId],
    }),
}))

export const profileRelations = relations(profileTable, ({ one }) => ({
    user: one(userTable, {
        fields: [profileTable.userId],
        references: [userTable.id],
    }),
}))

export type SelectProfile = typeof profileTable.$inferSelect
export type InsertProfile = typeof profileTable.$inferInsert
