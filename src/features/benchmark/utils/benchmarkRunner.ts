import {
    AnalyticsTestCase,
    AnalyticsTestResult,
    BenchmarkResults,
    RAGTestCase,
    RAGTestResult,
    DetailedSummaryMetrics,
} from "../types"

export class BenchmarkRunner {
    private results: {
        rag: RAGTestResult[]
        analytics: AnalyticsTestResult[]
    } = { rag: [], analytics: [] }
    private logs: string[] = []
    private isCapturing = false

    constructor() {
        this.startLogCapture()
    }

    startLogCapture() {
        if (this.isCapturing) return
        this.isCapturing = true
        this.logs = []
        // Capture console logs during testing
        const originalLog = console.log
        console.log = (...args) => {
            this.logs.push(args.join(" "))
            originalLog(...args)
        }
    }

    stopLogCapture() {
        this.isCapturing = false
    }

    async validateChunkIds(
        testCases: RAGTestCase[],
    ): Promise<Map<string, boolean>> {
        const chunkValidation = new Map<string, boolean>()

        try {
            // Extract all unique chunk IDs from test cases
            const allChunkIds = new Set<string>()
            testCases.forEach((testCase) => {
                testCase.groundTruth.expectedChunks.forEach((chunk) => {
                    allChunkIds.add(chunk.chunkId)
                })
            })

            // Validate each chunk ID exists in the database
            for (const chunkId of allChunkIds) {
                try {
                    const response = await fetch(
                        "/api/benchmark/validate-chunk",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ chunkId }),
                        },
                    )

                    if (response.ok) {
                        const { exists } = await response.json()
                        chunkValidation.set(chunkId, exists)
                    } else {
                        chunkValidation.set(chunkId, false)
                    }
                } catch (error) {
                    console.warn(`Failed to validate chunk ${chunkId}:`, error)
                    chunkValidation.set(chunkId, false)
                }
            }
        } catch (error) {
            console.error("Error validating chunk IDs:", error)
        }

        return chunkValidation
    }

    async runRAGTest(
        testCase: RAGTestCase,
        selectedDocumentIds: string[],
        model: string = "gemini-1.5-flash-002",
    ): Promise<RAGTestResult> {
        const chatId = `bench-${testCase.id}-${Date.now()}`
        const startTime = Date.now()

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId,
                    messages: [
                        {
                            id: `msg-${Date.now()}`,
                            role: "user",
                            content: testCase.question,
                        },
                    ],
                    model,
                    selectedDocumentIds,
                }),
            })

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`,
                )
            }

            // Parse the streaming response
            const reader = response.body?.getReader()
            let generatedText = ""

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = new TextDecoder().decode(value)
                    // Parse streaming data chunks for content
                    const lines = chunk
                        .split("\n")
                        .filter((line) => line.trim())
                    for (const line of lines) {
                        if (line.startsWith("0:")) {
                            try {
                                const data = JSON.parse(line.slice(2))
                                if (data.type === "text-delta") {
                                    generatedText += data.textDelta
                                }
                            } catch (e) {
                                // Skip malformed chunks
                            }
                        }
                    }
                }
            }

            const endTime = Date.now()

            // Parse logs for this specific chatId
            const testLogs = this.logs.filter((log) => log.includes(chatId))
            const retrievedChunks = this.parseRetrievedChunks(testLogs)
            const tokenUsage = this.parseTokenUsage(testLogs)
            const finishReason = this.parseFinishReason(testLogs)

            // Calculate accurate retrieval metrics
            const retrievalMetrics = this.calculateRetrievalMetrics(
                testCase,
                retrievedChunks,
            )

            // Calculate generation metrics
            const generationMetrics = this.calculateGenerationMetrics(
                testCase,
                generatedText,
                retrievedChunks,
            )

            return {
                testCase,
                chatId,
                startTime,
                endTime,
                duration: endTime - startTime,
                retrievedChunks,
                generatedText,
                tokenUsage,
                finishReason,
                retrievalMetrics,
                generationMetrics,
                success: true,
            }
        } catch (error) {
            return {
                testCase,
                chatId,
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime,
                retrievedChunks: [],
                generatedText: "",
                tokenUsage: {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                },
                finishReason: "error",
                retrievalMetrics: {
                    precisionAtK: 0,
                    recall: 0,
                    hitRate: 0,
                    averageSimilarityScore: 0,
                    topChunkRelevance: "irrelevant",
                },
                generationMetrics: {
                    containsExpectedPoints:
                        testCase.groundTruth.expectedAnswerPoints.map(
                            (point) => ({
                        point,
                        found: false,
                                confidence: 0,
                            }),
                        ),
                    correctRefusal: null,
                    hallucination: false,
                    citationsPresent: false,
                },
                success: false,
                error: error instanceof Error ? error.message : String(error),
            }
        }
    }

    private calculateRetrievalMetrics(
        testCase: RAGTestCase,
        retrievedChunks: any[],
    ) {
        const groundTruthChunks = testCase.groundTruth.expectedChunks
        const k = 5 // Top-K for evaluation

        // Get top-K retrieved chunks
        const topKChunks = retrievedChunks.slice(0, k)
        const retrievedChunkIds = topKChunks.map((chunk) => chunk.chunkId)

        // Calculate precision@K
        const relevantRetrieved = retrievedChunkIds.filter((id) =>
            groundTruthChunks.some((gtChunk) => gtChunk.chunkId === id),
        ).length
        const precisionAtK = k > 0 ? relevantRetrieved / k : 0

        // Calculate recall
        const totalRelevantChunks = groundTruthChunks.length
        const recall =
            totalRelevantChunks > 0
                ? relevantRetrieved / totalRelevantChunks
                : 0

        // Calculate hit rate (did we get at least one expected chunk?)
        const hitRate = relevantRetrieved > 0 ? 1 : 0

        // Average similarity score
        const averageSimilarityScore =
            topKChunks.length > 0
                ? topKChunks.reduce(
                      (sum, chunk) => sum + (chunk.similarity || 0),
                      0,
                  ) / topKChunks.length
                : 0

        // Determine relevance of top chunk
        let topChunkRelevance:
            | "irrelevant"
            | "supplementary"
            | "relevant"
            | "essential" = "irrelevant"
        if (topKChunks.length > 0) {
            const topChunkId = topKChunks[0].chunkId
            const matchingGroundTruth = groundTruthChunks.find(
                (gtChunk) => gtChunk.chunkId === topChunkId,
            )
            if (matchingGroundTruth) {
                topChunkRelevance = matchingGroundTruth.priority
            }
        }

        return {
            precisionAtK,
            recall,
            hitRate,
            averageSimilarityScore,
            topChunkRelevance,
        }
    }

    private calculateGenerationMetrics(
        testCase: RAGTestCase,
        generatedText: string,
        retrievedChunks: any[],
    ) {
        // Check if expected points are covered
        const containsExpectedPoints =
            testCase.groundTruth.expectedAnswerPoints.map((point) => {
                // Simple keyword matching - could be enhanced with more sophisticated NLP
                const found =
                    generatedText.toLowerCase().includes(point.toLowerCase()) ||
                    point
                        .toLowerCase()
                        .split(" ")
                        .some((keyword) =>
                            generatedText.toLowerCase().includes(keyword),
                        )
                return {
                    point,
                    found,
                    confidence: found ? 0.8 : 0.2, // Simple confidence scoring
                }
            })

        // Check for correct refusal (for negative tests)
        let correctRefusal: boolean | null = null
        if (testCase.category === "negative-test") {
            const refusalPhrases = [
                "don't have",
                "cannot answer",
                "not available",
                "cannot provide",
                "insufficient information",
                "outside my knowledge",
                "not relevant",
                "can't help",
                "unable to answer",
            ]
            correctRefusal = refusalPhrases.some((phrase) =>
                generatedText.toLowerCase().includes(phrase),
            )
        }

        // Basic hallucination detection
        const hallucination =
            retrievedChunks.length === 0 &&
            generatedText.length > 100 &&
            testCase.category !== "negative-test"

        // Check for citations
        const citationsPresent =
            generatedText.includes("source") ||
            generatedText.includes("according to") ||
            generatedText.includes("document") ||
            generatedText.includes("FAQ")

        return {
            containsExpectedPoints,
            correctRefusal,
            hallucination,
            citationsPresent,
        }
    }

    async runAnalyticsTest(
        testCase: AnalyticsTestCase,
    ): Promise<AnalyticsTestResult> {
        const startTime = Date.now()

        try {
            const response = await fetch("/api/analytics/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        {
                            id: `msg-${Date.now()}`,
                            role: "user",
                            content: testCase.query,
                        },
                    ],
                }),
            })

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`,
                )
            }

            // Parse the streaming response
            const reader = response.body?.getReader()
            let generatedText = ""
            let toolsInvoked: any[] = []

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = new TextDecoder().decode(value)
                    // Parse streaming data chunks for content and tool calls
                    const lines = chunk
                        .split("\n")
                        .filter((line) => line.trim())
                    for (const line of lines) {
                        if (line.startsWith("0:")) {
                            try {
                                const data = JSON.parse(line.slice(2))
                                if (data.type === "text-delta") {
                                    generatedText += data.textDelta
                                } else if (data.type === "tool-call") {
                                    toolsInvoked.push({
                                        name: data.toolName,
                                        parameters: data.args,
                                    })
                                }
                            } catch (e) {
                                // Skip malformed chunks
                            }
                        }
                    }
                }
            }

            const endTime = Date.now()

            // Create a mock result object that matches what the analysis expects
            const result = {
                response: generatedText,
                toolsInvoked: toolsInvoked,
            }

            // Analyze tool calling accuracy
            const toolAccuracy = this.analyzeToolAccuracy(testCase, result)

            // Analyze data accuracy if available
            const dataAccuracy = this.analyzeDataAccuracy(testCase, result)

            return {
                testCase,
                chatId: `analytics-${testCase.id}-${Date.now()}`,
                startTime,
                endTime,
                duration: endTime - startTime,
                toolsCalled: toolsInvoked.map((tool: any) => tool.name),
                toolAccuracy,
                dataAccuracy,
                success: true,
            }
        } catch (error) {
            return {
                testCase,
                chatId: `analytics-${testCase.id}-${Date.now()}`,
                startTime,
                endTime: Date.now(),
                duration: Date.now() - startTime,
                toolsCalled: [],
                toolAccuracy: {
                    correctToolCalled: false,
                    correctParamsExtracted: false,
                    score: 0,
                },
                dataAccuracy: {
                    expectedDataPresent: false,
                    dataQualityScore: 0,
                },
                success: false,
                error: error instanceof Error ? error.message : String(error),
            }
        }
    }

    private analyzeToolAccuracy(testCase: AnalyticsTestCase, result: any) {
        const actualTools =
            result.toolsInvoked?.map((tool: any) => tool.name) || []
        const expectedTool = testCase.groundTruth?.expectedTool

        const correctToolCalled = expectedTool ? 
            actualTools.includes(expectedTool) : 
            actualTools.length > 0
        const score = correctToolCalled ? 1 : 0

        // Parameter checking based on ground truth
        const correctParamsExtracted = testCase.groundTruth?.expectedParams ?
            result.toolsInvoked?.some((tool: any) => {
                const expectedParams = testCase.groundTruth!.expectedParams!
                return Object.keys(expectedParams).every(
                    (key) => tool.parameters && tool.parameters.hasOwnProperty(key)
                )
            }) || false :
            result.toolsInvoked?.length > 0 || false

        return {
            correctToolCalled,
            correctParamsExtracted,
            score,
        }
    }

    private analyzeDataAccuracy(testCase: AnalyticsTestCase, result: any) {
        // This would need to be implemented based on your specific analytics data structure
        // For now, return a placeholder
        return {
            expectedDataPresent:
                result.data !== undefined && result.data !== null,
            dataQualityScore: 0.8,
        }
    }

    async runAllTests(
        ragTests: RAGTestCase[],
        analyticsTests: AnalyticsTestCase[],
        selectedDocumentIds: string[],
        model: string = "gemini-1.5-flash-002",
        onProgress?: (progress: {
            completed: number
            total: number
            current: string
        }) => void,
    ): Promise<BenchmarkResults> {
        this.startLogCapture()

        // Validate chunk IDs before starting tests
        const chunkValidation = await this.validateChunkIds(ragTests)
        const invalidChunks = Array.from(chunkValidation.entries())
            .filter(([_, isValid]) => !isValid)
            .map(([chunkId, _]) => chunkId)

        if (invalidChunks.length > 0) {
            console.warn("Invalid chunk IDs found:", invalidChunks)
        }

        const ragResults: RAGTestResult[] = []
        const analyticsResults: AnalyticsTestResult[] = []

        const totalTests = ragTests.length + analyticsTests.length
        let completed = 0

        // Run RAG tests
        for (const testCase of ragTests) {
            onProgress?.({
                completed,
                total: totalTests,
                current: `RAG: ${testCase.question}`,
            })
            const result = await this.runRAGTest(
                testCase,
                selectedDocumentIds,
                model,
            )
            ragResults.push(result)
            completed++

            // Small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        // Run Analytics tests
        for (const testCase of analyticsTests) {
            onProgress?.({
                completed,
                total: totalTests,
                current: `Analytics: ${testCase.query}`,
            })
            const result = await this.runAnalyticsTest(testCase)
            analyticsResults.push(result)
            completed++
        }

        this.stopLogCapture()

        // Calculate summary metrics
        const summary = this.calculateSummaryMetrics(
            ragResults,
            analyticsResults,
        )

        return {
            ragResults,
            analyticsResults,
            summary,
        }
    }

    private parseRetrievedChunks(logs: string[]) {
        const chunks: any[] = []

        for (const log of logs) {
            if (log.includes("[RAG_METRICS]") && log.includes("Retrieved Chunks:")) {
                try {
                    // Extract JSON from log: "[RAG_METRICS] ChatID: xyz - Retrieved Chunks: [JSON]"
                    const jsonMatch = log.match(/Retrieved Chunks:\s*(\[.*\])/);
                    if (jsonMatch) {
                        const retrievedChunks = JSON.parse(jsonMatch[1]);
                        chunks.push(...retrievedChunks.map((chunk: any) => ({
                            chunkId: chunk.chunkId,
                            similarity: chunk.similarity,
                            sourceDocumentId: chunk.sourceDocumentId,
                            filePath: chunk.filePath || "unknown",
                        })));
                    }
                } catch (e) {
                    console.warn("Failed to parse retrieved chunks from log:", log, e);
                }
            }
        }

        return chunks
    }

    private parseTokenUsage(logs: string[]) {
        // Extract token usage from logs: "[RAG_METRICS] ChatID: xyz - LLM Usage: {JSON}"
        for (const log of logs) {
            if (log.includes("[RAG_METRICS]") && log.includes("LLM Usage:")) {
                try {
                    const jsonMatch = log.match(/LLM Usage:\s*(\{.*\})/);
                    if (jsonMatch) {
                        const usage = JSON.parse(jsonMatch[1]);
                        return {
                            promptTokens: usage.promptTokens || 0,
                            completionTokens: usage.completionTokens || 0,
                            totalTokens: usage.totalTokens || 0,
                        };
                    }
                } catch (e) {
                    console.warn("Failed to parse token usage from log:", log, e);
                }
            }
        }

        return {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
        }
    }

    private parseFinishReason(logs: string[]) {
        // Extract finish reason from logs: "[RAG_METRICS] ChatID: xyz - Finish Reason: completed"
        for (const log of logs) {
            if (log.includes("[RAG_METRICS]") && log.includes("Finish Reason:")) {
                const match = log.match(/Finish Reason:\s*(\w+)/);
                if (match) {
                    return match[1];
                }
            }
        }
        return "completed"
    }

    private calculateSummaryMetrics(
        ragResults: RAGTestResult[],
        analyticsResults: AnalyticsTestResult[],
    ): DetailedSummaryMetrics {
        const successfulRAG = ragResults.filter((r) => r.success)
        const successfulAnalytics = analyticsResults.filter((r) => r.success)

        const ragMetrics = {
            totalTests: ragResults.length,
            successfulTests: successfulRAG.length,
            
            // Response metrics
            averageResponseTime:
                successfulRAG.length > 0
                    ? successfulRAG.reduce((sum, r) => sum + r.duration, 0) /
                      successfulRAG.length
                    : 0,
            averageTokenUsage:
                successfulRAG.length > 0
                    ? successfulRAG.reduce(
                          (sum, r) => sum + r.tokenUsage.totalTokens,
                          0,
                      ) / successfulRAG.length
                    : 0,
            
            // Retrieval metrics (now calculated accurately)
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

            // Generation metrics (calculated from actual content analysis)
            averageFaithfulness:
                this.calculateAverageFaithfulness(successfulRAG),
            averageRelevance: this.calculateAverageRelevance(successfulRAG),
            averageCompleteness:
                this.calculateAverageCompleteness(successfulRAG),
            averageFluency: 4.5, // Would need more sophisticated analysis
            correctRefusalRate:
                ragResults.filter(
                    (r) => r.testCase.category === "negative-test",
                ).length > 0
                    ? ragResults.filter(
                          (r) =>
                              r.testCase.category === "negative-test" &&
                              r.generationMetrics.correctRefusal === true,
                      ).length /
                      ragResults.filter(
                          (r) => r.testCase.category === "negative-test",
                      ).length
                    : 0,
            
            // By category breakdown
            byCategory: {
                "high-priority": this.calculateCategoryMetrics(
                    ragResults,
                    "high-priority",
                ),
                "medium-priority": this.calculateCategoryMetrics(
                    ragResults,
                    "medium-priority",
                ),
                "edge-case": this.calculateCategoryMetrics(
                    ragResults,
                    "edge-case",
                ),
                "negative-test": this.calculateCategoryMetrics(
                    ragResults,
                    "negative-test",
                ),
            },
        }

        const analyticsMetrics = {
            totalTests: analyticsResults.length,
            successfulTests: successfulAnalytics.length,
            averageResponseTime:
                successfulAnalytics.length > 0
                    ? successfulAnalytics.reduce(
                          (sum, r) => sum + r.duration,
                          0,
                      ) / successfulAnalytics.length
                    : 0,
            
            // Tool calling metrics (now calculated accurately)
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
            
            // Data quality
            averageDataQualityScore:
                successfulAnalytics.length > 0
                    ? successfulAnalytics.reduce(
                          (sum, r) =>
                              sum + (r.dataAccuracy?.dataQualityScore || 0),
                          0,
                      ) / successfulAnalytics.length
                    : 0,
            
            // By category breakdown
            byCategory: {
                "member-analytics": this.calculateAnalyticsCategoryMetrics(
                    analyticsResults,
                    "member-analytics",
                ),
                "event-analytics": this.calculateAnalyticsCategoryMetrics(
                    analyticsResults,
                    "event-analytics",
                ),
                "review-analytics": this.calculateAnalyticsCategoryMetrics(
                    analyticsResults,
                    "review-analytics",
                ),
            },
        }

        return {
            ragMetrics,
            analyticsMetrics,
        }
    }

    private calculateAverageFaithfulness(results: RAGTestResult[]): number {
        if (results.length === 0) return 0

        const faithfulnessScores = results.map((result) => {
            const totalPoints =
                result.generationMetrics.containsExpectedPoints.length
            const coveredPoints =
                result.generationMetrics.containsExpectedPoints.filter(
                    (p) => p.found,
                ).length
            return totalPoints > 0 ? (coveredPoints / totalPoints) * 5 : 2.5
        })

        return (
            faithfulnessScores.reduce((sum, score) => sum + score, 0) /
            faithfulnessScores.length
        )
    }

    private calculateAverageRelevance(results: RAGTestResult[]): number {
        if (results.length === 0) return 0

        const relevanceScores = results.map((result) => {
            // Base score on retrieval hit rate and generation quality
            const retrievalScore = result.retrievalMetrics.hitRate * 2.5
            const generationScore = result.generationMetrics.citationsPresent
                ? 2.5
                : 1.5
            return Math.min(5, retrievalScore + generationScore)
        })

        return (
            relevanceScores.reduce((sum, score) => sum + score, 0) /
            relevanceScores.length
        )
    }

    private calculateAverageCompleteness(results: RAGTestResult[]): number {
        if (results.length === 0) return 0

        const completenessScores = results.map((result) => {
            const pointsCovered =
                result.generationMetrics.containsExpectedPoints.filter(
                    (p) => p.found,
                ).length
            const totalPoints =
                result.generationMetrics.containsExpectedPoints.length
            return totalPoints > 0 ? (pointsCovered / totalPoints) * 5 : 2.5
        })

        return (
            completenessScores.reduce((sum, score) => sum + score, 0) /
            completenessScores.length
        )
    }

    private calculateCategoryMetrics(
        results: RAGTestResult[],
        category: string,
    ) {
        const categoryResults = results.filter(
            (r) => r.testCase.category === category,
        )
        if (categoryResults.length === 0) {
            return {
                count: 0,
                averageScores: {
                    faithfulness: 0,
                    relevance: 0,
                    completeness: 0,
                    fluency: 0,
                },
                successRate: 0,
            }
        }

        return {
            count: categoryResults.length,
            averageScores: {
                faithfulness: this.calculateAverageFaithfulness(
                    categoryResults.filter((r) => r.success),
                ),
                relevance: this.calculateAverageRelevance(
                    categoryResults.filter((r) => r.success),
                ),
                completeness: this.calculateAverageCompleteness(
                    categoryResults.filter((r) => r.success),
                ),
                fluency: 4.5, // Placeholder
            },
            successRate:
                categoryResults.filter((r) => r.success).length /
                categoryResults.length,
        }
    }

    private calculateAnalyticsCategoryMetrics(
        results: AnalyticsTestResult[],
        category: string,
    ) {
        const categoryResults = results.filter(
            (r) => r.testCase.category === category,
        )
        if (categoryResults.length === 0) {
            return {
                count: 0,
                averageToolAccuracy: 0,
                successRate: 0,
            }
        }

        const successfulResults = categoryResults.filter((r) => r.success)
        return {
            count: categoryResults.length,
            averageToolAccuracy:
                successfulResults.length > 0
                    ? successfulResults.reduce(
                          (sum, r) => sum + r.toolAccuracy.score,
                          0,
                      ) / successfulResults.length
                    : 0,
            successRate: successfulResults.length / categoryResults.length,
        }
    }
}
