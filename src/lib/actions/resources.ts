"use server"

import {
    NewResourceParams,
    insertResourceSchema,
    resources,
} from "@/lib/db/schema/resources"
import { db } from "@/lib/db"
import { generateEmbeddings } from "@/lib/ai/embeddings"
import { embeddings as embeddingsTable } from "@/lib/db/schema/embeddings"

export const createResource = async (input: NewResourceParams) => {
    try {
        const payload = insertResourceSchema.parse(input)

        const contentWithoutLineBreaks = payload.content.replace("\n", " ")
        const [resource] = await db
            .insert(resources)
            .values({ content: contentWithoutLineBreaks })
            .returning()

        const embeddings = await generateEmbeddings(payload.content)
        await db.insert(embeddingsTable).values(
            embeddings.map((embedding) => ({
                resourceId: resource.id,
                ...embedding,
            })),
        )

        return "Resource successfully created and embeddings generated."
    } catch (e) {
        if (e instanceof Error)
            return e.message.length > 0 ? e.message : "Error, please try again."
    }
}
