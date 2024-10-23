import { createResource } from "@/lib/actions/resources"
import { findRelevantContent } from "@/lib/ai/embeddings"
import {
    createChatWithMessages,
    createMessage,
} from "@/lib/api/chats/mutations"
import { db } from "@/lib/db"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText, tool } from "ai"
import { z } from "zod"
import { getSession } from "../../../utils/supabase/queries/cached-queries"
import { createClient } from "@/utils/supabase/server"
import { customModel, geminiModel, anthropicModel } from "@/lib/ai/custom-model"

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

export async function POST(req: Request) {
    const { chatId, messages, selectedFilePathnames, model } = await req.json()
    console.log("model", model)
    const {
        data: { session },
    } = await getSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    let selectedModel
    switch (model) {
        case "gpt-4o":
        case "gpt-4o-mini":
            selectedModel = customModel
            break
        case "claude-3-haiku":
            selectedModel = anthropicModel
            break
        case "gemini-1.5-pro-002":
        default:
            selectedModel = geminiModel
            break
    }

    const result = await streamText({
        model: selectedModel,
        system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls. Prioritize using the tools to answer questions.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know.". Attempt to use tools before responding.`,
        messages: convertToCoreMessages(messages),
        experimental_providerMetadata: {
            files: {
                selection: selectedFilePathnames,
            },
        },
        maxSteps: 3,
        tools: {
            addResource: tool({
                description: `add a resource to your knowledge base
      If the user provides a random piece of knowledge unprompted use this tool without asking for confirmation.`,
                parameters: z.object({
                    content: z
                        .string()
                        .describe(
                            "the content or resource to add to the knowledge base",
                        ),
                }),
                execute: async ({ content }) => createResource({ content }),
            }),
            getInformation: tool({
                description: `get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    question: z.string().describe("the users question"),
                }),
                execute: async ({ question }) => findRelevantContent(question),
            }),
        },
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            // implement your own storage logic:
            // await saveChat({ text, toolCalls, toolResults });
            await createMessage({
                id: chatId,
                messages: [...messages, { role: "assistant", content: text }],
            })
        },
        experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
        },
    })

    return result.toDataStreamResponse()
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
        return new Response("Not Found", { status: 404 })
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from("chats")
            .delete()
            .eq("id", id)

        if (error) throw error

        return Response.json(data)
    } catch (error) {
        return new Response("An error occurred while processing your request", {
            status: 500,
        })
    }
}
