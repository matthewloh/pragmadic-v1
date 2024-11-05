import { tool as createTool } from "ai"
import { z } from "zod"
import { db } from "@/lib/db"
import { eq, sql } from "drizzle-orm"
import { nomadProfile } from "@/lib/db/schema/nomadProfile"
import { hubEvents, usersToEvents } from "@/lib/db/schema/events"
import { hubs, reviews } from "@/lib/db/schema"

interface MemberDistributionData {
    value: string
    count: number
}

interface ChartResponse {
    distribution?: MemberDistributionData[]
    total?: number
}

export const memberStatsTool = createTool({
    description: "Get member statistics and demographics",
    parameters: z.object({
        metric: z.enum(["skills", "interests", "locations", "total"]),
    }),
    execute: async function ({ metric }): Promise<string> {
        if (metric === "total") {
            const totalMembers = await db
                .select({ count: sql<number>`count(*)` })
                .from(nomadProfile)

            const response: ChartResponse = { total: totalMembers[0].count }
            return JSON.stringify(response)
        }

        const memberStats = await db
            .select({
                value:
                    metric === "locations"
                        ? nomadProfile.currentLocation
                        : metric === "skills"
                          ? nomadProfile.skills
                          : nomadProfile.interests,
                count: sql<number>`count(*)`,
            })
            .from(nomadProfile)
            .groupBy(
                metric === "locations"
                    ? nomadProfile.currentLocation
                    : metric === "skills"
                      ? nomadProfile.skills
                      : nomadProfile.interests,
            )

        const response: ChartResponse = {
            distribution: memberStats.map((stat) => ({
                value: stat.value || "Unknown",
                count: Number(stat.count),
            })),
        }
        return JSON.stringify(response)
    },
})

export const eventStatsTool = createTool({
    description: "Get event statistics and participation data",
    parameters: z.object({
        metric: z.enum(["attendance", "types", "upcoming"]),
    }),
    execute: async function ({ metric }) {
        const query = db
            .select({
                id: hubEvents.id,
                name: hubEvents.name,
                type: hubEvents.typeOfEvent,
                startDate: hubEvents.startDate,
                participants: sql<number>`count(${usersToEvents.userId})`,
                acceptedParticipants: sql<number>`count(case when ${usersToEvents.invite_status} = 'accepted' then 1 end)`,
            })
            .from(hubEvents)
            .leftJoin(usersToEvents, eq(hubEvents.id, usersToEvents.eventId))
            .groupBy(hubEvents.id)

        const events = await query

        switch (metric) {
            case "types":
                const typeDistribution = events.reduce(
                    (acc, event) => {
                        acc[event.type] = (acc[event.type] || 0) + 1
                        return acc
                    },
                    {} as Record<string, number>,
                )
                return JSON.stringify({ types: typeDistribution })

            case "upcoming":
                const upcoming = events
                    .filter((e) => new Date(e.startDate) > new Date())
                    .map((e) => ({
                        name: e.name,
                        date: e.startDate,
                        registeredParticipants: e.participants,
                        confirmedParticipants: e.acceptedParticipants,
                    }))
                return JSON.stringify({ upcoming })

            default: // attendance
                return JSON.stringify({
                    events: events.map((e) => ({
                        name: e.name,
                        date: e.startDate,
                        totalParticipants: e.participants,
                        confirmedParticipants: e.acceptedParticipants,
                    })),
                })
        }
    },
})

export const participationTool = createTool({
    description: "Get insights about member participation",
    parameters: z.object({
        type: z.enum(["active_rate", "event_frequency"]),
    }),
    execute: async function ({ type }) {
        const participation = await db
            .select({
                userId: usersToEvents.userId,
                eventCount: sql<number>`count(${usersToEvents.eventId})`,
            })
            .from(usersToEvents)
            .groupBy(usersToEvents.userId)

        if (type === "active_rate") {
            const totalUsers = participation.length
            const activeUsers = participation.filter(
                (p) => p.eventCount > 2,
            ).length
            return JSON.stringify({
                activeRate: (activeUsers / totalUsers) * 100,
                totalUsers,
                activeUsers,
            })
        }

        const avgEvents =
            participation.reduce((acc, p) => acc + p.eventCount, 0) /
            participation.length
        return JSON.stringify({ averageEventsPerUser: avgEvents })
    },
})

export const sentimentAnalysisToolOfHubReviews = createTool({
    description: "Get sentiment analysis of hub reviews",
    parameters: z.object({}),
    execute: async function () {
        return JSON.stringify({})
    },
})

function normalizeValue(value: number, max: number) {
    return (value / max) * 100
}

export const hubMetricsAnalysisTool = createTool({
    description:
        "Analyze hub metrics across different aspects using radar chart visualization",
    parameters: z.object({
        aspects: z.array(z.string()).optional(),
        timeframe: z.enum(["week", "month", "quarter", "year"]).optional(),
    }),
    execute: async function ({ aspects, timeframe = "month" }) {
        // Default aspects if none provided
        const defaultAspects = [
            "eventParticipation",
            "memberGrowth",
            "communityEngagement",
            "skillsDiversity",
            "locationSpread",
            "interestOverlap",
        ]

        const metricsToAnalyze = aspects || defaultAspects

        // Fetch and calculate metrics
        const metrics = await Promise.all(
            metricsToAnalyze.map(async (aspect) => {
                let value = 0
                switch (aspect) {
                    case "eventParticipation":
                        const events = await db
                            .select({
                                participants: sql<number>`count(${usersToEvents.userId})`,
                            })
                            .from(usersToEvents)
                        value = events[0]?.participants || 0
                        break
                    case "memberGrowth":
                        const members = await db
                            .select({ count: sql<number>`count(*)` })
                            .from(nomadProfile)
                        value = members[0]?.count || 0
                        break
                    // Add other metric calculations
                }
                return {
                    aspect,
                    value: normalizeValue(value, 100), // Normalize to 0-100 scale
                }
            }),
        )

        return JSON.stringify({
            metrics,
            timeframe,
        })
    },
})

