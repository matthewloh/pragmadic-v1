import { RAGTestCase, AnalyticsTestCase } from "../types"

export const RAG_TEST_CASES: RAGTestCase[] = [
    // High-Priority Questions (based on actual DE Rantau FAQ content)
    {
        id: "rag-001",
        question:
            "What are the eligibility requirements for the DE Rantau Nomad Pass?",
        category: "high-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "d4c6a6d1-839a-4649-950e-44f538471e80",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "47534576-bbed-423c-b5a2-1d2901408b0d",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "eacdee5f-c834-42e8-abb1-70ab33ddf1e5",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
            ],
            expectedAnswerPoints: [
                "Digital nomad or remote worker",
                "Income requirements",
                "Passport validity",
                "Insurance coverage",
            ],
        },
        evaluationNotes:
            "Core eligibility question that should be answered from the FAQ document",
    },
    {
        id: "rag-002",
        question: "How much does the DE Rantau Pass application cost?",
        category: "high-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "1f5d1ea4-fee6-4ad8-af29-edd6a8fbe346",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "22a08f00-4e1f-46c7-8542-c5082b6d61e6",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
            ],
            expectedAnswerPoints: [
                "Application fee amount",
                "Payment methods",
                "Currency information",
            ],
        },
    },
    {
        id: "rag-003",
        question: "How long is the DE Rantau Pass valid for?",
        category: "high-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "eacdee5f-c834-42e8-abb1-70ab33ddf1e5",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "dc6a7156-31d0-45b5-afa3-a8b1edc0d8a0",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
            ],
            expectedAnswerPoints: [
                "Pass validity period",
                "Extension options",
                "Multiple entry details",
            ],
        },
    },
    {
        id: "rag-004",
        question: "Can I extend my DE Rantau Nomad Pass?",
        category: "high-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "dc6a7156-31d0-45b5-afa3-a8b1edc0d8a0",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "eacdee5f-c834-42e8-abb1-70ab33ddf1e5",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "728651d1-ca1c-43ec-b6ad-d48bbcdceb1f",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
                {
                    chunkId: "1f5d1ea4-fee6-4ad8-af29-edd6a8fbe346",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Extension eligibility",
                "Application process for extension",
                "Extension fees",
                "Extension duration",
            ],
        },
    },
    {
        id: "rag-005",
        question: "What documents do I need for DE Rantau application?",
        category: "high-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "c0fe4715-fe57-4a79-82b0-27b751b3a872",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "728651d1-ca1c-43ec-b6ad-d48bbcdceb1f",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "ef4b5f78-172a-4356-940b-151f291dfbce",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
                {
                    chunkId: "c3a22325-eb47-4191-8af6-4a907a94bda4",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
                {
                    chunkId: "cf00349f-fafd-4b92-8f77-dbc23365cea8",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Passport requirements",
                "Income proof",
                "Insurance documentation",
                "Employment verification",
            ],
        },
    },
    {
        id: "rag-006",
        question: "What are the income requirements for DE Rantau applicants?",
        category: "high-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "47534576-bbed-423c-b5a2-1d2901408b0d",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "eacdee5f-c834-42e8-abb1-70ab33ddf1e5",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "c0fe4715-fe57-4a79-82b0-27b751b3a872",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
                {
                    chunkId: "ef4b5f78-172a-4356-940b-151f291dfbce",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Minimum income threshold",
                "Income documentation requirements",
                "Accepted forms of income proof",
            ],
        },
    },

    // Medium-Priority Questions
    {
        id: "rag-007",
        question: "Can my family members join me on the DE Rantau Pass?",
        category: "medium-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "2d726454-ad07-4c9f-908b-5763b5306d97",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
            ],
            expectedAnswerPoints: [
                "Spouse eligibility",
                "Children eligibility",
                "Dependent application process",
                "Family pass requirements",
            ],
        },
    },
    {
        id: "rag-008",
        question: "Where can I apply for the DE Rantau Pass?",
        category: "medium-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "728651d1-ca1c-43ec-b6ad-d48bbcdceb1f",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
            ],
            expectedAnswerPoints: [
                "Online application portal",
                "Embassy/Consulate locations",
                "Application submission process",
            ],
        },
    },
    {
        id: "rag-009",
        question: "What happens if my DE Rantau Pass application is rejected?",
        category: "medium-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "c3a22325-eb47-4191-8af6-4a907a94bda4",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "82a97eeb-54ae-43b4-9b8b-0049d57ef887",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "728651d1-ca1c-43ec-b6ad-d48bbcdceb1f",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Rejection reasons",
                "Appeal process",
                "Reapplication options",
                "Refund policy",
            ],
        },
    },
    {
        id: "rag-010",
        question: "Can I work for Malaysian companies with a DE Rantau Pass?",
        category: "medium-priority",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "2d726454-ad07-4c9f-908b-5763b5306d97",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "d4c6a6d1-839a-4649-950e-44f538471e80",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
                {
                    chunkId: "c0fe4715-fe57-4a79-82b0-27b751b3a872",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Employment restrictions",
                "Remote work permissions",
                "Local employment limitations",
                "Work permit requirements",
            ],
        },
    },

    // Edge Case Questions
    {
        id: "rag-011",
        question:
            "Can I open a bank account in Malaysia with a DE Rantau Pass?",
        category: "edge-case",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "cf00349f-fafd-4b92-8f77-dbc23365cea8",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
            ],
            expectedAnswerPoints: [
                "Banking eligibility",
                "Required documentation",
                "Bank-specific requirements",
                "Account opening process",
            ],
        },
    },
    {
        id: "rag-012",
        question: "Do DE Rantau holders need to pay Malaysian income tax?",
        category: "edge-case",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "af7ad1ef-bf08-4174-97a8-ab2797f641d7",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "7687433f-0004-4205-98c9-b20e93746a96",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "c4480be8-b198-44f2-b13e-68ab772eb5f3",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
                {
                    chunkId: "86f29b20-c0af-4a54-b15c-bb1de23c22df",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Tax obligations",
                "Income Tax Act provisions",
                "Inland Revenue Board rulings",
                "Tax exemption status",
            ],
        },
    },
    {
        id: "rag-013",
        question: "Can I travel to Sabah and Sarawak with my DE Rantau Pass?",
        category: "edge-case",
        groundTruth: {
            expectedChunks: [
                {
                    chunkId: "b5da015b-17c3-4a89-a5ee-dda6224015d2",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "728651d1-ca1c-43ec-b6ad-d48bbcdceb1f",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "essential",
                },
                {
                    chunkId: "d4c6a6d1-839a-4649-950e-44f538471e80",
                    documentId: "7614ae9e-abf2-4f4e-96b7-4028bb7e5778",
                    priority: "relevant",
                },
            ],
            expectedAnswerPoints: [
                "Sabah and Sarawak entry",
                "Tourist pass requirements",
                "State-specific limitations",
                "MDEC coordination efforts",
            ],
        },
    },

    // Negative Test Cases
    {
        id: "rag-014",
        question: "What's the weather like in Penang?",
        category: "negative-test",
        groundTruth: {
            expectedChunks: [],
            expectedAnswerPoints: [
                "Should indicate lack of relevant information",
                "Should not provide weather information",
                "Should suggest consulting weather sources",
            ],
        },
        evaluationNotes:
            "System should correctly refuse to answer as this is outside the DE Rantau knowledge scope",
    },
    {
        id: "rag-015",
        question: "How do I cook rendang?",
        category: "negative-test",
        groundTruth: {
            expectedChunks: [],
            expectedAnswerPoints: [
                "Should indicate lack of relevant information",
                "Should not provide cooking instructions",
                "Should stay focused on DE Rantau topics",
            ],
        },
        evaluationNotes:
            "System should correctly refuse to answer as this is completely unrelated to DE Rantau",
    },
]

