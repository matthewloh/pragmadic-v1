import { AnalyticsTestResult, BenchmarkResults, RAGTestResult } from "../types"

export interface BenchmarkSession {
    id: string
    model_name: string
    model_label?: string
    provider?: string
    timestamp: string
    test_suite_version: string
    selected_documents: string[]
    test_subset_type:
        | "all"
        | "sample"
        | "custom"
        | "single-analytics"
        | "single-rag"
    total_rag_tests: number
    total_analytics_tests: number
    status: "running" | "completed" | "failed"
    created_at: string
    updated_at: string
}

export interface StoredBenchmarkResults extends BenchmarkResults {
    session: BenchmarkSession
    metadata: {
        model: string
        modelLabel?: string
        provider?: string
        timestamp: string
        testSuiteVersion: string
    }
}

export class BenchmarkStorageService {
    async createSession(params: {
        model_name: string
        model_label?: string
        provider?: string
        selected_documents: string[]
        test_subset_type:
            | "all"
            | "sample"
            | "custom"
            | "single-analytics"
            | "single-rag"
        total_rag_tests: number
        total_analytics_tests: number
    }): Promise<BenchmarkSession> {
        const response = await fetch("/api/benchmark/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to create benchmark session")
        }

        const { session } = await response.json()
        return session
    }

    async updateSessionStatus(
        sessionId: string,
        status: "running" | "completed" | "failed",
    ): Promise<BenchmarkSession> {
        const response = await fetch("/api/benchmark/session", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, status }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to update session status")
        }

        const { session } = await response.json()
        return session
    }

    async storeRAGResult(
        sessionId: string,
        testResult: RAGTestResult,
    ): Promise<void> {
        const response = await fetch("/api/benchmark/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "rag",
                sessionId,
                testResult,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to store RAG result")
        }
    }

    async storeAnalyticsResult(
        sessionId: string,
        testResult: AnalyticsTestResult,
    ): Promise<void> {
        const response = await fetch("/api/benchmark/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "analytics",
                sessionId,
                testResult,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to store analytics result")
        }
    }

    async getSession(sessionId: string): Promise<{
        session: BenchmarkSession
        ragResults: any[]
        analyticsResults: any[]
    }> {
        const response = await fetch(
            `/api/benchmark/session?sessionId=${sessionId}`,
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to fetch session")
        }

        return await response.json()
    }

    async getRecentSessions(limit: number = 10): Promise<BenchmarkSession[]> {
        const response = await fetch(`/api/benchmark/session?limit=${limit}`)

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to fetch sessions")
        }

        const { sessions } = await response.json()
        return sessions
    }

    async getSessionResults(sessionId: string): Promise<{
        ragResults: any[]
        analyticsResults: any[]
    }> {
        const response = await fetch(
            `/api/benchmark/results?sessionId=${sessionId}`,
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to fetch results")
        }

        return await response.json()
    }

    // Transform stored results back to the expected format
    transformStoredResults(
        session: BenchmarkSession,
        ragResults: any[],
        analyticsResults: any[],
    ): StoredBenchmarkResults {
        // Transform RAG results from database format to expected format
        const transformedRAGResults: RAGTestResult[] = ragResults.map(
            (result) => ({
                testCase: {
                    id: result.test_case_id,
                    question: result.question,
                    category: result.category,
                    groundTruth: {
                        expectedChunks: [], // Would need to be reconstructed if needed
                        expectedAnswerPoints: [],
                    },
                },
                chatId: result.chat_id,
                startTime: new Date(result.start_time).getTime(),
                endTime: new Date(result.end_time).getTime(),
                duration: result.duration_ms,
                success: result.success,
                error: result.error_message,
                generatedText: result.generated_text || "",
                tokenUsage: result.token_usage || {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                },
                finishReason: result.finish_reason || "completed",
                retrievedChunks:
                    result.retrieved_chunks?.map((chunk: any) => ({
                        chunkId: chunk.chunk_id,
                        similarity: chunk.similarity_score,
                        sourceDocumentId: chunk.source_document_id,
                        filePath: chunk.file_path,
                    })) || [],
                retrievalMetrics: result.retrieval_metrics || {
                    precisionAtK: 0,
                    recall: 0,
                    hitRate: 0,
                    averageSimilarityScore: 0,
                    topChunkRelevance: "irrelevant",
                },
                generationMetrics: result.generation_metrics || {
                    containsExpectedPoints: [],
                    correctRefusal: null,
                    hallucination: false,
                    citationsPresent: false,
                },
            }),
        )

        // Transform Analytics results from database format to expected format
        const transformedAnalyticsResults: AnalyticsTestResult[] =
            analyticsResults.map((result) => ({
                testCase: {
                    id: result.test_case_id,
                    query: result.query,
                    category: result.category,
                    groundTruth: {
                        expectedTool: "",
                        expectedParams: {},
                        expectedInsightType: "factual",
                    },
                },
                chatId: result.chat_id,
                startTime: new Date(result.start_time).getTime(),
                endTime: new Date(result.end_time).getTime(),
                duration: result.duration_ms,
                success: result.success,
                error: result.error_message,
                toolsCalled: result.tools_called || [],
                toolAccuracy: result.tool_accuracy || {
                    correctToolCalled: false,
                    correctParamsExtracted: false,
                    score: 0,
                },
                dataAccuracy: result.data_accuracy || {
                    expectedDataPresent: false,
                    dataQualityScore: 0,
                },
            }))

        // Calculate summary metrics (simplified version)
        const successfulRAG = transformedRAGResults.filter((r) => r.success)
        const successfulAnalytics = transformedAnalyticsResults.filter(
            (r) => r.success,
        )

        const summary = {
            ragMetrics: {
                totalTests: transformedRAGResults.length,
                successfulTests: successfulRAG.length,
                averageResponseTime:
                    successfulRAG.length > 0
                        ? successfulRAG.reduce(
                              (sum, r) => sum + r.duration,
                              0,
                          ) / successfulRAG.length
                        : 0,
                averageTokenUsage:
                    successfulRAG.length > 0
                        ? successfulRAG.reduce(
                              (sum, r) => sum + r.tokenUsage.totalTokens,
                              0,
                          ) / successfulRAG.length
                        : 0,
                averagePrecisionAtK:
                    successfulRAG.length > 0
                        ? successfulRAG.reduce(
                              (sum, r) => sum + r.retrievalMetrics.precisionAtK,
                              0,
                          ) / successfulRAG.length
                        : 0,
                averageRecall:
                    successfulRAG.length > 0
                        ? successfulRAG.reduce(
                              (sum, r) => sum + r.retrievalMetrics.recall,
                              0,
                          ) / successfulRAG.length
                        : 0,
                overallHitRate:
                    successfulRAG.length > 0
                        ? successfulRAG.reduce(
                              (sum, r) => sum + r.retrievalMetrics.hitRate,
                              0,
                          ) / successfulRAG.length
                        : 0,
                averageFaithfulness: 0, // Would need calculation
                averageRelevance: 0,
                averageCompleteness: 0,
                averageFluency: 0,
                correctRefusalRate: 0,
                byCategory: {
                    "high-priority": {
                        count: 0,
                        averageScores: {
                            faithfulness: 0,
                            relevance: 0,
                            completeness: 0,
                            fluency: 0,
                        },
                        successRate: 0,
                    },
                    "medium-priority": {
                        count: 0,
                        averageScores: {
                            faithfulness: 0,
                            relevance: 0,
                            completeness: 0,
                            fluency: 0,
                        },
                        successRate: 0,
                    },
                    "edge-case": {
                        count: 0,
                        averageScores: {
                            faithfulness: 0,
                            relevance: 0,
                            completeness: 0,
                            fluency: 0,
                        },
                        successRate: 0,
                    },
                    "negative-test": {
                        count: 0,
                        averageScores: {
                            faithfulness: 0,
                            relevance: 0,
                            completeness: 0,
                            fluency: 0,
                        },
                        successRate: 0,
                    },
                },
            },
            analyticsMetrics: {
                totalTests: transformedAnalyticsResults.length,
                successfulTests: successfulAnalytics.length,
                averageResponseTime:
                    successfulAnalytics.length > 0
                        ? successfulAnalytics.reduce(
                              (sum, r) => sum + r.duration,
                              0,
                          ) / successfulAnalytics.length
                        : 0,
                toolCallingAccuracy:
                    successfulAnalytics.length > 0
                        ? successfulAnalytics.reduce(
                              (sum, r) => sum + r.toolAccuracy.score,
                              0,
                          ) / successfulAnalytics.length
                        : 0,
                parameterExtractionAccuracy:
                    successfulAnalytics.length > 0
                        ? successfulAnalytics.filter(
                              (r) => r.toolAccuracy.correctParamsExtracted,
                          ).length / successfulAnalytics.length
                        : 0,
                averageDataQualityScore:
                    successfulAnalytics.length > 0
                        ? successfulAnalytics.reduce(
                              (sum, r) =>
                                  sum + (r.dataAccuracy?.dataQualityScore || 0),
                              0,
                          ) / successfulAnalytics.length
                        : 0,
                byCategory: {
                    "member-analytics": {
                        count: 0,
                        averageToolAccuracy: 0,
                        successRate: 0,
                    },
                    "event-analytics": {
                        count: 0,
                        averageToolAccuracy: 0,
                        successRate: 0,
                    },
                    "review-analytics": {
                        count: 0,
                        averageToolAccuracy: 0,
                        successRate: 0,
                    },
                },
            },
        }

        return {
            ragResults: transformedRAGResults,
            analyticsResults: transformedAnalyticsResults,
            summary,
            session,
            metadata: {
                model: session.model_name,
                modelLabel: session.model_label,
                provider: session.provider,
                timestamp: session.timestamp,
                testSuiteVersion: session.test_suite_version,
            },
        }
    }
}

export const benchmarkStorage = new BenchmarkStorageService()
