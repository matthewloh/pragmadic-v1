import { db } from "@/lib/db"
import { documentChunks } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"

export async function getChunksByFilePaths({
    filePaths,
}: {
    filePaths: string[]
}) {
    return await db
        .select()
        .from(documentChunks)
        .where(inArray(documentChunks.filePath, filePaths))
}

export async function getChunksByDocumentIds({
    documentIds,
}: {
    documentIds: string[]
}) {
    return await db
        .select()
        .from(documentChunks)
        .where(inArray(documentChunks.documentId, documentIds))
}
