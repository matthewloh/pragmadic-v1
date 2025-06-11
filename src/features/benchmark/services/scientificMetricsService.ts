import { ScientificMetricsCalculator } from '../utils/scientificMetrics'
import { RAGTestResult, AnalyticsTestResult } from '../types'

export interface ScientificAnalysisSession {
    sessionId: string
    modelName: string
    modelLabel?: string
    provider?: string
    timestamp: string
    scientificMetrics: any // Will be detailed metrics from calculator
    comparisonMetrics?: any // For comparing with other sessions
    paperSummary: string // Formatted for conference paper
    confidenceLevel: number
    sampleSize: number
}

interface BenchmarkSessionData {
  sessionId: string
  modelName: string
  modelLabel?: string
  provider?: string
  timestamp: string
  testSubsetType: string
  totalRAGTests: number
  totalAnalyticsTests: number
  status: string
}

interface RAGTestResultData {
  id: string
  sessionId: string
  testCaseId: string
  question: string
  category: string
  chatId: string
  startTime: string
  endTime: string
  durationMs: number
  success: boolean
  errorMessage?: string
  generatedText?: string
  finishReason?: string
  tokenUsage?: {
    totalTokens: number
    promptTokens: number
    completionTokens: number
  }
  retrievalMetrics?: {
    recall: number
    hitRate: number
    precisionAtK: number
    topChunkRelevance: string
    averageSimilarityScore: number
  }
  generationMetrics?: {
    hallucination: boolean
    correctRefusal?: boolean
    citationsPresent: boolean
    containsExpectedPoints: Array<{
      found: boolean
      point: string
      confidence: number
    }>
  }
  retrievedChunks?: Array<{
    chunkId: string
    similarityScore: number
    rankPosition: number
    sourceDocumentId: string
    filePath: string
  }>
}

interface AnalyticsTestResultData {
  id: string
  sessionId: string
  testCaseId: string
  query: string
  category: string
  chatId: string
  startTime: string
  endTime: string
  durationMs: number
  success: boolean
  errorMessage?: string
  toolsCalled?: string[]
  toolAccuracy?: {
    correctToolCalled: boolean
    correctParamsExtracted: boolean
    score: number
  }
  dataAccuracy?: {
    expectedDataPresent: boolean
    dataQualityScore: number
  }
}

export class ScientificMetricsService {
    
