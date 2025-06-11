import { LLMJudgeEvaluation, LLMJudgeMetrics, RAGTestCase } from "../types"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export interface JudgeEvaluationRequest {
    question: string
    generatedAnswer: string
    retrievedChunks: Array<{
        content: string
        similarity: number
        chunkId: string
    }>
    expectedAnswerPoints: string[]
    testCategory: string
}

export class LLMJudgeService {
    private static readonly JUDGE_MODEL = "llama-3.3-70b-versatile" // Groq model identifier

    /**
     * Map our model names to the AI SDK model identifiers
     */
    private static getModelForJudge(modelName: string) {
        switch (modelName) {
            case "groq-llama-3.3":
                return "llama-3.3-70b-versatile" // Groq's model identifier
            case "gpt-4o":
                return "gpt-4o"
            case "gpt-4o-mini":
                return "gpt-4o-mini"
            case "claude-3-haiku":
                return "claude-3-haiku-20240307"
            case "gemini-1.5-pro-002":
                return "gemini-2.0-flash-exp"
            default:
                return "llama-3.3-70b-versatile" // Default to Groq
        }
    }

    /**
     * Comprehensive evaluation prompt for generation quality
     */
    private static buildEvaluationPrompt(
        request: JudgeEvaluationRequest,
    ): string {
        return `You are an expert evaluator for RAG (Retrieval-Augmented Generation) systems. Your task is to comprehensively evaluate the quality of a generated answer.

**EVALUATION CRITERIA:**
1. **Faithfulness (0-100)**: How well the answer adheres to the retrieved context without adding unsubstantiated information
2. **Completeness (0-100)**: How well the answer covers the expected key points for the question
3. **Relevance (0-100)**: How directly the answer addresses the specific question asked
4. **Clarity (0-100)**: How clear, well-structured, and easy to understand the answer is
5. **Factual Accuracy (0-100)**: How factually correct the answer is based on the context

**QUESTION:** ${request.question}

**EXPECTED ANSWER POINTS:**
${request.expectedAnswerPoints.map((point, i) => `${i + 1}. ${point}`).join("\n")}

**RETRIEVED CHUNKS:**
${request.retrievedChunks
    .map(
        (chunk, i) =>
            `Chunk ${i + 1} (similarity: ${chunk.similarity.toFixed(3)}): ${chunk.content.substring(0, 400)}${chunk.content.length > 400 ? "..." : ""}`,
    )
    .join("\n\n")}

**GENERATED ANSWER:**
${request.generatedAnswer}

**EVALUATION INSTRUCTIONS:**
- Score each criterion from 0-100
- Provide specific reasoning for each score
- For completeness, identify which expected points are covered vs missing
- For factual accuracy, flag any statements that contradict the retrieved context
- For faithfulness, ensure no hallucinated information beyond the context
- Consider that a good DE Rantau assistant should refuse to answer questions outside its scope

**SPECIAL CASES:**
- If the question is about non-DE Rantau topics (weather, cooking, etc.), a correct response should politely refuse and redirect to DE Rantau topics
- Empty or very short answers (<20 chars) should receive low scores across all metrics
- Answers with no retrieved context should be evaluated more strictly for faithfulness

Please respond with a valid JSON object following this exact structure:
{
  "faithfulness": {"score": <0-100>, "reasoning": "<explanation>", "confidence": <0-100>},
  "completeness": {"score": <0-100>, "reasoning": "<explanation>", "missingAspects": ["<aspect1>", "<aspect2>"]},
  "relevance": {"score": <0-100>, "reasoning": "<explanation>", "confidence": <0-100>},
  "clarity": {"score": <0-100>, "reasoning": "<explanation>", "issues": ["<issue1>", "<issue2>"]},
  "factualAccuracy": {"score": <0-100>, "reasoning": "<explanation>", "factualErrors": ["<error1>", "<error2>"]},
  "overallQuality": {"score": <0-100>, "reasoning": "<overall assessment>", "strengths": ["<strength1>"], "weaknesses": ["<weakness1>"]}
}`
    }

