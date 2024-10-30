import { pgTable, text, real } from "drizzle-orm/pg-core"

export const documentChunks = pgTable("document_chunks", {
    id: text("id").primaryKey().notNull(),
    filePath: text("filePath").notNull(),
    content: text("content").notNull(),
    embedding: real("embedding").array().notNull(),
})
