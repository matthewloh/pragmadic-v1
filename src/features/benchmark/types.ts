// Ground Truth and Evaluation Types
export interface GroundTruth {
    expectedChunks: {
        chunkId: string
        documentId: string
        priority: "essential" | "relevant" | "supplementary" // For weighted scoring
    }[]
    expectedAnswerPoints: string[] // Key points the answer should contain
    idealAnswer?: string // Optional reference answer
}

export interface HumanEvaluationScores {
    faithfulness: number // 1-5: Does answer stick to retrieved context?
    relevance: number // 1-5: Does answer address the question?
    completeness: number // 1-5: Does answer contain expected points?
    fluency: number // 1-5: Is answer well-written and clear?
    evaluatorId?: string // Track who did the evaluation
    evaluationTimestamp?: string
}

export interface RetrievalMetrics {
    precisionAtK: number // Relevant chunks in top K / K
    recall: number // Retrieved relevant chunks / Total relevant chunks
    hitRate: number // Did we get at least one essential chunk? (binary)
    averageSimilarityScore: number // Mean similarity of retrieved chunks
    topChunkRelevance: "essential" | "relevant" | "supplementary" | "irrelevant"
}

export interface GenerationMetrics {
    containsExpectedPoints: {
        point: string
        found: boolean
        confidence?: number // Optional: how confident we are it's covered
    }[]
    correctRefusal: boolean | null // For negative tests: did it refuse appropriately?
    hallucination: boolean // Did it make up information not in context?
    citationsPresent: boolean // Did it cite sources when appropriate?
    llmJudgeMetrics?: {
        faithfulness: number // 0-1 scale
        completeness: number // 0-1 scale
        relevance: number // 0-1 scale
        clarity: number // 0-1 scale
        factualAccuracy: number // 0-1 scale
        overallQuality: number // 0-1 scale
    }
}

export interface RAGTestCase {
    id: string
    question: string
    category:
        | "high-priority"
        | "medium-priority"
        | "edge-case"
        | "negative-test"
    groundTruth: GroundTruth
    evaluationNotes?: string // Additional context for evaluators
}

export interface AnalyticsGroundTruth {
    expectedTool: string
    expectedParams?: Record<string, any>
    expectedDataKeys?: string[] // What fields should be in the response
    expectedInsightType?: "factual" | "trend" | "recommendation"
}

export interface AnalyticsTestCase {
    id: string
    query: string
    category: "member-analytics" | "event-analytics" | "review-analytics"
    groundTruth?: AnalyticsGroundTruth
    evaluationNotes?: string
}

export interface LLMJudgeMetrics {
    faithfulness: {
        score: number // 0-1 scale
        reasoning: string
        confidence: number
    }
    completeness: {
        score: number // 0-1 scale
        reasoning: string
        missingAspects: string[]
    }
    relevance: {
        score: number // 0-1 scale
        reasoning: string
        confidence: number
    }
    clarity: {
        score: number // 0-1 scale
        reasoning: string
        issues: string[]
    }
    factualAccuracy: {
        score: number // 0-1 scale
        reasoning: string
        factualErrors: string[]
    }
    overallQuality: {
        score: number // 0-1 scale
        reasoning: string
        strengths: string[]
        weaknesses: string[]
    }
}

export interface LLMJudgeEvaluation {
    judgeModel: string
    evaluationTimestamp: string
    metrics: LLMJudgeMetrics
    rawJudgeResponse: string
    evaluationLatency: number
}

export interface RAGTestResult {
    testCase: RAGTestCase
    chatId: string
    startTime: number
    endTime: number
    duration: number

    // Raw outputs
    retrievedChunks: {
        chunkId: string
        sourceDocumentId: string
        filePath: string
        similarity: number
    }[]
    generatedText: string
    tokenUsage: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
    finishReason: string

    // Calculated metrics
    retrievalMetrics: RetrievalMetrics
    generationMetrics: GenerationMetrics
    humanEvaluation?: HumanEvaluationScores
    llmJudgeEvaluation?: LLMJudgeEvaluation

    success: boolean
    error?: string
}

export interface AnalyticsTestResult {
    testCase: AnalyticsTestCase
    chatId: string
    startTime: number
    endTime: number
    duration: number

    // Tool calling results
    toolsCalled: string[]

    // Analytics-specific metrics
    toolAccuracy: {
        correctToolCalled: boolean
        correctParamsExtracted: boolean
        score: number // 0-1
    }

    dataAccuracy?: {
        expectedDataPresent: boolean
        dataQualityScore: number // 0-1
    }

    success: boolean
    error?: string
}

export interface DetailedSummaryMetrics {
    ragMetrics: {
        totalTests: number
        successfulTests: number

        // Response metrics
        averageResponseTime: number
        averageTokenUsage: number

        // Retrieval metrics
        averagePrecisionAtK: number
        averageRecall: number
        overallHitRate: number

        // Generation metrics
        averageFaithfulness: number
        averageRelevance: number
        averageCompleteness: number
        averageFluency: number
        correctRefusalRate: number // For negative tests

        // By category breakdown
        byCategory: {
            [key in RAGTestCase["category"]]: {
                count: number
                averageScores: Partial<HumanEvaluationScores>
                successRate: number
            }
        }
    }

    analyticsMetrics: {
        totalTests: number
        successfulTests: number
        averageResponseTime: number

        // Tool calling metrics
        toolCallingAccuracy: number
        parameterExtractionAccuracy: number

        // Data quality
        averageDataQualityScore: number

        // By category breakdown
        byCategory: {
            [key in AnalyticsTestCase["category"]]: {
                count: number
                averageToolAccuracy: number
                successRate: number
            }
        }
    }
}

export interface BenchmarkResults {
    ragResults: RAGTestResult[]
    analyticsResults: AnalyticsTestResult[]
    summary: DetailedSummaryMetrics
    metadata?: {
        model: string
        modelLabel?: string
        provider?: string
        timestamp: string
        testSuiteVersion: string
        evaluatorId?: string
    }
}

// Evaluation Configuration
export interface EvaluationConfig {
    k: number // Top K chunks to consider for precision/recall
    requireHumanEvaluation: boolean
    autoDetectRefusal: boolean // Try to automatically detect "I don't know" responses
    strictChunkMatching: boolean // Require exact chunk ID matches vs. content similarity
}
