import { getSession } from "@/utils/supabase/queries/cached-queries"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText, tool } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
    const { messages } = await req.json()
    const {
        data: { session },
    } = await getSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }
    const result = await streamText({
        model: openai("gpt-4o-mini"),
        system: "You are an AI assistant for a digital nomad hub owner. You can analyze data, provide summaries, and suggest events based on member information.",
        messages: convertToCoreMessages(messages),
        tools: {
            generateSummary: tool({
                description:
                    "Generate a summary based on hub reviews or nomad backgrounds",
                parameters: z.object({
                    topic: z.enum(["reviews", "nomad_backgrounds"]),
                }),
                execute: async ({ topic }) => {
                    // Simulated summary generation
                    const summaries = {
                        reviews:
                            "The hub has received overwhelmingly positive feedback, with 90% of reviews being 4 stars or higher. Users particularly appreciate the fast internet and comfortable workspaces.",
                        nomad_backgrounds:
                            "The hub attracts a diverse group of digital nomads, with 40% being developers, 30% content creators, 20% entrepreneurs, and 10% from various other professions.",
                    }
                    return summaries[topic]
                },
            }),
            analyzeSentiment: tool({
                description: "Analyze sentiment of reviews and provide links",
                parameters: z.object({
                    review_type: z.enum(["coworking_space", "cafe"]),
                }),
                execute: async ({ review_type }) => {
                    // Simulated sentiment analysis
                    const sentiments = {
                        coworking_space: {
                            positive: 0.8,
                            negative: 0.1,
                            neutral: 0.1,
                        },
                        cafe: { positive: 0.7, negative: 0.2, neutral: 0.1 },
                    }
                    const sentiment = sentiments[review_type]
                    return JSON.stringify({
                        sentiment,
                        link: `https://example.com/reviews/${review_type}`,
                    })
                },
            }),
            suggestEvents: tool({
                description:
                    "Suggest event titles based on member demographics or interests",
                parameters: z.object({
                    based_on: z.enum(["demographics", "interests"]),
                }),
                execute: async ({ based_on }) => {
                    // Simulated event suggestion
                    const suggestions = {
                        demographics: [
                            "Tech Meetup for Digital Nomads",
                            "Freelancer Networking Night",
                            "Remote Work Best Practices Workshop",
                        ],
                        interests: [
                            "Travel Photography Exhibition",
                            "Yoga for Digital Nomads",
                            "Cryptocurrency Investment Seminar",
                        ],
                    }
                    return JSON.stringify(suggestions[based_on])
                },
            }),
            visualizeData: tool({
                description:
                    "Create data visualizations such as histograms or line plots",
                parameters: z.object({
                    chart_type: z.enum(["histogram", "line_plot"]),
                    data_type: z.enum([
                        "occupation_breakdown",
                        "event_participation",
                    ]),
                }),
                execute: async ({ chart_type, data_type }) => {
                    // Simulated data visualization
                    const data = {
                        occupation_breakdown: [
                            { label: "Developers", value: 40 },
                            { label: "Content Creators", value: 30 },
                            { label: "Entrepreneurs", value: 20 },
                            { label: "Others", value: 10 },
                        ],
                        event_participation: [
                            { label: "Jan", value: 50 },
                            { label: "Feb", value: 60 },
                            { label: "Mar", value: 75 },
                            { label: "Apr", value: 90 },
                        ],
                    }
                    return JSON.stringify({
                        type: chart_type,
                        data: data[data_type],
                    })
                },
            }),
        },
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            console.log(toolCalls, toolResults, usage, finishReason)
        },
    })

    return result.toDataStreamResponse()
}
