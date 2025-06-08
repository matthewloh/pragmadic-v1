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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "essential",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "essential",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "essential",
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
                    chunkId: "4fc9fc36-69e2-4cad-b4d0-a2c23ef59617",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "relevant",
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
                    chunkId: "d65ead97-795d-482c-a460-02ccf9315091",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "relevant",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
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
                    chunkId: "1de853e2-af31-40c3-9a75-8df45a9aa456",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
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
                    chunkId: "4fc9fc36-69e2-4cad-b4d0-a2c23ef59617",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "relevant",
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
                    chunkId: "5fdcaf17-b643-4d2d-a452-f452895f49f4",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "essential",
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
                    chunkId: "8a3a904e-2335-485d-bcfa-69c89d9e8116",
                    documentId: "10ba6de3-c3b4-4999-86e1-4e0587b397b7",
                    priority: "essential",
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
            expectedChunks: [], // No relevant chunks should be found
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
            expectedChunks: [], // No relevant chunks should be found
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
