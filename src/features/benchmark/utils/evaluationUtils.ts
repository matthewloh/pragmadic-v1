import { 
    RAGTestCase, 
    RAGTestResult, 
    RetrievalMetrics, 
    GenerationMetrics, 
    HumanEvaluationScores,
    EvaluationConfig 
} from "../types"

export class EvaluationEngine {
    private config: EvaluationConfig

    constructor(config: EvaluationConfig) {
        this.config = config
    }

    /**
     * Calculate retrieval metrics based on ground truth
     */
    calculateRetrievalMetrics(
        testCase: RAGTestCase,
        retrievedChunks: { chunkId: string; similarity: number }[]
    ): RetrievalMetrics {
        const groundTruth = testCase.groundTruth
        const topKChunks = retrievedChunks.slice(0, this.config.k)
        
        // Get expected chunk IDs with priorities
        const essentialChunks = groundTruth.expectedChunks
            .filter(c => c.priority === 'essential')
            .map(c => c.chunkId)
        const relevantChunks = groundTruth.expectedChunks
            .filter(c => c.priority === 'relevant')
            .map(c => c.chunkId)
        const allExpectedChunks = groundTruth.expectedChunks.map(c => c.chunkId)

        // Calculate precision@K
        const retrievedChunkIds = topKChunks.map(c => c.chunkId)
        const relevantRetrieved = retrievedChunkIds.filter(id => 
            allExpectedChunks.includes(id)
        ).length
        const precisionAtK = this.config.k > 0 ? relevantRetrieved / this.config.k : 0

        // Calculate recall
        const totalRelevantChunks = allExpectedChunks.length
        const recall = totalRelevantChunks > 0 ? relevantRetrieved / totalRelevantChunks : 0

        // Calculate hit rate (did we get at least one essential chunk?)
        const gotEssentialChunk = retrievedChunkIds.some(id => essentialChunks.includes(id))
        const hitRate = gotEssentialChunk ? 1 : 0

        // Average similarity score
        const averageSimilarityScore = topKChunks.length > 0 
            ? topKChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / topKChunks.length
            : 0

        // Determine relevance of top chunk
        let topChunkRelevance: RetrievalMetrics['topChunkRelevance'] = 'irrelevant'
        if (topKChunks.length > 0) {
            const topChunkId = topKChunks[0].chunkId
            if (essentialChunks.includes(topChunkId)) {
                topChunkRelevance = 'essential'
            } else if (relevantChunks.includes(topChunkId)) {
                topChunkRelevance = 'relevant'
            } else if (groundTruth.expectedChunks.some(c => c.chunkId === topChunkId && c.priority === 'supplementary')) {
                topChunkRelevance = 'supplementary'
            }
        }

        return {
            precisionAtK,
            recall,
            hitRate,
            averageSimilarityScore,
            topChunkRelevance
        }
    }

    /**
     * Calculate generation metrics
     */
    calculateGenerationMetrics(
        testCase: RAGTestCase,
        generatedText: string,
        retrievedChunks: { chunkId: string; similarity: number }[]
    ): GenerationMetrics {
        const groundTruth = testCase.groundTruth

        // Check if expected points are covered
        const containsExpectedPoints = groundTruth.expectedAnswerPoints.map(point => ({
            point,
            found: this.checkPointCoverage(generatedText, point),
            confidence: this.calculateCoverageConfidence(generatedText, point)
        }))

        // Check for correct refusal (for negative tests)
        let correctRefusal: boolean | null = null
        if (testCase.category === 'negative-test') {
            correctRefusal = this.detectRefusal(generatedText)
        }

        // Basic hallucination detection (very simplified)
        const hallucination = this.detectHallucination(generatedText, retrievedChunks)

        // Check for citations
        const citationsPresent = this.detectCitations(generatedText)

        return {
            containsExpectedPoints,
            correctRefusal,
            hallucination,
            citationsPresent
        }
    }

    /**
     * Auto-detect if the system correctly refused to answer
     */
    private detectRefusal(text: string): boolean {
        const refusalPhrases = [
            "I don't have enough information",
            "I cannot answer",
            "I don't have information about",
            "not available in the provided context",
            "outside the scope",
            "I don't know",
            "insufficient information",
            "no relevant information"
        ]

        const lowerText = text.toLowerCase()
        return refusalPhrases.some(phrase => lowerText.includes(phrase.toLowerCase()))
    }

    /**
     * Check if a specific expected point is covered in the generated text
     */
    private checkPointCoverage(text: string, expectedPoint: string): boolean {
        // Simple keyword-based checking - could be enhanced with semantic similarity
        const pointKeywords = expectedPoint.toLowerCase().split(' ')
            .filter(word => word.length > 3) // Filter out small words
        
        const textLower = text.toLowerCase()
        const keywordMatches = pointKeywords.filter(keyword => 
            textLower.includes(keyword)
        ).length

        // Require at least 50% of significant keywords to be present
        return keywordMatches >= pointKeywords.length * 0.5
    }

