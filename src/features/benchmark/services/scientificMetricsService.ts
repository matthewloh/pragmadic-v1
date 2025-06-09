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
}

export const scientificMetricsService = new ScientificMetricsService() 