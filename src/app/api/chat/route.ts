import {
    anthropicModel,
    geminiFlashModel,
    geminiProModel,
    gpt4ominiModel,
    gpt4oModel,
    granite3DenseModel,
    groqModel,
    llama3Model,
} from "@/lib/ai/custom-model"
import { createMessage } from "@/lib/api/chats/mutations"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"
import { createClient } from "@/utils/supabase/server"
import { convertToCoreMessages, streamText, ToolCall } from "ai"
import { getSession } from "../../../utils/supabase/queries/cached-queries"
import { NextRequest } from "next/server"
import { type Message, type ToolCallPart } from "ai"

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(5, "30s"),
})

export async function POST(req: NextRequest) {
    const startTime = Date.now()
    // call ratelimit with request ip
    const ip = req.headers.get("x-forwarded-for") ?? "ip"
    console.log("ip", ip)
    const { success, remaining } = await ratelimit.limit(ip)
    console.log("remaining", remaining)
    // block the request if unsuccessfull
    if (!success) {
        return new Response("Ratelimited!", { status: 429 })
    }
    const requestBody = await req.json()
    const { chatId, messages, model, selectedDocumentIds } = requestBody
    console.log("model", model)
    console.log("selectedDocumentIds", selectedDocumentIds)

    // For correlating logs
    const lastUserMessageContent =
        messages.length > 0
            ? messages[messages.length - 1].content
            : "NO_MESSAGE_CONTENT"
    console.log(
        `[RAG_METRICS] Request received for ChatID: ${chatId}, User Message Snippet: ${String(lastUserMessageContent).substring(0, 50)}...`,
    )

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
        case "granite3-dense":
            selectedModel = granite3DenseModel
            break
        case "llama3.1-8b":
            selectedModel = llama3Model
            break
        case "groq-llama-3.3":
            selectedModel = groqModel
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
            chatId: chatId,
            documents: { selection: selectedDocumentIds || [] },
        },
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            const endTime = Date.now()
            const durationInMs = endTime - startTime

            console.log(
                `[RAG_METRICS] ChatID: ${chatId} - Request finished. Duration: ${durationInMs}ms`,
            )
            console.log(
                `[RAG_METRICS] ChatID: ${chatId} - LLM Usage:`,
                JSON.stringify(usage),
            )
            console.log(
                `[RAG_METRICS] ChatID: ${chatId} - Finish Reason: ${finishReason}`,
            )
            console.log(
                `[RAG_METRICS] ChatID: ${chatId} - Generated Text Snippet: ${text.substring(0, 100)}...`,
            )


            let assistantToolCalls: ToolCallPart[] | undefined = undefined
            if (toolCalls && toolCalls.length > 0) {
                assistantToolCalls = toolCalls.map((tc) => ({
                    type: "tool-call" as const,
                    toolCallId: tc.toolCallId,
                    toolName: tc.toolName,
                    args: tc.args,
                }))
                console.log(
                    `[RAG_METRICS] ChatID: ${chatId} - Assistant Tool Calls:`,
                    JSON.stringify(assistantToolCalls),
                )
            }
            // toolResults are typically part of a separate 'tool' role message, not directly on the assistant's reply with tool_calls.
            // We will log them if they appear, for completeness.
            if (toolResults && toolResults.length > 0) {
                console.log(
                    `[RAG_METRICS] ChatID: ${chatId} - Tool Results received in onFinish:`,
                    JSON.stringify(toolResults),
                )
            }

            const newAssistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: text,
            }

            if (assistantToolCalls) {
                newAssistantMessage.tool_calls =
                    assistantToolCalls as unknown as ToolCall[]
            }

            await createMessage({
                id: chatId,
                messages: [
                    ...(messages as Message[]),
                    newAssistantMessage,
                ] as any,
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
