import { z } from "zod"

// Base schemas for analytics data structures
export const demographicDistributionSchema = z.object({
    category: z.string(),
    count: z.number(),
    percentage: z.number(),
    trend: z.enum(["increasing", "decreasing", "stable"]),
    recommendations: z.array(z.string()),
})

export const timeSeriesDataPointSchema = z.object({
    timestamp: z.string().datetime(),
    value: z.number(),
    category: z.string().optional(),
})

export const eventAnalysisSchema = z.object({
    eventType: z.string(),
    metrics: z.object({
        totalAttendees: z.number(),
        averageAttendance: z.number(),
        participationRate: z.number(),
        demographicBreakdown: z.array(demographicDistributionSchema),
    }),
    trends: z.array(
        z.object({
            metric: z.string(),
            trend: z.enum(["up", "down", "stable"]),
            changePercentage: z.number(),
        }),
    ),
})

export const memberEngagementSchema = z.object({
    overview: z.object({
        activeMembers: z.number(),
        totalMembers: z.number(),
        engagementRate: z.number(),
        averageEventsPerMember: z.number(),
    }),
    segmentation: z.array(
        z.object({
            segment: z.string(),
            size: z.number(),
            engagementLevel: z.enum(["high", "medium", "low"]),
            commonInterests: z.array(z.string()),
        }),
    ),
    retentionMetrics: z.object({
        overallRetentionRate: z.number(),
        retentionByDuration: z.array(
            z.object({
                duration: z.string(),
                rate: z.number(),
            }),
        ),
    }),
})

export const eventPredictionSchema = z.object({
    predictedSuccess: z.object({
        score: z.number(),
        confidence: z.number(),
        factors: z.array(
            z.object({
                factor: z.string(),
                impact: z.enum(["high", "medium", "low"]),
                explanation: z.string(),
            }),
        ),
    }),
    recommendations: z.array(
        z.object({
            aspect: z.string(),
            suggestion: z.string(),
            expectedImpact: z.number(),
        }),
    ),
    targetAudience: z.array(
        z.object({
            segment: z.string(),
            matchScore: z.number(),
            reachEstimate: z.number(),
        }),
    ),
})

export const communityInsightSchema = z.object({
    topSkills: z.array(
        z.object({
            skill: z.string(),
            count: z.number(),
            growthRate: z.number(),
        }),
    ),
    interestClusters: z.array(
        z.object({
            cluster: z.string(),
            interests: z.array(z.string()),
            memberCount: z.number(),
            commonEvents: z.array(z.string()),
        }),
    ),
    networkStrength: z.object({
        density: z.number(),
        avgConnectionsPerMember: z.number(),
        subCommunities: z.array(
            z.object({
                name: z.string(),
                size: z.number(),
                primaryInterest: z.string(),
            }),
        ),
    }),
})
