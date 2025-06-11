import {
    AnalyticsTestCase,
    AnalyticsTestResult,
    BenchmarkResults,
    GenerationMetrics,
    RAGTestCase,
    RAGTestResult,
    DetailedSummaryMetrics,
} from "../types"
import {
    benchmarkStorage,
    BenchmarkSession,
} from "../services/benchmarkStorage"

export class BenchmarkRunner {
    private results: {
        rag: RAGTestResult[]
        analytics: AnalyticsTestResult[]
    } = { rag: [], analytics: [] }
    private logs: string[] = []
    private isCapturing = false
    private currentSession: BenchmarkSession | null = null

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
        enableLLMJudge: boolean = false,
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

                    // Consume the streaming response (required for completion)
        const reader = response.body?.getReader()
        let toolCalls: any[] = []

        if (reader) {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                const lines = chunk.split("\n")

                for (const line of lines) {
                    if (line.trim() === "") continue

                    try {
                        // Still parse tool calls if needed
                        if (line.startsWith("2:")) {
                            const data = JSON.parse(line.slice(2))
                            if (data.type === "tool-call") {
                                toolCalls.push({
                                    name: data.toolName,
                                    parameters: data.args,
                                })
                            }
                        }
                    } catch (parseError) {
                        // Skip malformed chunks
                        console.warn(
                            `Failed to parse chunk: ${line}`,
                            parseError,
                        )
                    }
                }
            }
        }

        const endTime = Date.now()

        // Fetch generated text from chat database (more reliable than stream parsing)
        let generatedText = ""
        try {
            // Wait for chat to be saved
            await new Promise((resolve) => setTimeout(resolve, 2000))
            
            const chatResponse = await fetch(`/api/chats/${chatId}`)
            if (chatResponse.ok) {
                const chatData = await chatResponse.json()
                const messages = chatData.messages || []
                const lastAssistantMessage = messages
                    .reverse()
                    .find((m: any) => m.role === "assistant")
                
                if (lastAssistantMessage?.content) {
                    generatedText = lastAssistantMessage.content
                    console.log(
                        `[DEBUG] ${testCase.id} - Retrieved text from chat DB: ${generatedText.length} chars`,
                    )
                } else {
                    console.warn(`[DEBUG] ${testCase.id} - No assistant message found in chat`)
                }
            } else {
                console.warn(`[DEBUG] ${testCase.id} - Failed to fetch chat: ${chatResponse.status}`)
            }
        } catch (error) {
            console.warn(`[DEBUG] Failed to fetch chat data for ${chatId}:`, error)
        }

        // Fallback: If we still don't have text, log a warning but continue
        if (!generatedText || generatedText.length === 0) {
            console.warn(
                `[DEBUG] ${testCase.id} - WARNING: No generated text captured. LLM Judge will be skipped.`
            )
        }

        // Enhanced debug logging
        console.log(
            `[DEBUG] ${testCase.id} - Generated text length: ${generatedText.length}`,
        )
        console.log(
            `[DEBUG] ${testCase.id} - Text preview: "${generatedText.substring(0, 200)}..."`,
        )

            // Fetch metrics from API instead of parsing logs
            let retrievedChunks: any[] = []
            let tokenUsage = {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
            }
            let finishReason = "completed"

            try {
                // Wait a moment for the metrics to be stored
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const metricsResponse = await fetch(
                    `/api/benchmark/metrics?chatId=${chatId}`,
                )
                if (metricsResponse.ok) {
                    const metricsData = await metricsResponse.json()

                    if (metricsData.chunks) {
                        retrievedChunks = metricsData.chunks
                    }

                    if (metricsData.metrics?.usage) {
                        tokenUsage = {
                            promptTokens:
                                metricsData.metrics.usage.promptTokens || 0,
                            completionTokens:
                                metricsData.metrics.usage.completionTokens || 0,
                            totalTokens:
                                metricsData.metrics.usage.totalTokens || 0,
                        }
                    }

                    if (metricsData.metrics?.finishReason) {
                        finishReason = metricsData.metrics.finishReason
                    }

                    console.log(`[DEBUG] Retrieved metrics for ${chatId}:`, {
                        chunksCount: retrievedChunks.length,
                        tokenUsage,
                        finishReason,
                    })
                } else {
                    console.warn(`Failed to fetch metrics for ${chatId}`)
                }
            } catch (error) {
                console.warn(`Error fetching metrics for ${chatId}:`, error)
            }

            // Parse logs for this specific chatId (fallback)
            const testLogs = this.logs.filter((log) => log.includes(chatId))
            console.log(`[DEBUG] Total captured logs: ${this.logs.length}`)
            console.log(`[DEBUG] Test logs for ${chatId}:`, testLogs)

            // Use fallback parsing if API didn't return data
            if (retrievedChunks.length === 0) {
                retrievedChunks = this.parseRetrievedChunks(testLogs)
            }
            if (tokenUsage.totalTokens === 0) {
                tokenUsage = this.parseTokenUsage(testLogs)
            }
            if (finishReason === "completed" && testLogs.length > 0) {
                finishReason = this.parseFinishReason(testLogs)
            }

            console.log(`[DEBUG] Final parsed chunks:`, retrievedChunks)
            console.log(`[DEBUG] Final parsed tokens:`, tokenUsage)
            console.log(
                `[DEBUG] Generated text snippet:`,
                generatedText.substring(0, 100),
            )

            // Calculate accurate retrieval metrics
            const retrievalMetrics = this.calculateRetrievalMetrics(
                testCase,
                retrievedChunks,
            )

            // Calculate generation metrics
            const generationMetrics: GenerationMetrics =
                this.calculateGenerationMetrics(
                    testCase,
                    generatedText,
                    retrievedChunks,
                )

            // LLM as a Judge evaluation (optional - only if enabled and meaningful text)
            let llmJudgeEvaluation = undefined
            if (enableLLMJudge && generatedText.length > 10) {
                try {
                    console.log(
                        `[LLM Judge] Evaluating ${testCase.id} with ${generatedText.length} chars...`,
                    )
                    
                    // Call server-side API for LLM Judge evaluation
                    const response = await fetch("/api/benchmark/llm-judge", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            testCase,
                            generatedAnswer: generatedText,
                            retrievedChunks,
                        }),
                    })

                    if (response.ok) {
                        const { evaluation } = await response.json()
                        llmJudgeEvaluation = evaluation
                        
                        console.log(
                            `[LLM Judge] Completed ${testCase.id}: Overall Quality = ${llmJudgeEvaluation.metrics.overallQuality.score}`,
                        )

                        // Override basic generation metrics with LLM judge results if available
                        if (llmJudgeEvaluation.metrics) {
                            generationMetrics.llmJudgeMetrics = {
                                faithfulness:
                                    llmJudgeEvaluation.metrics.faithfulness.score,
                                completeness:
                                    llmJudgeEvaluation.metrics.completeness.score,
                                relevance:
                                    llmJudgeEvaluation.metrics.relevance.score,
                                clarity: llmJudgeEvaluation.metrics.clarity.score,
                                factualAccuracy:
                                    llmJudgeEvaluation.metrics.factualAccuracy
                                        .score,
                                overallQuality:
                                    llmJudgeEvaluation.metrics.overallQuality.score,
                            }
                        }
                    } else {
                        const errorData = await response.json()
                        console.warn(
                            `[LLM Judge] API failed for ${testCase.id}:`,
                            errorData.details || errorData.error
                        )
                    }
                } catch (error) {
                    console.warn(
                        `[LLM Judge] Failed for ${testCase.id}:`,
                        error,
                    )
                }
            }

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
                llmJudgeEvaluation,
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
        // Enhanced keyword matching for expected points
        const containsExpectedPoints =
            testCase.groundTruth.expectedAnswerPoints.map((point) => {
                const lowerText = generatedText.toLowerCase()
                const lowerPoint = point.toLowerCase()

                // Multiple matching strategies
                let found = false
                let confidence = 0.2

                // 1. Exact phrase match (highest confidence)
                if (lowerText.includes(lowerPoint)) {
                    found = true
                    confidence = 0.9
                } else {
                    // 2. Keywords matching (moderate confidence)
                    const keywords = lowerPoint
                        .split(" ")
                        .filter(
                            (word) =>
                                word.length > 3 &&
                                ![
                                    "the",
                                    "and",
                                    "for",
                                    "are",
                                    "this",
                                    "that",
                                    "with",
                                ].includes(word),
                        )
                    const matchedKeywords = keywords.filter((keyword) =>
                        lowerText.includes(keyword),
                    )

                    if (matchedKeywords.length > 0) {
                        found = true
                        confidence = Math.min(
                            0.8,
                            0.4 +
                                (matchedKeywords.length / keywords.length) *
                                    0.4,
                        )
                    }

                    // 3. Semantic similarity for specific concepts
                    const conceptMappings: Record<string, string[]> = {
                        income: [
                            "salary",
                            "earnings",
                            "financial",
                            "money",
                            "revenue",
                            "USD",
                            "dollar",
                        ],
                        passport: ["travel document", "identification", "ID"],
                        insurance: ["coverage", "medical", "health"],
                        application: ["apply", "submit", "process", "form"],
                        fee: ["cost", "price", "payment", "charge", "RM"],
                        validity: [
                            "valid",
                            "duration",
                            "period",
                            "expire",
                            "year",
                            "month",
                        ],
                        extension: ["extend", "renew", "prolongation"],
                        employment: ["work", "job", "employment", "business"],
                        tax: ["taxation", "ITA", "income tax", "IRB"],
                        bank: ["banking", "account", "financial institution"],
                        travel: ["Sabah", "Sarawak", "interstate", "domestic"],
                    }

                    for (const [concept, synonyms] of Object.entries(
                        conceptMappings,
                    )) {
                        if (lowerPoint.includes(concept)) {
                            const foundSynonyms = synonyms.filter((syn) =>
                                lowerText.includes(syn),
                            )
                            if (foundSynonyms.length > 0) {
                                found = true
                                confidence = Math.max(confidence, 0.6)
                            }
                        }
                    }
                }

                return {
                    point,
                    found,
                    confidence: Math.round(confidence * 100) / 100,
                }
            })

        // Enhanced refusal detection for negative tests
        let correctRefusal: boolean | null = null
        if (testCase.category === "negative-test") {
            const refusalPhrases = [
                "don't have information",
                "don't have enough information",
                "cannot answer",
                "not available",
                "cannot provide",
                "insufficient information",
                "outside my knowledge",
                "not relevant",
                "can't help",
                "unable to answer",
                "not about DE Rantau",
                "unrelated to",
                "out of scope",
                "I don't know",
                "no information available",
            ]

            const questionPhrases = [
                "what questions can I answer",
                "how can I help",
                "ask me about DE Rantau",
                "DE Rantau related questions",
            ]

            const lowerText = generatedText.toLowerCase()
            const hasRefusal = refusalPhrases.some((phrase) =>
                lowerText.includes(phrase),
            )
            const redirectsToScope = questionPhrases.some((phrase) =>
                lowerText.includes(phrase),
            )

            correctRefusal = hasRefusal || redirectsToScope

            // Check if it incorrectly provides answer to unrelated question
            if (!correctRefusal && generatedText.length > 50) {
                // If it's a long response without refusal phrases, likely incorrect
                correctRefusal = false
            }
        }

        // Enhanced hallucination detection
        const hallucination =
            retrievedChunks.length === 0 &&
            generatedText.length > 100 &&
            testCase.category !== "negative-test" &&
            !generatedText.toLowerCase().includes("don't have") &&
            !generatedText.toLowerCase().includes("cannot provide")

        // Enhanced citation detection
        const citationsPresent =
            generatedText.includes("source") ||
            generatedText.includes("according to") ||
            generatedText.includes("document") ||
            generatedText.includes("FAQ") ||
            generatedText.includes("DE Rantau") ||
            generatedText.toLowerCase().includes("based on") ||
            generatedText.toLowerCase().includes("as stated") ||
            generatedText.toLowerCase().includes("mentioned in")

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

            // Parse the AI SDK streaming response format (same as RAG tests)
            const reader = response.body?.getReader()
            let generatedText = ""
            let toolsInvoked: any[] = []

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = new TextDecoder().decode(value)
                    const lines = chunk.split("\n")

                    for (const line of lines) {
                        if (line.trim() === "") continue

                        try {
                            // AI SDK streams different data types with prefixes
                            if (line.startsWith("0:")) {
                                // Text delta chunks
                                const data = JSON.parse(line.slice(2))
                                if (
                                    data.type === "text-delta" &&
                                    data.textDelta
                                ) {
                                    generatedText += data.textDelta
                                }
                            } else if (line.startsWith("2:")) {
                                // Tool call chunks
                                const data = JSON.parse(line.slice(2))
                                if (data.type === "tool-call") {
                                    toolsInvoked.push({
                                        name: data.toolName,
                                        parameters: data.args,
                                        id: data.toolCallId,
                                    })
                                }
                            } else if (line.startsWith("8:")) {
                                // Tool result chunks
                                const data = JSON.parse(line.slice(2))
                                if (data.type === "tool-result") {
                                    // Find the corresponding tool call and add result
                                    const toolCall = toolsInvoked.find(
                                        (t) => t.id === data.toolCallId,
                                    )
                                    if (toolCall) {
                                        toolCall.result = data.result
                                    }
                                }
                            }
                            // Handle other stream types as needed
                        } catch (parseError) {
                            // Skip malformed chunks
                            console.warn(
                                `Failed to parse analytics chunk: ${line}`,
                                parseError,
                            )
                        }
                    }
                }
            }

            const endTime = Date.now()

            // Enhanced debug logging for analytics
            console.log(`[DEBUG] Analytics test ${testCase.id} result:`, {
                generatedTextLength: generatedText.length,
                toolsInvokedCount: toolsInvoked.length,
                toolsInvoked: toolsInvoked.map((t) => ({
                    name: t.name,
                    hasResult: !!t.result,
                })),
                duration: endTime - startTime,
                textPreview: generatedText.substring(0, 100),
            })

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
            console.error(`Analytics test ${testCase.id} failed:`, error)
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

        console.log(`[DEBUG] Tool Analysis for ${testCase.id}:`, {
            expectedTool,
            actualTools,
            toolsInvoked: result.toolsInvoked,
        })

        let correctToolCalled = false
        let correctParamsExtracted = false

        if (expectedTool) {
            // Check if the expected tool was called
            correctToolCalled = actualTools.includes(expectedTool)

            // Enhanced parameter validation
            if (correctToolCalled) {
                const toolCall = result.toolsInvoked?.find(
                    (tool: any) => tool.name === expectedTool,
                )
                if (toolCall && testCase.groundTruth?.expectedParams) {
                    const actualParams = toolCall.parameters || {}
                    const expectedParams = testCase.groundTruth.expectedParams

                    // Check if key expected parameters are present and correct
                    let paramMatches = 0
                    let totalParams = Object.keys(expectedParams).length

                    for (const [key, expectedValue] of Object.entries(
                        expectedParams,
                    )) {
                        const actualValue = actualParams[key]

                        if (actualValue !== undefined) {
                            // For string params, do fuzzy matching
                            if (
                                typeof expectedValue === "string" &&
                                typeof actualValue === "string"
                            ) {
                                const similarity =
                                    this.calculateStringSimilarity(
                                        expectedValue.toLowerCase(),
                                        actualValue.toLowerCase(),
                                    )
                                if (similarity > 0.7) paramMatches++
                            } else if (actualValue === expectedValue) {
                                paramMatches++
                            }
                        }
                    }

                    correctParamsExtracted =
                        totalParams > 0
                            ? paramMatches / totalParams >= 0.5
                            : true

                    console.log(
                        `[DEBUG] Parameter analysis for ${testCase.id}:`,
                        {
                            expectedParams,
                            actualParams,
                            paramMatches,
                            totalParams,
                            correctParamsExtracted,
                        },
                    )
                }
            }
        } else {
            // If no specific tool expected, consider any relevant tool call as correct
            const relevantTools = [
                "mcp_supabase_execute_sql",
                "mcp_supabase_list_tables",
                "mcp_supabase_get_project",
                "mcp_supabase_list_projects",
            ]
            correctToolCalled = actualTools.some((tool: string) =>
                relevantTools.includes(tool),
            )
            correctParamsExtracted = correctToolCalled // If tool called, assume params are reasonable
        }

        // Calculate overall score
        let score = 0
        if (correctToolCalled) score += 0.6
        if (correctParamsExtracted) score += 0.4

        return {
            correctToolCalled,
            correctParamsExtracted,
            score: Math.round(score * 100) / 100,
        }
    }

    /**
     * Simple string similarity calculation for parameter matching
     */
    private calculateStringSimilarity(str1: string, str2: string): number {
        const longer = str1.length > str2.length ? str1 : str2
        const shorter = str1.length > str2.length ? str2 : str1

        if (longer.length === 0) return 1.0

        const editDistance = this.calculateEditDistance(longer, shorter)
        return (longer.length - editDistance) / longer.length
    }

    /**
     * Calculate edit distance between two strings
     */
    private calculateEditDistance(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1)
            .fill(null)
            .map(() => Array(str1.length + 1).fill(null))

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1, // deletion
                    matrix[j - 1][i] + 1, // insertion
                    matrix[j - 1][i - 1] + indicator, // substitution
                )
            }
        }

        return matrix[str2.length][str1.length]
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
        testSubsetType:
            | "all"
            | "sample"
            | "custom"
            | "single-analytics"
            | "single-rag" = "sample",
        enableLLMJudge: boolean = false,
    ): Promise<BenchmarkResults> {
        this.startLogCapture()

        // Create benchmark session in database
        try {
            this.currentSession = await benchmarkStorage.createSession({
                model_name: model,
                model_label: this.getModelLabel(model),
                provider: this.getModelProvider(model),
                selected_documents: selectedDocumentIds,
                test_subset_type: testSubsetType,
                total_rag_tests: ragTests.length,
                total_analytics_tests: analyticsTests.length,
            })

            console.log(`Created benchmark session: ${this.currentSession.id}`)
        } catch (error) {
            console.error("Failed to create benchmark session:", error)
            // Continue without database storage
        }

        // For single analytics tests, we don't need to validate chunk IDs
        let chunkValidation = new Map<string, boolean>()
        if (ragTests.length > 0) {
            // Validate chunk IDs before starting tests
            chunkValidation = await this.validateChunkIds(ragTests)
            const invalidChunks = Array.from(chunkValidation.entries())
                .filter(([_, isValid]) => !isValid)
                .map(([chunkId, _]) => chunkId)

            if (invalidChunks.length > 0) {
                console.warn("Invalid chunk IDs found:", invalidChunks)
            }
        }

        const ragResults: RAGTestResult[] = []
        const analyticsResults: AnalyticsTestResult[] = []

        const totalTests = ragTests.length + analyticsTests.length
        let completed = 0

        try {
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
                    enableLLMJudge,
                )
                ragResults.push(result)

                // Store result in database
                if (this.currentSession) {
                    try {
                        await benchmarkStorage.storeRAGResult(
                            this.currentSession.id,
                            result,
                        )
                        console.log(
                            `Stored RAG result for test ${testCase.id} in session ${this.currentSession.id}`,
                        )
                    } catch (error) {
                        console.error("Failed to store RAG result:", error)
                    }
                }

                completed++

                // For single RAG tests, provide specific progress feedback
                if (testSubsetType === "single-rag") {
                    onProgress?.({
                        completed,
                        total: totalTests,
                        current: `Completed single RAG test: ${testCase.id}`,
                    })
                }

                // Small delay to avoid rate limiting (except for single tests)
                if (
                    testSubsetType !== "single-analytics" &&
                    testSubsetType !== "single-rag"
                ) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }
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

                // Store result in database
                if (this.currentSession) {
                    try {
                        await benchmarkStorage.storeAnalyticsResult(
                            this.currentSession.id,
                            result,
                        )
                        console.log(
                            `Stored analytics result for test ${testCase.id} in session ${this.currentSession.id}`,
                        )
                    } catch (error) {
                        console.error(
                            "Failed to store analytics result:",
                            error,
                        )
                    }
                }

                completed++

                // For single analytics tests, provide specific progress feedback
                if (testSubsetType === "single-analytics") {
                    onProgress?.({
                        completed,
                        total: totalTests,
                        current: `Completed single analytics test: ${testCase.id}`,
                    })
                }

                // Small delay to avoid rate limiting (except for single tests)
                if (
                    testSubsetType !== "single-analytics" &&
                    testSubsetType !== "single-rag"
                ) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }
            }

            // Mark session as completed
            if (this.currentSession) {
                try {
                    await benchmarkStorage.updateSessionStatus(
                        this.currentSession.id,
                        "completed",
                    )
                    console.log(
                        `Session ${this.currentSession.id} marked as completed`,
                    )
                } catch (error) {
                    console.error("Failed to update session status:", error)
                }
            }
        } catch (error) {
            // Mark session as failed
            if (this.currentSession) {
                try {
                    await benchmarkStorage.updateSessionStatus(
                        this.currentSession.id,
                        "failed",
                    )
                } catch (dbError) {
                    console.error(
                        "Failed to update session status to failed:",
                        dbError,
                    )
                }
            }
            throw error
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
            if (
                log.includes("[RAG_METRICS]") &&
                log.includes("Retrieved Chunks:")
            ) {
                try {
                    // Extract JSON from log: "[RAG_METRICS] ChatID: xyz - Retrieved Chunks: [JSON]"
                    const jsonMatch = log.match(/Retrieved Chunks:\s*(\[.*\])/)
                    if (jsonMatch) {
                        const retrievedChunks = JSON.parse(jsonMatch[1])
                        chunks.push(
                            ...retrievedChunks.map((chunk: any) => ({
                                chunkId: chunk.chunkId,
                                similarity: chunk.similarity,
                                sourceDocumentId: chunk.sourceDocumentId,
                                filePath: chunk.filePath || "unknown",
                            })),
                        )
                    }
                } catch (e) {
                    console.warn(
                        "Failed to parse retrieved chunks from log:",
                        log,
                        e,
                    )
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
                    const jsonMatch = log.match(/LLM Usage:\s*(\{.*\})/)
                    if (jsonMatch) {
                        const usage = JSON.parse(jsonMatch[1])
                        return {
                            promptTokens: usage.promptTokens || 0,
                            completionTokens: usage.completionTokens || 0,
                            totalTokens: usage.totalTokens || 0,
                        }
                    }
                } catch (e) {
                    console.warn(
                        "Failed to parse token usage from log:",
                        log,
                        e,
                    )
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
            if (
                log.includes("[RAG_METRICS]") &&
                log.includes("Finish Reason:")
            ) {
                const match = log.match(/Finish Reason:\s*(\w+)/)
                if (match) {
                    return match[1]
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
            // Prefer LLM judge score if available
            if (result.generationMetrics.llmJudgeMetrics?.faithfulness !== undefined) {
                return result.generationMetrics.llmJudgeMetrics.faithfulness
            }
            
            // Fallback to basic calculation
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
            // Prefer LLM judge score if available
            if (result.generationMetrics.llmJudgeMetrics?.relevance !== undefined) {
                return result.generationMetrics.llmJudgeMetrics.relevance
            }
            
            // Fallback to basic calculation
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
            // Prefer LLM judge score if available
            if (result.generationMetrics.llmJudgeMetrics?.completeness !== undefined) {
                return result.generationMetrics.llmJudgeMetrics.completeness
            }
            
            // Fallback to basic calculation
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

    private getModelLabel(model: string): string {
        const modelMap: Record<string, string> = {
            "gemini-1.5-flash-002": "Gemini 1.5 Flash",
            "gemini-1.5-pro-002": "Gemini 1.5 Pro",
            "gpt-4o": "GPT-4o",
            "gpt-4o-mini": "GPT-4o Mini",
            "claude-3-haiku": "Claude 3 Haiku",
            "granite3-dense": "Granite 3 Dense",
            "llama3.1-8b": "Llama 3.1 8B",
        }
        return modelMap[model] || model
    }

    private getModelProvider(model: string): string {
        if (model.startsWith("gemini")) return "Google"
        if (model.startsWith("gpt")) return "OpenAI"
        if (model.startsWith("claude")) return "Anthropic"
        if (model.startsWith("granite")) return "IBM"
        if (model.startsWith("llama")) return "Meta"
        return "Unknown"
    }

    getCurrentSession(): BenchmarkSession | null {
        return this.currentSession
    }
}
