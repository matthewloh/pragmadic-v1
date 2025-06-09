import { getChunksByDocumentIds } from "@/features/chat/queries"
import { openai } from "@ai-sdk/openai"
import {
    cosineSimilarity,
    embed,
    Experimental_LanguageModelV1Middleware,
    generateObject,
    generateText,
} from "ai"
import { z } from "zod"
import { getUserAuth } from "../auth/utils"

// schema for validating the custom provider metadata
const selectionSchema = z.object({
    chatId: z.string(),
    documents: z.object({ selection: z.array(z.string()) }),
})

export const ragMiddleware: Experimental_LanguageModelV1Middleware = {
    transformParams: async ({ params }) => {
        const { session } = await getUserAuth()
        if (!session) return params
        console.log("params", params)
        const { prompt: messages, providerMetadata } = params

        // validate the provider metadata with Zod:
        const result = selectionSchema.safeParse(providerMetadata)
        if (!result.success) {
            console.warn(
                "[RAG_METRICS] RAG middleware: providerMetadata parsing failed or chatId missing. Skipping RAG.",
                result.error.issues,
            )
            return params
        }

        const selectedDocumentIds = result.data.documents.selection
        const currentChatId = result.data.chatId

        if (selectedDocumentIds.length === 0) {
            console.log(
                "[RAG_METRICS] ChatID:",
                currentChatId,
                "- No documents selected. Skipping RAG.",
            )
            return params
        }

        const recentMessage = messages.pop()
        if (!recentMessage || recentMessage.role !== "user") {
            if (recentMessage) messages.push(recentMessage)
            return params
        }

        const lastUserMessageContent = recentMessage.content
            .filter((content) => content.type === "text")
            .map((content) => content.text)
            .join("\n")

        // Log the query context for correlation
        console.log(
            `[RAG_METRICS] ChatID: ${currentChatId} - Processing query. User Message Snippet: ${lastUserMessageContent.substring(0, 100)}...`,
        )

        // Classify the user prompt
        const { object: classification } = await generateObject({
            model: openai("gpt-4o-mini", { structuredOutputs: true }),
            output: "enum",
            enum: ["question", "statement", "other"],
            system: "classify the user message as a question, statement, or other",
            prompt: lastUserMessageContent,
        })

        console.log("classification", classification)

        // only use RAG for questions
        if (classification !== "question") {
            messages.push(recentMessage)
            console.log(
                `[RAG_METRICS] ChatID: ${currentChatId} - Message classified as '${classification}'. Skipping RAG.`,
            )
            return params
        }

        // Generate hypothetical answer
        const { text: hypotheticalAnswer } = await generateText({
            model: openai("gpt-4o-mini", { structuredOutputs: true }),
            system: "Answer the users question:",
            prompt: lastUserMessageContent,
        })
        console.log("hypotheticalAnswer", hypotheticalAnswer)
        // Embed the hypothetical answer
        const { embedding: hypotheticalAnswerEmbedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: hypotheticalAnswer,
        })

        // Get document chunks from Supabase
        const chunksBySelection = await getChunksByDocumentIds({
            documentIds: selectedDocumentIds,
        })

        if (!chunksBySelection) {
            messages.push(recentMessage)
            return params
        }

        // Calculate similarities and rank chunks
        const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
            ...chunk,
            similarity: cosineSimilarity(
                hypotheticalAnswerEmbedding,
                chunk.embedding,
            ),
        }))

        // Sort by similarity and take top K chunks
        chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity)
        const k = 10
        const topKChunks = chunksWithSimilarity.slice(0, k)

        // Log retrieved chunks
        const retrievedChunkInfo = topKChunks.map((chunk) => ({
            // Assuming your chunk object from DB has these fields. Adjust as necessary.
            chunkId: chunk.id, // This should be the unique ID of the chunk from documentChunks table
            sourceDocumentId: chunk.documentId, // The ID of the parent document
            filePath: chunk.filePath, // The path of the source file, if applicable
            similarity: chunk.similarity,
            // Optionally, log a snippet of the content to verify relevance quickly
            // contentSnippet: chunk.content ? chunk.content.substring(0, 100) + "..." : "N/A"
        }))
        console.log(
            `[RAG_METRICS] ChatID: ${currentChatId} - Retrieved Chunks:`,
            JSON.stringify(retrievedChunkInfo),
        )

        // Store chunk info for benchmark tests
        if (currentChatId.startsWith("bench-")) {
            try {
                const { kv } = await import("@vercel/kv")
                await kv.set(`chunks:${currentChatId}`, retrievedChunkInfo, { ex: 300 });
            } catch (error) {
                console.warn("Failed to store chunk data:", error);
            }
        }

        // Add context to the message
        messages.push({
            role: "user",
            content: [
                ...recentMessage.content,
                {
                    type: "text",
                    text: "\nRelevant context from selected documents:",
                },
                ...topKChunks.map((chunk) => ({
                    type: "text" as const,
                    text: chunk.content,
                })),
            ],
        })

        return { ...params, prompt: messages }
    },
}
