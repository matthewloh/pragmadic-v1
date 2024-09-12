import { createResource } from "@/lib/actions/resources"
import { findRelevantContent } from "@/lib/ai/embeddings"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText, tool } from "ai"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const data = await req.json()
    console.log(data)
    const messages = data.messages
    const result = await streamText({
        model: openai("gpt-4o-mini"),
        system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls. Prioritize using the tools to answer questions.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know.". Attempt to use tools before responding.`,
        messages: convertToCoreMessages(messages),
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
            console.log(messages)
            console.log({ text, toolCalls, toolResults, usage, finishReason })
        },
    })

    return result.toDataStreamResponse()
}