export const reviewAnalysisTool = createTool({
    description: "Analyze hub reviews and ratings with visualizations",
    parameters: z.object({
        metric: z.enum([
            "rating_distribution",
            "hub_comparison",
            "top_rated_hubs",
            "review_volume",
            "category_analysis",
        ]),
        hubId: z.string().optional(),
        category: z.string().optional(),
    }),
    execute: async function ({ metric, hubId, category }): Promise<string> {
        switch (metric) {
            case "rating_distribution": {
                const distribution = await db
                    .select({
                        rating: reviews.rating,
                        count: sql<number>`count(*)`,
                    })
                    .from(reviews)
                    .where(hubId ? eq(reviews.hubId, hubId) : undefined)
                    .groupBy(reviews.rating)
                    .orderBy(reviews.rating)

                return JSON.stringify({
                    type: "rating_distribution",
                    data: distribution.map((d) => ({
                        rating: d.rating,
                        count: Number(d.count),
                    })),
                    title: hubId
                        ? "Hub Rating Distribution"
                        : "Overall Rating Distribution",
                })
            }

            case "hub_comparison": {
                const hubStats = await db
                    .select({
                        hubName: hubs.name,
                        avgRating: sql<number>`avg(${reviews.rating})`,
                        totalReviews: sql<number>`count(*)`,
                    })
                    .from(reviews)
                    .leftJoin(hubs, eq(reviews.hubId, hubs.id))
                    .groupBy(hubs.id, hubs.name)
                    .having(sql<number>`count(*) >= 3`) // Only hubs with at least 3 reviews
                    .orderBy(sql<number>`avg(${reviews.rating}) desc`)
                console.log(hubStats)
                return JSON.stringify({
                    type: "hub_comparison",
                    data: hubStats.map((h) => ({
                        hub: h.hubName,
                        rating: Number(h.avgRating.toFixed(1)),
                        reviews: h.totalReviews,
                    })),
                })
            }

            case "top_rated_hubs": {
                const topHubs = await db
                    .select({
                        hubName: hubs.name,
                        avgRating: sql<number>`avg(${reviews.rating})`,
                        reviewCount: sql<number>`count(*)`,
                    })
                    .from(reviews)
                    .leftJoin(hubs, eq(reviews.hubId, hubs.id))
                    .groupBy(hubs.id, hubs.name)
                    .having(sql<number>`count(*) >= 5`)
                    .orderBy(sql<number>`avg(${reviews.rating}) desc`)
                    .limit(5)
                console.log("topHubs", topHubs)
                const formatted = JSON.stringify({
                    type: "top_rated_hubs",
                    data: topHubs.map((h) => ({
                        name: h.hubName,
                        rating: Number(Number(h.avgRating).toFixed(1)),
                        reviews: Number(h.reviewCount),
                    })),
                })
                console.log("formatted", formatted)
                return formatted
            }

            case "review_volume": {
                const volumeData = await db
                    .select({
                        hub: hubs.name,
                        reviewCount: sql<number>`count(*)`,
                        avgRating: sql<number>`avg(${reviews.rating})`,
                    })
                    .from(reviews)
                    .leftJoin(hubs, eq(reviews.hubId, hubs.id))
                    .groupBy(hubs.id, hubs.name)
                    .orderBy(sql<number>`count(*) desc`)
                    .limit(10)
                console.log("volumeData", volumeData)
                return JSON.stringify({
                    type: "review_volume",
                    data: volumeData.map((d) => ({
                        hub: d.hub,
                        count: Number(d.reviewCount),
                        rating: Number(Number(d.avgRating).toFixed(1)),
                    })),
                })
            }

            case "category_analysis": {
                const categoryStats = await db
                    .select({
                        category: hubs.typeOfHub,
                        avgRating: sql<number>`avg(${reviews.rating})`,
                        reviewCount: sql<number>`count(*)`,
                    })
                    .from(reviews)
                    .leftJoin(hubs, eq(reviews.hubId, hubs.id))
                    .groupBy(hubs.typeOfHub)
                    .having(sql<number>`count(*) >= 3`)
                    .orderBy(sql<number>`avg(${reviews.rating}) desc`)

                return JSON.stringify({
                    type: "category_analysis",
                    data: categoryStats.map((stat) => ({
                        category: stat.category || "Uncategorized",
                        rating: Number(Number(stat.avgRating).toFixed(1)),
                        count: Number(stat.reviewCount),
                    })),
                })
            }
        }
    },
})

export const tools = {
    getMemberStats: memberStatsTool,
    getEventStats: eventStatsTool,
    getParticipationInsights: participationTool,
    getHubMetricsAnalysis: hubMetricsAnalysisTool,
    getReviewAnalysis: reviewAnalysisTool,
}
