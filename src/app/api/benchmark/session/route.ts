import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const {
            model_name,
            model_label,
            provider,
            selected_documents,
            test_subset_type,
            total_rag_tests,
            total_analytics_tests,
        } = body

        const { data, error } = await supabase
            .from("benchmark_sessions")
            .insert({
                model_name,
                model_label,
                provider,
                selected_documents,
                test_subset_type,
                total_rag_tests,
                total_analytics_tests,
                status: "running",
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating benchmark session:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ session: data })
    } catch (error) {
        console.error("Error in benchmark session creation:", error)
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
        const limit = parseInt(searchParams.get("limit") || "10")

        if (sessionId) {
            // Get specific session with related data
            const { data: session, error: sessionError } = await supabase
                .from("benchmark_sessions")
                .select("*")
                .eq("id", sessionId)
                .single()

            if (sessionError) {
                return NextResponse.json(
                    { error: sessionError.message },
                    { status: 404 },
                )
            }

            // Get RAG results for this session
            const { data: ragResults, error: ragError } = await supabase
                .from("rag_test_results")
                .select(
                    `
                    *,
                    retrieved_chunks (*)
                `,
                )
                .eq("session_id", sessionId)
                .order("created_at", { ascending: true })

            // Get analytics results for this session
            const { data: analyticsResults, error: analyticsError } =
                await supabase
                    .from("analytics_test_results")
                    .select("*")
                    .eq("session_id", sessionId)
                    .order("created_at", { ascending: true })

            if (ragError || analyticsError) {
                console.error(
                    "Error fetching test results:",
                    ragError || analyticsError,
                )
            }

            return NextResponse.json({
                session,
                ragResults: ragResults || [],
                analyticsResults: analyticsResults || [],
            })
        } else {
            // Get recent sessions
            const { data, error } = await supabase
                .from("benchmark_sessions")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(limit)

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 },
                )
            }

            return NextResponse.json({ sessions: data })
        }
    } catch (error) {
        console.error("Error in benchmark session retrieval:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { sessionId, status, ...updates } = body

        const { data, error } = await supabase
            .from("benchmark_sessions")
            .update({
                status,
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", sessionId)
            .select()
            .single()

        if (error) {
            console.error("Error updating benchmark session:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ session: data })
    } catch (error) {
        console.error("Error in benchmark session update:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}
