import { tools } from "@/features/analytics/tools/tools"
import { getSession } from "@/utils/supabase/queries/cached-queries"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText } from "ai"

export async function POST(req: Request) {
    const { messages } = await req.json()
    const {
        data: { session },
    } = await getSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    const result = await streamText({
        model: openai("gpt-4-turbo"),
        system: "You are an analytics assistant for DE Rantau hub owners. You help analyze member data and event participation to provide insights.",
        messages: convertToCoreMessages(messages),
        tools,
        maxSteps: 5,
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            console.log("onFinish")
            // console.log(text, toolCalls, toolResults, usage, finishReason)
            // console.log(messages)
        },
    })

    return result.toDataStreamResponse()
}
