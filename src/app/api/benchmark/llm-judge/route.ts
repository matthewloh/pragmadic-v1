import { NextRequest, NextResponse } from "next/server"
import { LLMJudgeService } from "@/features/benchmark/services/llmJudgeService"
import { RAGTestCase } from "@/features/benchmark/types"

export async function POST(request: NextRequest) {
    try {
        const {
            testCase,
            generatedAnswer,
            retrievedChunks,
        }: {
            testCase: RAGTestCase
            generatedAnswer: string
            retrievedChunks: any[]
        } = await request.json()

        if (!testCase || !generatedAnswer || !Array.isArray(retrievedChunks)) {
            return NextResponse.json(
                {
                    error: "Missing required fields: testCase, generatedAnswer, retrievedChunks",
                },
                { status: 400 },
            )
        }

        // Run LLM Judge evaluation on server-side where GROQ_API_KEY is available
        const evaluation = await LLMJudgeService.evaluateGeneration(
            testCase,
            generatedAnswer,
            retrievedChunks,
        )

        return NextResponse.json({ evaluation })
    } catch (error) {
        console.error("LLM Judge API error:", error)

        // Return a structured error response
        return NextResponse.json(
            {
                error: "LLM Judge evaluation failed",
                details: error instanceof Error ? error.message : String(error),
                evaluation: null,
            },
            { status: 500 },
        )
    }
}