    /**
     * Robust JSON parsing with fallback strategies
     */
    private static parseJudgeResponse(
        rawResponse: string,
    ): LLMJudgeEvaluation["metrics"] {
        // Remove any markdown formatting
        let jsonStr = rawResponse.trim()
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "")
        }

        try {
            const parsed = JSON.parse(jsonStr)

            // Validate structure and normalize scores to 0-1 scale
            const normalizeScore = (score: number) => {
                if (score > 1) return score / 100 // Convert 0-100 to 0-1
                return Math.max(0, Math.min(1, score)) // Clamp to 0-1
            }

            return {
                faithfulness: {
                    score: normalizeScore(parsed.faithfulness?.score || 0),
                    reasoning:
                        parsed.faithfulness?.reasoning ||
                        "No reasoning provided",
                    confidence: normalizeScore(
                        parsed.faithfulness?.confidence || 0.5,
                    ),
                },
                completeness: {
                    score: normalizeScore(parsed.completeness?.score || 0),
                    reasoning:
                        parsed.completeness?.reasoning ||
                        "No reasoning provided",
                    missingAspects: Array.isArray(
                        parsed.completeness?.missingAspects,
                    )
                        ? parsed.completeness.missingAspects
                        : ["evaluation_incomplete"],
                },
                relevance: {
                    score: normalizeScore(parsed.relevance?.score || 0),
                    reasoning:
                        parsed.relevance?.reasoning || "No reasoning provided",
                    confidence: normalizeScore(
                        parsed.relevance?.confidence || 0.5,
                    ),
                },
                clarity: {
                    score: normalizeScore(parsed.clarity?.score || 0),
                    reasoning:
                        parsed.clarity?.reasoning || "No reasoning provided",
                    issues: Array.isArray(parsed.clarity?.issues)
                        ? parsed.clarity.issues
                        : ["evaluation_incomplete"],
                },
                factualAccuracy: {
                    score: normalizeScore(parsed.factualAccuracy?.score || 0),
                    reasoning:
                        parsed.factualAccuracy?.reasoning ||
                        "No reasoning provided",
                    factualErrors: Array.isArray(
                        parsed.factualAccuracy?.factualErrors,
                    )
                        ? parsed.factualAccuracy.factualErrors
                        : ["evaluation_incomplete"],
                },
                overallQuality: {
                    score: normalizeScore(parsed.overallQuality?.score || 0),
                    reasoning:
                        parsed.overallQuality?.reasoning ||
                        "No reasoning provided",
                    strengths: Array.isArray(parsed.overallQuality?.strengths)
                        ? parsed.overallQuality.strengths
                        : ["evaluation_incomplete"],
                    weaknesses: Array.isArray(parsed.overallQuality?.weaknesses)
                        ? parsed.overallQuality.weaknesses
                        : ["evaluation_incomplete"],
                },
            }
        } catch (error) {
            console.warn("Failed to parse LLM judge response:", error)
            console.warn("Raw response:", rawResponse)

            // Return fallback metrics
            return this.createFallbackMetrics()
        }
    }

    /**
     * Evaluate generation quality using Groq Llama 3.3 as judge
     */
    static async evaluateGeneration(
        testCase: RAGTestCase,
        generatedAnswer: string,
        retrievedChunks: any[],
    ): Promise<LLMJudgeEvaluation> {
        const startTime = Date.now()

        const evaluationRequest: JudgeEvaluationRequest = {
            question: testCase.question,
            generatedAnswer,
            retrievedChunks: retrievedChunks.map((chunk) => ({
                content: chunk.content || "",
                similarity: chunk.similarity || 0,
                chunkId: chunk.chunkId || chunk.id || "",
            })),
            expectedAnswerPoints: testCase.groundTruth.expectedAnswerPoints,
            testCategory: testCase.category,
        }

        try {
            console.log(`[LLM Judge] Starting evaluation for ${testCase.id}`)
            console.log(
                `[LLM Judge] Answer length: ${generatedAnswer.length} chars`,
            )
            console.log(
                `[LLM Judge] Retrieved chunks: ${retrievedChunks.length}`,
            )

            // Use Groq - this will work server-side where GROQ_API_KEY is available
            const { text: judgeResponse } = await generateText({
                // @ts-expect-error - groq is not typed correctly
                model: groq(this.JUDGE_MODEL),
                system: "You are an expert evaluator for RAG systems. Respond only with valid JSON.",
                prompt: this.buildEvaluationPrompt(evaluationRequest),
                maxTokens: 2000,
                temperature: 0.3, // Lower temperature for more consistent evaluation
            })

            const endTime = Date.now()

            console.log(
                `[LLM Judge] Raw response for ${testCase.id}:`,
                judgeResponse.substring(0, 200) + "...",
            )

            // Parse the judge's JSON response
            let metrics: LLMJudgeMetrics
            try {
                metrics = this.parseJudgeResponse(judgeResponse)
                console.log(`[LLM Judge] Parsed metrics for ${testCase.id}:`, {
                    faithfulness: metrics.faithfulness.score,
                    completeness: metrics.completeness.score,
                    relevance: metrics.relevance.score,
                    overall: metrics.overallQuality.score,
                })
            } catch (parseError) {
                console.error("Failed to parse judge response:", judgeResponse)
                throw new Error(`Judge response parsing failed: ${parseError}`)
            }

            return {
                judgeModel: this.JUDGE_MODEL,
                evaluationTimestamp: new Date().toISOString(),
                metrics,
                rawJudgeResponse: judgeResponse,
                evaluationLatency: endTime - startTime,
            }
        } catch (error) {
            console.error("LLM Judge evaluation failed:", error)

            // Return fallback evaluation
            return {
                judgeModel: this.JUDGE_MODEL,
                evaluationTimestamp: new Date().toISOString(),
                metrics: this.createFallbackMetrics(),
                rawJudgeResponse: `Error: ${error}`,
                evaluationLatency: Date.now() - startTime,
            }
        }
    }

    /**
     * Create fallback metrics when judge evaluation fails
     */
    private static createFallbackMetrics(): LLMJudgeMetrics {
        return {
            faithfulness: {
                score: 0,
                reasoning: "Evaluation failed - unable to assess faithfulness",
                confidence: 0,
            },
            completeness: {
                score: 0,
                reasoning: "Evaluation failed - unable to assess completeness",
                missingAspects: ["evaluation_error"],
            },
            relevance: {
                score: 0,
                reasoning: "Evaluation failed - unable to assess relevance",
                confidence: 0,
            },
            clarity: {
                score: 0,
                reasoning: "Evaluation failed - unable to assess clarity",
                issues: ["evaluation_error"],
            },
            factualAccuracy: {
                score: 0,
                reasoning:
                    "Evaluation failed - unable to assess factual accuracy",
                factualErrors: ["evaluation_error"],
            },
            overallQuality: {
                score: 0,
                reasoning:
                    "Evaluation failed - judge could not complete assessment",
                strengths: [],
                weaknesses: ["evaluation_error"],
            },
        }
    }

    /**
     * Calculate aggregate scores for summary reporting
     */
    static calculateAggregateScores(evaluations: LLMJudgeEvaluation[]): {
        avgFaithfulness: number
        avgCompleteness: number
        avgRelevance: number
        avgClarity: number
        avgFactualAccuracy: number
        avgOverallQuality: number
        totalEvaluations: number
        successfulEvaluations: number
    } {
        const successful = evaluations.filter(
            (evaluation) => evaluation.metrics.overallQuality.score > 0,
        )
        const count = successful.length

        if (count === 0) {
            return {
                avgFaithfulness: 0,
                avgCompleteness: 0,
                avgRelevance: 0,
                avgClarity: 0,
                avgFactualAccuracy: 0,
                avgOverallQuality: 0,
                totalEvaluations: evaluations.length,
                successfulEvaluations: 0,
            }
        }

        return {
            avgFaithfulness:
                successful.reduce(
                    (sum, evaluation) =>
                        sum + evaluation.metrics.faithfulness.score,
                    0,
                ) / count,
            avgCompleteness:
                successful.reduce(
                    (sum, evaluation) =>
                        sum + evaluation.metrics.completeness.score,
                    0,
                ) / count,
            avgRelevance:
                successful.reduce(
                    (sum, evaluation) =>
                        sum + evaluation.metrics.relevance.score,
                    0,
                ) / count,
            avgClarity:
                successful.reduce(
                    (sum, evaluation) => sum + evaluation.metrics.clarity.score,
                    0,
                ) / count,
            avgFactualAccuracy:
                successful.reduce(
                    (sum, evaluation) =>
                        sum + evaluation.metrics.factualAccuracy.score,
                    0,
                ) / count,
            avgOverallQuality:
                successful.reduce(
                    (sum, evaluation) =>
                        sum + evaluation.metrics.overallQuality.score,
                    0,
                ) / count,
            totalEvaluations: evaluations.length,
            successfulEvaluations: count,
        }
    }
}
