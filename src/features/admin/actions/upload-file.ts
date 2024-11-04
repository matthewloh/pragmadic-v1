"use server"

import { createClient } from "@/utils/supabase/server"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { redirect } from "next/navigation"
import { embedMany } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/lib/db"
import {
    documents,
    generatePath,
    getPathTokens,
} from "@/lib/db/schema/documents"
import { documentChunks } from "@/lib/db/schema/documents"
import { eq } from "drizzle-orm"
import { extractText, getDocumentProxy } from "unpdf"

export async function generateEmbeddingsForPdfAction(
    fullPath: string,
    folder: string,
    objectId: string,
) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    let document: any = null

    try {
        const fileName = fullPath.split("/").pop() || ""
        const storagePath = fullPath.replace("knowledge_base/", "")

        // 1. Create document record
        const [createdDocument] = await db
            .insert(documents)
            .values({
                name: fileName,
                ownerId: user.id,
                contentType: "pdf",
                status: "processing",
                path: generatePath(folder, fileName),
                pathTokens: getPathTokens(folder),
                parentId: folder,
                objectId: objectId,
                metadata: {
                    originalName: fileName,
                    folder: folder,
                    fullPath: fullPath,
                },
            })
            .returning()

        document = createdDocument

        // 2. Download file from Supabase
        const { data: fileData, error: downloadError } = await supabase.storage
            .from("knowledge_base")
            .download(storagePath)

        if (downloadError || !fileData) {
            throw new Error(
                `Failed to download file: ${downloadError?.message}`,
            )
        }

        // 3. Extract and process PDF content using unpdf
        const arrayBuffer = await fileData.arrayBuffer()
        const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer))

        const { text, totalPages } = await extractText(pdf, {
            mergePages: true,
        })

        if (!text) {
            throw new Error("Failed to extract text from PDF")
        }

        // 4. Split into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        })
        const chunkedContent = await textSplitter.createDocuments([text])

        // 5. Generate embeddings
        const { embeddings } = await embedMany({
            model: openai.embedding("text-embedding-3-small"),
            values: chunkedContent.map((chunk) => chunk.pageContent),
        })

        // 6. Get public URL for reference
        const { data: urlData } = supabase.storage
            .from("knowledge_base")
            .getPublicUrl(storagePath)

        // 7. Insert chunks with embeddings
        await Promise.all(
            chunkedContent.map((chunk, i) =>
                db.insert(documentChunks).values({
                    documentId: document.id,
                    content: chunk.pageContent,
                    embedding: embeddings[i],
                    filePath: storagePath,
                    metadata: {
                        chunkIndex: i,
                        length: chunk.pageContent.length,
                        folder: folder,
                        pageCount: totalPages,
                    },
                }),
            ),
        )

        // 8. Update document status
        await db
            .update(documents)
            .set({
                status: "completed",
                chunkCount: chunkedContent.length,
                processedAt: new Date(),
                body: text,
                title: fileName.replace(".pdf", ""),
                sourceUrl: urlData.publicUrl,
                metadata: {
                    ...document.metadata,
                    pageCount: totalPages,
                },
            })
            .where(eq(documents.id, document.id))

        return { success: true, documentId: document.id }
    } catch (error) {
        console.error("Error processing document:", error)
        if (document?.id && error instanceof Error) {
            await db
                .update(documents)
                .set({
                    status: "failed",
                    metadata: {
                        ...document.metadata,
                        error: error.message,
                    },
                })
                .where(eq(documents.id, document.id))
        }
        throw error
    }
}
