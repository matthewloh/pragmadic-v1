import { getSession } from "@/utils/supabase/queries/cached-queries"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText, tool } from "ai"
import { z } from "zod"
import { db } from "@/lib/db"
import { eq, sql } from "drizzle-orm"
import { nomadProfile } from "@/lib/db/schema/nomadProfile"
import { hubEvents, usersToEvents } from "@/lib/db/schema/events"
import {
    generateDemographicInsights,
    generateEventAnalysis,
} from "@/lib/analytics/generators"
import { fetchDemographicData } from "@/lib/analytics/fetchers"

export async function POST(req: Request) {
    const { messages } = await req.json()
    const {
        data: { session },
    } = await getSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    const result = await streamText({
        model: openai("gpt-4"),
        system: "You are an analytics assistant for DE Rantau hub owners, specializing in analyzing digital nomad data and event participation patterns to provide actionable insights.",
        messages: convertToCoreMessages(messages),
        tools: {
            generateStructuredDemographics: tool({
                description: "Generate structured demographic insights",
                parameters: z.object({
                    aspect: z.enum(["skills", "interests", "locations"]),
                }),
                execute: async ({ aspect }) => {
                    const rawData = await fetchDemographicData(aspect)
                    const insights = await generateDemographicInsights(rawData)
                    return JSON.stringify(insights)
                },
            }),
            analyzeEventParticipation: tool({
                description: "Analyze event participation patterns and trends",
                parameters: z.object({
                    timeframe: z.enum(["daily", "weekly", "monthly"]),
                    metric: z.enum([
                        "attendance",
                        "engagement",
                        "type_distribution",
                    ]),
                }),
                execute: async ({ timeframe, metric }) => {
                    const events = await db
                        .select({
                            id: hubEvents.id,
                            name: hubEvents.name,
                            type: hubEvents.typeOfEvent,
                            startDate: hubEvents.startDate,
                            participantCount: sql<number>`count(${usersToEvents.userId})`,
                        })
                        .from(hubEvents)
                        .leftJoin(
                            usersToEvents,
                            eq(hubEvents.id, usersToEvents.eventId),
                        )
                        .groupBy(hubEvents.id)

                    // Process based on metric and timeframe
                    let analysisData
                    if (metric === "type_distribution") {
                        analysisData = events.reduce(
                            (acc, event) => {
                                acc[event.type] = (acc[event.type] || 0) + 1
                                return acc
                            },
                            {} as Record<string, number>,
                        )
                    } else if (metric === "attendance") {
                        analysisData = events.reduce(
                            (acc, event) => {
                                const dateKey = formatDateByTimeframe(
                                    event.startDate,
                                    timeframe,
                                )
                                acc[dateKey] =
                                    (acc[dateKey] || 0) + event.participantCount
                                return acc
                            },
                            {} as Record<string, number>,
                        )
                    }

                    return JSON.stringify({
                        type: "line",
                        data: Object.entries(analysisData || {}).map(
                            ([label, value]) => ({
                                label,
                                value,
                            }),
                        ),
                    })
                },
            }),
            generateEngagementInsights: tool({
                description:
                    "Generate insights about member engagement and participation patterns",
                parameters: z.object({
                    insight_type: z.enum([
                        "participation_rate",
                        "retention",
                        "cross_event_participation",
                    ]),
                }),
                execute: async ({ insight_type }) => {
                    // Fetch participation data
                    const participationData = await db
                        .select({
                            userId: usersToEvents.userId,
                            eventCount: sql<number>`count(${usersToEvents.eventId})`,
                            firstEvent: sql<Date>`min(${hubEvents.startDate})`,
                            lastEvent: sql<Date>`max(${hubEvents.startDate})`,
                        })
                        .from(usersToEvents)
                        .leftJoin(
                            hubEvents,
                            eq(hubEvents.id, usersToEvents.eventId),
                        )
                        .groupBy(usersToEvents.userId)

                    let analysis = {}
                    if (insight_type === "participation_rate") {
                        const totalUsers = participationData.length
                        const activeUsers = participationData.filter(
                            (p) => p.eventCount > 3,
                        ).length
                        analysis = {
                            activeRate: (activeUsers / totalUsers) * 100,
                            averageEventsPerUser:
                                participationData.reduce(
                                    (acc, p) => acc + p.eventCount,
                                    0,
                                ) / totalUsers,
                        }
                    } else if (insight_type === "retention") {
                        // Calculate retention based on continued participation
                        const retainedUsers = participationData.filter((p) => {
                            const monthsSinceFirst = monthsBetween(
                                p.firstEvent,
                                p.lastEvent,
                            )
                            return monthsSinceFirst >= 3 && p.eventCount > 5
                        }).length
                        analysis = {
                            retentionRate:
                                (retainedUsers / participationData.length) *
                                100,
                        }
                    }

                    return JSON.stringify({
                        insights: analysis,
                        recommendations: generateRecommendations(analysis),
                    })
                },
            }),

            predictEventSuccess: tool({
                description:
                    "Predict potential success of event types based on historical data",
                parameters: z.object({
                    event_type: z.string(),
                    target_demographic: z.string().optional(),
                }),
                execute: async ({ event_type, target_demographic }) => {
                    // Analyze historical event performance
                    const historicalEvents = await db
                        .select({
                            type: hubEvents.typeOfEvent,
                            participants: sql<number>`count(${usersToEvents.userId})`,
                            nomadType: nomadProfile.skills, // This would need proper joining
                        })
                        .from(hubEvents)
                        .leftJoin(
                            usersToEvents,
                            eq(hubEvents.id, usersToEvents.eventId),
                        )
                        .leftJoin(
                            nomadProfile,
                            eq(usersToEvents.userId, nomadProfile.userId),
                        )
                        .where(eq(hubEvents.typeOfEvent, event_type))
                        .groupBy(hubEvents.id)

                    // Calculate success metrics
                    const analysis = {
                        averageAttendance:
                            calculateAverageAttendance(historicalEvents),
                        demographicMatch: analyzeTargetDemographic(
                            historicalEvents,
                            target_demographic || "",
                        ),
                        recommendedTimeSlots:
                            suggestTimeSlots(historicalEvents),
                        potentialReach:
                            estimatePotentialReach(historicalEvents),
                    }

                    return JSON.stringify(analysis)
                },
            }),
        },
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            // Log analytics usage for improvement
            console.log(toolCalls, toolResults, usage, finishReason)
        },
    })

    return result.toDataStreamResponse()
}

// Helper functions
function formatDateByTimeframe(date: Date, timeframe: string): string {
    // Implementation for date formatting based on timeframe
    return date.toISOString()
}

function monthsBetween(date1: Date, date2: Date): number {
    return Math.floor(
        Math.abs(date2.getTime() - date1.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
    )
}

function generateRecommendations(analysis: any): string[] {
    // Implementation for generating recommendations based on analysis
    return []
}

// Add other helper functions for calculations and analysis
function calculateAverageAttendance(historicalEvents: any[]): number {
    return (
        historicalEvents.reduce((acc, event) => acc + event.participants, 0) /
        historicalEvents.length
    )
}

function analyzeTargetDemographic(
    historicalEvents: any[],
    target_demographic: string,
): number {
    return 0
}

function suggestTimeSlots(historicalEvents: any[]): string[] {
    return []
}

function estimatePotentialReach(historicalEvents: any[]): number {
    return 0
}
