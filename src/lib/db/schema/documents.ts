import { sql } from "drizzle-orm"
import {
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    integer,
    vector,
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const documents = pgTable(
    "documents",
    {
        id: uuid("id").defaultRandom().primaryKey().notNull(),
        name: text("name").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        metadata: jsonb("metadata"), // mime type, file size, etc

        pathTokens: text("path_tokens").array(), // []
        path: text("path"), // de_rantau_visa/visa_information
        parentId: text("parent_id"), // de_rantau_visa, de_rantau_hub ... etc
        objectId: uuid("object_id"),

        ownerId: uuid("owner_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        title: text("title"),
        body: text("body"),

        contentType: varchar("content_type", { length: 50 }), // web? pdf?
        sourceUrl: text("source_url"),
        chunkCount: integer("chunk_count").default(0),
        processedAt: timestamp("processed_at", { withTimezone: true }),
        status: varchar("status", { length: 20 }).default("pending"),
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
        statusIdx: index("documents_status_idx").on(table.status),
    }),
)

export const documentChunks = pgTable(
    "document_chunks",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        documentId: uuid("document_id")
            .notNull()
            .references(() => documents.id, { onDelete: "cascade" }),
        filePath: text("file_path").notNull(),
        content: text("content").notNull(),
        embedding: vector("embedding", { dimensions: 1536 }).notNull(),
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        embeddingIdx: index("chunks_embedding_idx").using(
            "hnsw",
            sql`${table.embedding} vector_cosine_ops`,
        ),
        documentIdx: index("chunks_document_idx").on(table.documentId),
    }),
)

export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
export type DocumentChunk = typeof documentChunks.$inferSelect
export type NewDocumentChunk = typeof documentChunks.$inferInsert

export const generatePath = (parentPath: string | null, name: string) => {
    return parentPath ? `${parentPath}/${name}` : `/${name}`
}

export const getPathTokens = (path: string) => {
    return path.split("/").filter(Boolean)
}

export const getDepth = (path: string) => {
    return getPathTokens(path).length
}
