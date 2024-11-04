import { generateObject, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import {
    demographicDistributionSchema,
    eventAnalysisSchema,
    memberEngagementSchema,
    eventPredictionSchema,
    communityInsightSchema,
} from "@/lib/analytics/schemas"
import { z } from "zod"
import { db } from "@/lib/db"
import { nomadProfile } from "@/lib/db/schema/nomadProfile"
import { hubEvents, usersToEvents } from "@/lib/db/schema/events"

export async function generateDemographicInsights(rawData: any) {
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.array(demographicDistributionSchema),
        prompt: `Analyze this demographic data and generate insights: ${JSON.stringify(
            rawData,
        )}. Focus on identifying patterns, trends, and making recommendations for community engagement.`,
    })
    return object
}

export async function generateEventAnalysis(eventData: any) {
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: eventAnalysisSchema,
        prompt: `Analyze this event data and provide comprehensive insights: ${JSON.stringify(
            eventData,
        )}. Include attendance patterns, demographic breakdown, and trend analysis.`,
    })
    return object
}

export async function generateMemberEngagementReport(memberData: any) {
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: memberEngagementSchema,
        prompt: `Generate a detailed member engagement report from this data: ${JSON.stringify(
            memberData,
        )}. Focus on segmentation, retention, and engagement patterns.`,
    })
    return object
}

export async function generateEventPrediction(
    eventType: string,
    historicalData: any,
) {
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: eventPredictionSchema,
        prompt: `Predict the success potential for a ${eventType} event based on this historical data: ${JSON.stringify(
            historicalData,
        )}. Include success factors, recommendations, and target audience analysis.`,
    })
    return object
}

export async function generateCommunityInsights(communityData: any) {
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: communityInsightSchema,
        prompt: `Analyze this community data and generate comprehensive insights: ${JSON.stringify(
            communityData,
        )}. Focus on skills distribution, interest patterns, and network analysis.`,
    })
    return object
}

export const generateStructuredDemographics = tool({
    description: "Generate structured demographic insights",
    parameters: z.object({
        aspect: z.enum(["skills", "interests", "locations"]),
    }),
})
