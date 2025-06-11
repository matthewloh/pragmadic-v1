import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = createServerClient()
    const { sessionId } = params

    // Fetch session data
    const { data: session, error: sessionError } = await supabase
      .from('benchmark_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError) {
      console.error('Error fetching session:', sessionError)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Fetch RAG test results with retrieved chunks
    const { data: ragResults, error: ragError } = await supabase
      .from('rag_test_results')
      .select(`
        *,
        retrieved_chunks (
          chunk_id,
          similarity_score,
          rank_position,
          source_document_id,
          file_path
        )
      `)
      .eq('session_id', sessionId)
      .order('created_at')

    if (ragError) {
      console.error('Error fetching RAG results:', ragError)
      return NextResponse.json({ error: 'Failed to fetch RAG results' }, { status: 500 })
    }

    // Fetch Analytics test results
    const { data: analyticsResults, error: analyticsError } = await supabase
      .from('analytics_test_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at')

    if (analyticsError) {
      console.error('Error fetching analytics results:', analyticsError)
      return NextResponse.json({ error: 'Failed to fetch analytics results' }, { status: 500 })
    }

    // Transform session data
    const transformedSession = {
      sessionId: session.id,
      modelName: session.model_name,
      modelLabel: session.model_label,
      provider: session.provider,
      timestamp: session.timestamp,
      testSubsetType: session.test_subset_type,
      totalRAGTests: session.total_rag_tests,
      totalAnalyticsTests: session.total_analytics_tests,
      status: session.status
    }

    // Transform RAG results
    const transformedRAGResults = ragResults.map(result => ({
      id: result.id,
      sessionId: result.session_id,
      testCaseId: result.test_case_id,
      question: result.question,
      category: result.category,
      chatId: result.chat_id,
      startTime: result.start_time,
      endTime: result.end_time,
      durationMs: result.duration_ms,
      success: result.success,
      errorMessage: result.error_message,
      generatedText: result.generated_text,
      finishReason: result.finish_reason,
      tokenUsage: result.token_usage,
      retrievalMetrics: result.retrieval_metrics,
      generationMetrics: result.generation_metrics,
      retrievedChunks: result.retrieved_chunks?.map((chunk: any) => ({
        chunkId: chunk.chunk_id,
        similarityScore: parseFloat(chunk.similarity_score),
        rankPosition: chunk.rank_position,
        sourceDocumentId: chunk.source_document_id,
        filePath: chunk.file_path
      })) || []
    }))

    // Transform Analytics results
    const transformedAnalyticsResults = analyticsResults.map(result => ({
      id: result.id,
      sessionId: result.session_id,
      testCaseId: result.test_case_id,
      query: result.query,
      category: result.category,
      chatId: result.chat_id,
      startTime: result.start_time,
      endTime: result.end_time,
      durationMs: result.duration_ms,
      success: result.success,
      errorMessage: result.error_message,
      toolsCalled: result.tools_called,
      toolAccuracy: result.tool_accuracy,
      dataAccuracy: result.data_accuracy
    }))

    return NextResponse.json({
      session: transformedSession,
      ragResults: transformedRAGResults,
      analyticsResults: transformedAnalyticsResults
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 