export const ANALYTICS_TEST_CASES: AnalyticsTestCase[] = [
    {
        id: "analytics-001",
        query: "Show me the demographics of members in my hub",
        category: "member-analytics",
        groundTruth: {
            expectedTool: "memberStatsTool",
            expectedParams: { includeBreakdown: true, demographic: "all" },
            expectedInsightType: "factual",
        },
        evaluationNotes: "Should generate demographic breakdown visualization",
    },
    {
        id: "analytics-002",
        query: "How many new members joined this month?",
        category: "member-analytics",
        groundTruth: {
            expectedTool: "memberStatsTool",
            expectedParams: { timeframe: "month", type: "new" },
            expectedInsightType: "factual",
        },
        evaluationNotes: "Should return count of new members for current month",
    },
    {
        id: "analytics-003",
        query: "What are the most popular event types based on participation rates?",
        category: "event-analytics",
        groundTruth: {
            expectedTool: "eventStatsTool",
            expectedParams: { metric: "participation", breakdown: "type" },
            expectedInsightType: "trend",
        },
        evaluationNotes: "Should analyze event participation by type",
    },
    {
        id: "analytics-004",
        query: "Show me attendance trends for the last 6 months",
        category: "event-analytics",
        groundTruth: {
            expectedTool: "eventStatsTool",
            expectedParams: { timeframe: "6months", metric: "attendance" },
            expectedInsightType: "trend",
        },
        evaluationNotes: "Should generate trend line for event attendance",
    },
    {
        id: "analytics-005",
        query: "Analyze the sentiment of recent reviews for my hub",
        category: "review-analytics",
        groundTruth: {
            expectedTool: "reviewAnalysisTool",
            expectedParams: { timeframe: "recent", analysis: "sentiment" },
            expectedInsightType: "recommendation",
        },
        evaluationNotes:
            "Should provide sentiment analysis with scores and summary",
    },
]

// Helper function to populate chunk IDs after database inspection
export function updateChunkIds(updatedMappings: Record<string, string[]>) {
    // This would be called after you inspect your database to get actual chunk IDs
    // Example: updateChunkIds({ "rag-001": ["chunk-123", "chunk-456"] })
    // Implementation would update the expectedChunks arrays above
}
