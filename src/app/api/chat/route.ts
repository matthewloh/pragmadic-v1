import {
    anthropicModel,
    geminiFlashModel,
    geminiProModel,
    gpt4ominiModel,
    gpt4oModel,
} from "@/lib/ai/custom-model"
import { createMessage } from "@/lib/api/chats/mutations"
import { createClient } from "@/utils/supabase/server"
import { convertToCoreMessages, streamText } from "ai"
import { getSession } from "../../../utils/supabase/queries/cached-queries"

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

export async function POST(req: Request) {
    const { chatId, messages, model, selectedDocumentIds } = await req.json()
    console.log("model", model)
    console.log("selectedDocumentIds", selectedDocumentIds)
    const {
        data: { session },
    } = await getSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    let selectedModel

    switch (model) {
        case "gpt-4o":
            selectedModel = gpt4oModel
            break
        case "gpt-4o-mini":
            selectedModel = gpt4ominiModel
            break
        case "claude-3-haiku":
            selectedModel = anthropicModel
            break
        case "gemini-1.5-pro-002":
            selectedModel = geminiProModel
            break
        default:
            selectedModel = geminiFlashModel
            break
    }

    const result = await streamText({
        model: selectedModel,
        system: `You are a helpful assistant. Use the provided context to answer questions accurately.
        If no relevant context is provided, say "I don't have enough information to answer that question."
        Always cite your sources when using information from the context.`,
        messages: convertToCoreMessages(messages),
        experimental_providerMetadata: {
            documents: {
                selection: selectedDocumentIds || [],
            },
        },
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            await createMessage({
                id: chatId,
                messages: [...messages, { role: "assistant", content: text }],
            })
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