    /**
     * Calculate confidence score for point coverage
     */
    private calculateCoverageConfidence(text: string, expectedPoint: string): number {
        const pointKeywords = expectedPoint.toLowerCase().split(' ')
            .filter(word => word.length > 3)
        
        const textLower = text.toLowerCase()
        const keywordMatches = pointKeywords.filter(keyword => 
            textLower.includes(keyword)
        ).length

        return pointKeywords.length > 0 ? keywordMatches / pointKeywords.length : 0
    }

    /**
     * Basic hallucination detection
     */
    private detectHallucination(text: string, retrievedChunks: any[]): boolean {
        // This is a simplified implementation
        // In practice, you'd want more sophisticated checking
        
        // Check if text contains information that couldn't come from retrieved chunks
        // For now, we'll just check if there are retrieved chunks at all
        if (retrievedChunks.length === 0 && text.length > 50) {
            // If no chunks were retrieved but we got a substantial answer, likely hallucination
            return true
        }

        // Could add checks for specific fabricated facts, dates, numbers, etc.
        return false
    }

    /**
     * Detect if the response includes citations or source references
     */
    private detectCitations(text: string): boolean {
        const citationPatterns = [
            /according to/i,
            /based on the/i,
            /from the document/i,
            /as stated in/i,
            /source:/i,
            /reference:/i
        ]

        return citationPatterns.some(pattern => pattern.test(text))
    }

    /**
     * Calculate overall test score
     */
    calculateOverallScore(
        retrievalMetrics: RetrievalMetrics,
        generationMetrics: GenerationMetrics,
        humanEvaluation?: HumanEvaluationScores
    ): number {
        // Weighted scoring system
        let score = 0
        let totalWeight = 0

        // Retrieval score (30% weight)
        const retrievalScore = (retrievalMetrics.precisionAtK + retrievalMetrics.recall + retrievalMetrics.hitRate) / 3
        score += retrievalScore * 0.3
        totalWeight += 0.3

        // Generation score (30% weight)
        const pointsCovered = generationMetrics.containsExpectedPoints.filter(p => p.found).length
        const totalPoints = generationMetrics.containsExpectedPoints.length
        const generationScore = totalPoints > 0 ? pointsCovered / totalPoints : 0
        score += generationScore * 0.3
        totalWeight += 0.3

        // Human evaluation (40% weight if available)
        if (humanEvaluation) {
            const humanScore = (
                humanEvaluation.faithfulness +
                humanEvaluation.relevance +
                humanEvaluation.completeness +
                humanEvaluation.fluency
            ) / 20 // Convert from 20-point scale to 1-point scale
            
            score += humanScore * 0.4
            totalWeight += 0.4
        }

        return totalWeight > 0 ? score / totalWeight : 0
    }

    /**
     * Generate evaluation summary for a test result
     */
    generateEvaluationSummary(result: RAGTestResult): string {
        const summary = []
        
        summary.push(`Test: ${result.testCase.id}`)
        summary.push(`Category: ${result.testCase.category}`)
        summary.push(`Success: ${result.success}`)
        summary.push(`Duration: ${result.duration}ms`)
        summary.push(`Tokens: ${result.tokenUsage.totalTokens}`)
        
        if (result.retrievalMetrics) {
            summary.push(`Precision@${this.config.k}: ${(result.retrievalMetrics.precisionAtK * 100).toFixed(1)}%`)
            summary.push(`Recall: ${(result.retrievalMetrics.recall * 100).toFixed(1)}%`)
            summary.push(`Hit Rate: ${result.retrievalMetrics.hitRate}`)
        }

        if (result.generationMetrics) {
            const pointsCovered = result.generationMetrics.containsExpectedPoints.filter(p => p.found).length
            const totalPoints = result.generationMetrics.containsExpectedPoints.length
            summary.push(`Points Covered: ${pointsCovered}/${totalPoints}`)
        }

        if (result.humanEvaluation) {
            summary.push(`Human Scores: F:${result.humanEvaluation.faithfulness} R:${result.humanEvaluation.relevance} C:${result.humanEvaluation.completeness} FL:${result.humanEvaluation.fluency}`)
        }

        return summary.join(' | ')
    }
}

/**
 * Default evaluation configuration
 */
export const DEFAULT_EVALUATION_CONFIG: EvaluationConfig = {
    k: 5, // Top 5 chunks for precision calculation
    requireHumanEvaluation: false,
    autoDetectRefusal: true,
    strictChunkMatching: true
}

/**
 * Create evaluation engine with default config
 */
export function createEvaluationEngine(config?: Partial<EvaluationConfig>): EvaluationEngine {
    return new EvaluationEngine({ ...DEFAULT_EVALUATION_CONFIG, ...config })
} 