    async calculateMetricsForSession(sessionId: string, confidenceLevel: number = 0.95): Promise<ScientificAnalysisSession> {
        try {
            // Fetch session data from your existing API
            const response = await fetch(`/api/benchmark/session?sessionId=${sessionId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch session data')
            }
            
            const { session, ragResults, analyticsResults } = await response.json()
            
            // Transform database results to the format expected by ScientificMetricsCalculator
            const transformedRAGResults: RAGTestResult[] = ragResults.map((result: any) => ({
                testCase: {
                    id: result.test_case_id,
                    question: result.question,
                    category: result.category,
                    groundTruth: {
                        expectedChunks: [], // Could be reconstructed if needed
                        expectedAnswerPoints: result.generation_metrics?.containsExpectedPoints?.map((p: any) => p.point) || []
                    }
                },
                chatId: result.chat_id,
                startTime: new Date(result.start_time).getTime(),
                endTime: new Date(result.end_time).getTime(),
                duration: result.duration_ms,
                success: result.success,
                error: result.error_message,
                generatedText: result.generated_text || '',
                tokenUsage: result.token_usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                finishReason: result.finish_reason || 'completed',
                retrievedChunks: result.retrieved_chunks?.map((chunk: any) => ({
                    chunkId: chunk.chunk_id,
                    similarity: parseFloat(chunk.similarity_score),
                    sourceDocumentId: chunk.source_document_id,
                    filePath: chunk.file_path
                })) || [],
                retrievalMetrics: result.retrieval_metrics || {
                    precisionAtK: 0,
                    recall: 0,
                    hitRate: 0,
                    averageSimilarityScore: 0,
                    topChunkRelevance: 'irrelevant'
                },
                generationMetrics: result.generation_metrics || {
                    containsExpectedPoints: [],
                    correctRefusal: null,
                    hallucination: false,
                    citationsPresent: false
                }
            }))

            const transformedAnalyticsResults: AnalyticsTestResult[] = analyticsResults.map((result: any) => ({
                testCase: {
                    id: result.test_case_id,
                    query: result.query,
                    category: result.category,
                    groundTruth: {
                        expectedTool: '',
                        expectedParams: {},
                        expectedInsightType: 'factual'
                    }
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
                    score: 0
                },
                dataAccuracy: result.data_accuracy || {
                    expectedDataPresent: false,
                    dataQualityScore: 0
                }
            }))

            // Calculate comprehensive scientific metrics
            const scientificMetrics = ScientificMetricsCalculator.calculateComprehensiveMetrics(
                transformedRAGResults,
                transformedAnalyticsResults,
                confidenceLevel
            )

            // Generate paper summary
            const paperSummary = ScientificMetricsCalculator.exportMetricsForPaper(
                scientificMetrics,
                session.model_label || session.model_name
            )

            const analysisSession: ScientificAnalysisSession = {
                sessionId,
                modelName: session.model_name,
                modelLabel: session.model_label,
                provider: session.provider,
                timestamp: session.timestamp,
                scientificMetrics,
                paperSummary,
                confidenceLevel,
                sampleSize: transformedRAGResults.length + transformedAnalyticsResults.length
            }

            return analysisSession

        } catch (error) {
            console.error('Error calculating scientific metrics:', error)
            throw new Error(`Failed to calculate scientific metrics: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    async compareSessionMetrics(sessionId1: string, sessionId2: string): Promise<{
        session1: ScientificAnalysisSession
        session2: ScientificAnalysisSession
        comparison: any
    }> {
        const [analysis1, analysis2] = await Promise.all([
            this.calculateMetricsForSession(sessionId1),
            this.calculateMetricsForSession(sessionId2)
        ])

        // Get the raw results for comparison
        const [session1Data, session2Data] = await Promise.all([
            fetch(`/api/benchmark/session?sessionId=${sessionId1}`).then(r => r.json()),
            fetch(`/api/benchmark/session?sessionId=${sessionId2}`).then(r => r.json())
        ])

        // Transform for comparison
        const results1 = {
            ragResults: session1Data.ragResults.map(this.transformRAGResult),
            model: analysis1.modelName
        }
        const results2 = {
            ragResults: session2Data.ragResults.map(this.transformRAGResult),
            model: analysis2.modelName
        }

        const comparison = ScientificMetricsCalculator.compareModels(results1, results2)

        return {
            session1: analysis1,
            session2: analysis2,
            comparison
        }
    }

    private transformRAGResult = (result: any): RAGTestResult => ({
        testCase: {
            id: result.test_case_id,
            question: result.question,
            category: result.category,
            groundTruth: {
                expectedChunks: [],
                expectedAnswerPoints: []
            }
        },
        chatId: result.chat_id,
        startTime: new Date(result.start_time).getTime(),
        endTime: new Date(result.end_time).getTime(),
        duration: result.duration_ms,
        success: result.success,
        error: result.error_message,
        generatedText: result.generated_text || '',
        tokenUsage: result.token_usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        finishReason: result.finish_reason || 'completed',
        retrievedChunks: result.retrieved_chunks?.map((chunk: any) => ({
            chunkId: chunk.chunk_id,
            similarity: parseFloat(chunk.similarity_score),
            sourceDocumentId: chunk.source_document_id,
            filePath: chunk.file_path
        })) || [],
        retrievalMetrics: result.retrieval_metrics || {
            precisionAtK: 0,
            recall: 0,
            hitRate: 0,
            averageSimilarityScore: 0,
            topChunkRelevance: 'irrelevant'
        },
        generationMetrics: result.generation_metrics || {
            containsExpectedPoints: [],
            correctRefusal: null,
            hallucination: false,
            citationsPresent: false
        }
    })

    async getAvailableSessionsForAnalysis(): Promise<Array<{
        id: string
        modelName: string
        modelLabel?: string
        provider?: string
        timestamp: string
        totalTests: number
        status: string
    }>> {
        try {
            const response = await fetch('/api/benchmark/session?limit=50')
            if (!response.ok) {
                throw new Error('Failed to fetch sessions')
            }
            
            const { sessions } = await response.json()
            
            return sessions
                .filter((session: any) => session.status === 'completed')
                .map((session: any) => ({
                    id: session.id,
                    modelName: session.model_name,
                    modelLabel: session.model_label,
                    provider: session.provider,
                    timestamp: session.timestamp,
                    totalTests: session.total_rag_tests + session.total_analytics_tests,
                    status: session.status
                }))
        } catch (error) {
            console.error('Error fetching sessions for analysis:', error)
            throw error
        }
    }

    private static async fetchFromAPI<T>(endpoint: string): Promise<T> {
        const response = await fetch(endpoint)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`)
        }
        return response.json()
    }

    /**
     * Get all benchmark sessions ordered by timestamp
     */
    static async getBenchmarkSessions(): Promise<BenchmarkSessionData[]> {
        return this.fetchFromAPI<BenchmarkSessionData[]>('/api/benchmark/sessions')
    }

    /**
     * Get detailed results for a specific session
     */
    static async getSessionResults(sessionId: string): Promise<{
        session: BenchmarkSessionData
        ragResults: RAGTestResultData[]
        analyticsResults: AnalyticsTestResultData[]
    }> {
        return this.fetchFromAPI(`/api/benchmark/sessions/${sessionId}/results`)
    }

    /**
     * Calculate scientific metrics for a session suitable for conference papers
     */
    static async calculateSessionScientificMetrics(sessionId: string) {
        const { session, ragResults, analyticsResults } = await this.getSessionResults(sessionId)

        // Transform database format to match the scientific calculator's expected format
        const transformedRAGResults = ragResults.map(result => ({
            testCase: {
                id: result.testCaseId,
                question: result.question,
                category: result.category as any,
                groundTruth: {
                    expectedChunks: [], // We'll work around this limitation
                    expectedAnswerPoints: result.generationMetrics?.containsExpectedPoints?.map(p => p.point) || []
                }
            },
            chatId: result.chatId,
            startTime: new Date(result.startTime).getTime(),
            endTime: new Date(result.endTime).getTime(),
            duration: result.durationMs,
            retrievedChunks: result.retrievedChunks?.map(chunk => ({
                chunkId: chunk.chunkId,
                similarity: chunk.similarityScore,
                sourceDocumentId: chunk.sourceDocumentId,
                filePath: chunk.filePath
            })) || [],
            generatedText: result.generatedText || '',
            tokenUsage: {
                promptTokens: result.tokenUsage?.promptTokens || 0,
                completionTokens: result.tokenUsage?.completionTokens || 0,
                totalTokens: result.tokenUsage?.totalTokens || 0
            },
            finishReason: result.finishReason || 'completed',
            retrievalMetrics: {
                precisionAtK: result.retrievalMetrics?.precisionAtK || 0,
                recall: result.retrievalMetrics?.recall || 0,
                hitRate: result.retrievalMetrics?.hitRate || 0,
                averageSimilarityScore: result.retrievalMetrics?.averageSimilarityScore || 0,
                topChunkRelevance: result.retrievalMetrics?.topChunkRelevance as any || 'irrelevant'
            },
            generationMetrics: {
                containsExpectedPoints: result.generationMetrics?.containsExpectedPoints || [],
                correctRefusal: result.generationMetrics?.correctRefusal || null,
                hallucination: result.generationMetrics?.hallucination || false,
                citationsPresent: result.generationMetrics?.citationsPresent || false,
                llmJudgeMetrics: result.generationMetrics?.llmJudgeMetrics || undefined
            },
            success: result.success
        }))

        const transformedAnalyticsResults = analyticsResults.map(result => ({
            testCase: {
                id: result.testCaseId,
                query: result.query,
                category: result.category as any,
                groundTruth: {
                    expectedTool: '', // We don't have this in stored data
                    expectedParams: {},
                    expectedInsightType: 'factual' as any
                }
            },
            chatId: result.chatId,
            startTime: new Date(result.startTime).getTime(),
            endTime: new Date(result.endTime).getTime(),
            duration: result.durationMs,
            toolsCalled: result.toolsCalled || [],
            toolAccuracy: result.toolAccuracy || {
                correctToolCalled: false,
                correctParamsExtracted: false,
                score: 0
            },
            dataAccuracy: result.dataAccuracy || {
                expectedDataPresent: false,
                dataQualityScore: 0
            },
            success: result.success
        }))

        // Calculate comprehensive scientific metrics
        const scientificMetrics = ScientificMetricsCalculator.calculateComprehensiveMetrics(
            transformedRAGResults,
            transformedAnalyticsResults,
            0.95 // 95% confidence level
        )

        return {
            session,
            scientificMetrics,
            paperSummary: ScientificMetricsCalculator.exportMetricsForPaper(
                scientificMetrics,
                session.modelLabel || session.modelName
            )
        }
    }

    /**
     * Compare multiple models/sessions for conference paper
     */
    static async compareModelsScientifically(sessionIds: string[]) {
        const comparisons: Array<{
            session: BenchmarkSessionData
            metrics: any
            paperSummary: string
        }> = []

        for (const sessionId of sessionIds) {
            try {
                const result = await this.calculateSessionScientificMetrics(sessionId)
                comparisons.push(result)
            } catch (error) {
                console.error(`Failed to analyze session ${sessionId}:`, error)
            }
        }

        // Generate comparative analysis
        const comparativeAnalysis = this.generateComparativeAnalysis(comparisons)

        return {
            comparisons,
            comparativeAnalysis
        }
    }

    private static generateComparativeAnalysis(comparisons: any[]) {
        if (comparisons.length === 0) return "No valid sessions to compare"

        const ragComparisons = comparisons
            .filter(c => c.session.totalRAGTests > 0)
            .map(c => ({
                model: c.session.modelLabel || c.session.modelName,
                provider: c.session.provider,
                f1Score: c.metrics.f1Score,
                precision: c.metrics.precision,
                recall: c.metrics.recall,
                mrr: c.metrics.meanReciprocalRank,
                sampleSize: c.metrics.sampleSize
            }))
            .sort((a, b) => b.f1Score - a.f1Score)

        const analyticsComparisons = comparisons
            .filter(c => c.session.totalAnalyticsTests > 0)
            .map(c => ({
                model: c.session.modelLabel || c.session.modelName,
                provider: c.session.provider,
                toolAccuracy: c.metrics.toolAccuracy || 0,
                sampleSize: c.metrics.sampleSize
            }))
            .sort((a, b) => b.toolAccuracy - a.toolAccuracy)

        let analysis = "# Model Performance Comparison\n\n"

        if (ragComparisons.length > 0) {
            analysis += "## RAG System Performance\n\n"
            analysis += "| Model | Provider | F1-Score | Precision | Recall | MRR | Sample Size |\n"
            analysis += "|-------|----------|----------|-----------|--------|-----|-------------|\n"
            
            ragComparisons.forEach(comp => {
                analysis += `| ${comp.model} | ${comp.provider || 'Unknown'} | ${comp.f1Score.toFixed(3)} | ${comp.precision.toFixed(3)} | ${comp.recall.toFixed(3)} | ${comp.mrr.toFixed(3)} | ${comp.sampleSize} |\n`
            })
            
            analysis += `\n**Best performing model:** ${ragComparisons[0].model} (F1-Score: ${ragComparisons[0].f1Score.toFixed(3)})\n\n`
        }

        if (analyticsComparisons.length > 0) {
            analysis += "## Analytics System Performance\n\n"
            analysis += "| Model | Provider | Tool Accuracy | Sample Size |\n"
            analysis += "|-------|----------|---------------|-------------|\n"
            
            analyticsComparisons.forEach(comp => {
                analysis += `| ${comp.model} | ${comp.provider || 'Unknown'} | ${(comp.toolAccuracy * 100).toFixed(1)}% | ${comp.sampleSize} |\n`
            })
            
            analysis += `\n**Best performing model:** ${analyticsComparisons[0].model} (Tool Accuracy: ${(analyticsComparisons[0].toolAccuracy * 100).toFixed(1)}%)\n\n`
        }

        return analysis
    }

    /**
     * Quick analysis of the most recent session
     */
    static async analyzeLatestSession() {
        const sessions = await this.getBenchmarkSessions()
        if (sessions.length === 0) {
            throw new Error("No benchmark sessions found")
        }

        const latestSession = sessions[0]
        return this.calculateSessionScientificMetrics(latestSession.sessionId)
    }

    /**
     * Get benchmark session analysis for a specific model
     */
    static async getModelPerformance(modelName: string) {
        const sessions = await this.getBenchmarkSessions()
        const modelSessions = sessions.filter(s => 
            s.modelName === modelName || s.modelLabel === modelName
        )

        if (modelSessions.length === 0) {
            throw new Error(`No sessions found for model: ${modelName}`)
        }

        // Analyze all sessions for this model
        const analyses = await Promise.all(
            modelSessions.slice(0, 5).map(session => // Limit to 5 most recent
                this.calculateSessionScientificMetrics(session.sessionId)
            )
        )

        return {
            modelName,
            totalSessions: modelSessions.length,
            analyses: analyses.filter(a => a !== null),
            aggregatedMetrics: this.aggregateModelMetrics(analyses)
        }
    }

    private static aggregateModelMetrics(analyses: any[]) {
        if (analyses.length === 0) return null

        const validAnalyses = analyses.filter(a => a?.scientificMetrics)
        if (validAnalyses.length === 0) return null

        // Calculate averages across sessions
        const avgF1 = validAnalyses.reduce((sum, a) => sum + a.scientificMetrics.f1Score, 0) / validAnalyses.length
        const avgPrecision = validAnalyses.reduce((sum, a) => sum + a.scientificMetrics.precision, 0) / validAnalyses.length
        const avgRecall = validAnalyses.reduce((sum, a) => sum + a.scientificMetrics.recall, 0) / validAnalyses.length
        const avgMRR = validAnalyses.reduce((sum, a) => sum + a.scientificMetrics.meanReciprocalRank, 0) / validAnalyses.length

        return {
            averageF1Score: avgF1,
            averagePrecision: avgPrecision,
            averageRecall: avgRecall,
            averageMRR: avgMRR,
            totalSessions: validAnalyses.length,
            confidenceLevel: 0.95
        }
    }
}

export const scientificMetricsService = new ScientificMetricsService() 