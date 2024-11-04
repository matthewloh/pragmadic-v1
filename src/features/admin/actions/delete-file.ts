"use server"

import { db } from "@/lib/db"
import { documents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function deleteDocumentAction(objectId: string) {
    try {
        await db.delete(documents).where(eq(documents.objectId, objectId))
    } catch (error) {
        console.error("Error deleting document:", error)
        throw new Error("Failed to delete document record")
    }
}
