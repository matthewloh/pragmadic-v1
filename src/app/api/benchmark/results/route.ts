import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { type, sessionId, testResult } = body

        if (type === "rag") {
            // Store RAG test result
            const {
                testCase,
                chatId,
                startTime,
                endTime,
                duration,
                success,
                error,
                generatedText,
                tokenUsage,
                finishReason,
                retrievedChunks,
                retrievalMetrics,
                generationMetrics,
            } = testResult

            const { data: ragResult, error: ragError } = await supabase
                .from("rag_test_results")
                .insert({
                    session_id: sessionId,
                    test_case_id: testCase.id,
                    question: testCase.question,
                    category: testCase.category,
                    chat_id: chatId,
                    start_time: new Date(startTime).toISOString(),
                    end_time: new Date(endTime).toISOString(),
                    duration_ms: duration,
                    success,
                    error_message: error,
                    generated_text: generatedText,
                    finish_reason: finishReason,
                    token_usage: tokenUsage,
                    retrieval_metrics: retrievalMetrics,
                    generation_metrics: generationMetrics,
                })
                .select()
                .single()

            if (ragError) {
                console.error("Error storing RAG result:", ragError)
                return NextResponse.json(
                    { error: ragError.message },
                    { status: 500 },
                )
            }

            // Store retrieved chunks
            if (retrievedChunks && retrievedChunks.length > 0) {
                const chunkInserts = retrievedChunks.map(
                    (chunk: any, index: number) => ({
                        rag_result_id: ragResult.id,
                        chunk_id: chunk.chunkId,
                        similarity_score: chunk.similarity || 0,
                        rank_position: index + 1,
                        source_document_id: chunk.sourceDocumentId,
                        file_path: chunk.filePath,
                    }),
                )

                const { error: chunksError } = await supabase
                    .from("retrieved_chunks")
                    .insert(chunkInserts)

                if (chunksError) {
                    console.error(
                        "Error storing retrieved chunks:",
                        chunksError,
                    )
                    // Continue anyway, don't fail the whole request
                }
            }

            return NextResponse.json({ result: ragResult })
        } else if (type === "analytics") {
            // Store Analytics test result
            const {
                testCase,
                chatId,
                startTime,
                endTime,
                duration,
                success,
                error,
                toolsCalled,
                toolAccuracy,
                dataAccuracy,
            } = testResult

            const { data: analyticsResult, error: analyticsError } =
                await supabase
                    .from("analytics_test_results")
                    .insert({
                        session_id: sessionId,
                        test_case_id: testCase.id,
                        query: testCase.query,
                        category: testCase.category,
                        chat_id: chatId,
                        start_time: new Date(startTime).toISOString(),
                        end_time: new Date(endTime).toISOString(),
                        duration_ms: duration,
                        success,
                        error_message: error,
                        tools_called: toolsCalled,
                        tool_accuracy: toolAccuracy,
                        data_accuracy: dataAccuracy,
                    })
                    .select()
                    .single()

            if (analyticsError) {
                console.error("Error storing analytics result:", analyticsError)
                return NextResponse.json(
                    { error: analyticsError.message },
                    { status: 500 },
                )
            }

            return NextResponse.json({ result: analyticsResult })
        }

        return NextResponse.json(
            { error: "Invalid result type" },
            { status: 400 },
        )
    } catch (error) {
        console.error("Error in benchmark results storage:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get("sessionId")
        const type = searchParams.get("type") // 'rag' or 'analytics'

        if (!sessionId) {
            return NextResponse.json(
                { error: "Session ID required" },
                { status: 400 },
            )
        }

        if (type === "rag") {
            const { data, error } = await supabase
                .from("rag_test_results")
                .select(
                    `
                    *,
                    retrieved_chunks (*)
                `,
                )
                .eq("session_id", sessionId)
                .order("created_at", { ascending: true })

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 },
                )
            }

            return NextResponse.json({ results: data })
        } else if (type === "analytics") {
            const { data, error } = await supabase
                .from("analytics_test_results")
                .select("*")
                .eq("session_id", sessionId)
                .order("created_at", { ascending: true })

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 },
                )
            }

            return NextResponse.json({ results: data })
        } else {
            // Get both types
            const [ragResults, analyticsResults] = await Promise.all([
                supabase
                    .from("rag_test_results")
                    .select(
                        `
                        *,
                        retrieved_chunks (*)
                    `,
                    )
                    .eq("session_id", sessionId)
                    .order("created_at", { ascending: true }),
                supabase
                    .from("analytics_test_results")
                    .select("*")
                    .eq("session_id", sessionId)
                    .order("created_at", { ascending: true }),
            ])

            return NextResponse.json({
                ragResults: ragResults.data || [],
                analyticsResults: analyticsResults.data || [],
            })
        }
    } catch (error) {
        console.error("Error in benchmark results retrieval:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}
