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
    documents: z.object({
        selection: z.array(z.string()),
    }),
})

export const ragMiddleware: Experimental_LanguageModelV1Middleware = {
    transformParams: async ({ params }) => {
        const { session } = await getUserAuth()
        if (!session) return params
        console.log("params", params)
        const { prompt: messages, providerMetadata } = params

        // validate the provider metadata with Zod:
        const { success, data } = selectionSchema.safeParse(providerMetadata)
        if (!success) return params // no documents selected

        const selectedDocumentIds = data.documents.selection
        if (selectedDocumentIds.length === 0) return params

        const recentMessage = messages.pop()
        if (!recentMessage || recentMessage.role !== "user") {
            if (recentMessage) messages.push(recentMessage)
            return params
        }

        const lastUserMessageContent = recentMessage.content
            .filter((content) => content.type === "text")
            .map((content) => content.text)
            .join("\n")

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
