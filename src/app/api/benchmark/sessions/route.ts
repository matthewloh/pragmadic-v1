import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: sessions, error } = await supabase
            .from("benchmark_sessions")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching benchmark sessions:", error)
            return NextResponse.json(
                { error: "Failed to fetch sessions" },
                { status: 500 },
            )
        }

        // Transform to match expected interface
        const transformedSessions = sessions.map((session) => ({
            sessionId: session.id,
            modelName: session.model_name,
            modelLabel: session.model_label,
            provider: session.provider,
            timestamp: session.timestamp,
            testSubsetType: session.test_subset_type,
            totalRAGTests: session.total_rag_tests,
            totalAnalyticsTests: session.total_analytics_tests,
            status: session.status,
        }))

        return NextResponse.json(transformedSessions)
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}
