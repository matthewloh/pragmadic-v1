import {
    BotCard,
    BotMessage,
    SpinnerMessage,
    UserMessage,
} from "@/features/chat/components/messages"
import { openai } from "@ai-sdk/openai"
import {
    createAI,
    createStreamableValue,
    getAIState,
    getMutableAIState,
    streamUI,
} from "ai/rsc"
import "server-only"
import { z } from "zod"
import { getSession } from "../../../supabase/queries/cached-queries"
import { createResource } from "../actions/resources"
import { nanoid, sleep } from "../utils"
import { findRelevantContent } from "./embeddings"
import { Chat, Message } from "./types"

const systemPrompt = `\
    You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls. Prioritize using the tools to answer questions.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know.". Attempt to use tools before responding.
    Preface each message with the chatID
`
export type AIState = {
    chatId: string
    messages: Message[]
}

export type UIState = {
    id: string
    display: React.ReactNode
}[]

async function submitUserMessage(content: string) {
    "use server"

    const aiState = getMutableAIState<typeof AI>()

    aiState.update({
        ...aiState.get(),
        messages: [
            ...aiState.get().messages,
            {
                id: nanoid(),
                role: "user",
                content,
            },
        ],
    })

    let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    let textNode: undefined | React.ReactNode

    const result = await streamUI({
        model: openai("gpt-4o-mini"),
        initial: <SpinnerMessage />,
        messages: [
            ...aiState.get().messages.map((message: any) => ({
                role: message.role,
                content: message.content,
                name: message.name,
            })),
        ],
        // initial: (
        //     // <BotMessage className="flex shrink-0 select-none items-center justify-center">
        //     //     <Loader2 className="h-5 w-5 animate-spin stroke-zinc-900" />
        //     // </BotMessage>
        // ),
        text: ({ content, done, delta }) => {
            if (!textStream) {
                textStream = createStreamableValue("")
                textNode = <BotMessage content={textStream.value} />
            }
            if (done) {
                textStream.done()
                aiState.done({
                    ...aiState.get(),
                    messages: [
                        ...aiState.get().messages,
                        {
                            id: nanoid(),
                            role: "assistant",
                            content,
                        },
                    ],
                })
            } else {
                textStream.update(delta)
            }

            return textNode
        },
        tools: {
            addResource: {
                description: `add a resource to your knowledge base
      If the user provides a random piece of knowledge unprompted use this tool without asking for confirmation.`,
                parameters: z.object({
                    content: z
                        .string()
                        .describe(
                            "the content or resource to add to the knowledge base",
                        ),
                }),
                generate: async function* ({ content }) {
                    yield <BotCard>Loading...</BotCard>
                    await sleep(1000)
                    createResource({ content })
                    const toolCallId = nanoid()
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: "assistant",
                                content: [
                                    {
                                        type: "tool-call",
                                        toolName: "addResource",
                                        toolCallId,
                                        args: { content },
                                    },
                                ],
                            },
                            {
                                id: nanoid(),
                                role: "tool",
                                content: [
                                    {
                                        type: "tool-result",
                                        toolName: "addResource",
                                        toolCallId,
                                        result: content,
                                    },
                                ],
                            },
                        ],
                    })

                    return (
                        <BotCard>
                            <pre>{JSON.stringify(content)}</pre>
                            {/* <Stocks props={stocks} /> */}
                        </BotCard>
                    )
                },
            },
            getInformation: {
                description: `get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    question: z.string().describe("the users question"),
                }),
                generate: async function* ({ question }) {
                    yield <BotCard>Loading...</BotCard>
                    await sleep(1000)
                    const result = findRelevantContent(question)
                    const toolCallId = nanoid()
                    aiState.done({
                        ...aiState.get(),
                        messages: [
                            ...aiState.get().messages,
                            {
                                id: nanoid(),
                                role: "assistant",
                                content: [
                                    {
                                        type: "tool-call",
                                        toolName: "getInformation",
                                        toolCallId,
                                        args: { question },
                                    },
                                ],
                            },
                            {
                                id: nanoid(),
                                role: "tool",
                                content: [
                                    {
                                        type: "tool-result",
                                        toolName: "getInformation",
                                        toolCallId,
                                        result,
                                    },
                                ],
                            },
                        ],
                    })

                    return (
                        <BotCard>
                            <pre>{JSON.stringify(result)}</pre>
                        </BotCard>
                    )
                },
            },
        },
    })
    return {
        id: nanoid(),
        display: result.value,
    }
}

export const AI = createAI<AIState, UIState>({
    actions: {
        submitUserMessage,
    },
    initialUIState: [],
    initialAIState: { chatId: nanoid(), messages: [] },
    onGetUIState: async () => {
        "use server"
        const {
            data: { session },
        } = await getSession()

        if (session && session.user) {
            const aiState = getAIState() as Chat

            if (aiState) {
                const uiState = getUIStateFromAIState(aiState)
                return uiState
            }
        } else {
            return
        }
    },
    onSetAIState: async ({ done, key, state }) => {
        "use server"
        const {
            data: { session },
        } = await getSession()

        if (session && session.user.id) {
            const { chatId, messages } = state

            console.log(chatId)
            console.log(messages)
        } else {
            return
        }
    },
})

export const getUIStateFromAIState = (aiState: Chat) => {
    return aiState.messages
        .filter((message) => message.role !== "system")
        .map((message, index) => ({
            id: `${aiState.chatId}-${index}`,
            display:
                message.role === "tool" ? (
                    message.content.map((tool) => {
                        return null
                        //   tool.toolName === 'listStocks' ? (
                        //     <BotCard>
                        //       {/* TODO: Infer types based on the tool result*/}
                        //       {/* @ts-expect-error */}
                        //       <Stocks props={tool.result} />
                        //     </BotCard>
                        //   ) : tool.toolName === 'showStockPrice' ? (
                        //     <BotCard>
                        //       {/* @ts-expect-error */}
                        //       <Stock props={tool.result} />
                        //     </BotCard>
                        //   ) : tool.toolName === 'showStockPurchase' ? (
                        //     <BotCard>
                        //       {/* @ts-expect-error */}
                        //       <Purchase props={tool.result} />
                        //     </BotCard>
                        //   ) : tool.toolName === 'getEvents' ? (
                        //     <BotCard>
                        //       {/* @ts-expect-error */}
                        //       <Events props={tool.result} />
                        //     </BotCard>
                        //   ) : null
                    })
                ) : message.role === "user" ? (
                    <UserMessage>{message.content as string}</UserMessage>
                ) : message.role === "assistant" &&
                  typeof message.content === "string" ? (
                    <BotMessage content={message.content} />
                ) : null,
        }))
}
