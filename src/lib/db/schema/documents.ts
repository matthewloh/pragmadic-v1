import { sql } from "drizzle-orm"
import {
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const documents = pgTable(
    "documents",
    {
        id: uuid("id").defaultRandom().primaryKey().notNull(),
        name: text("name"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        metadata: jsonb("metadata"),

        pathTokens: text("path_tokens").array(),
        // Simple fields matching the trigger
        parentId: text("parent_id"),
        objectId: uuid("object_id"),

        ownerId: uuid("owner_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        tag: text("tag"),
        title: text("title"),
        body: text("body"),
    },
    (table) => ({
        searchIndex: index("documents_search_idx").using(
            "gin",
            sql`(
                    setweight(to_tsvector('english', COALESCE(${table.title}, '')),'A') ||
                    setweight(to_tsvector('english', COALESCE(${table.body}, '')),'B')
                )`,
        ),
        pathIdx: index("documents_path_tokens_idx").on(table.pathTokens),
        parentIdx: index("documents_parent_idx").on(table.parentId),
    }),
)
export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
// Helper function to generate path
export const generatePath = (parentPath: string | null, name: string) => {
    return parentPath ? `${parentPath}/${name}` : `/${name}`
}

// Helper function to get path tokens
export const getPathTokens = (path: string) => {
    return path.split("/").filter(Boolean)
}

// Helper function to get depth
export const getDepth = (path: string) => {
    return getPathTokens(path).length
}

// Example usage:
/*
// Create root folder
const root = {
    name: 'root',
    type: 'root',
    path: '/',
    pathTokens: [],
    depth: 0
}

// Create folder
const folder = {
    name: 'documents',
    type: 'folder',
    parentId: root.id,
    path: '/documents',
    pathTokens: ['documents'],
    depth: 1
}

// Create file
const file = {
    name: 'report.pdf',
    type: 'file',
    parentId: folder.id,
    path: '/documents/report.pdf',
    pathTokens: ['documents', 'report.pdf'],
    depth: 2
}
*/
