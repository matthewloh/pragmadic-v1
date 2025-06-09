"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { Eye, Clock, Database, Brain, Loader2 } from "lucide-react"
import { useState } from "react"
import { benchmarkStorage, BenchmarkSession, StoredBenchmarkResults } from "../services/benchmarkStorage"
import { BenchmarkResultsDisplay } from "./BenchmarkResultsDisplay"

export function BenchmarkHistory() {
    const [selectedSession, setSelectedSession] = useState<string | null>(null)
    const [loadedResults, setLoadedResults] = useState<StoredBenchmarkResults | null>(null)
    const [loadingResults, setLoadingResults] = useState(false)

    const { data: sessions, isLoading, refetch } = useQuery({
        queryKey: ["benchmark-sessions"],
        queryFn: () => benchmarkStorage.getRecentSessions(20),
    })

    const loadSessionResults = async (sessionId: string) => {
        setLoadingResults(true)
        try {
            const { session, ragResults, analyticsResults } = await benchmarkStorage.getSession(sessionId)
            const transformedResults = benchmarkStorage.transformStoredResults(
                session,
                ragResults,
                analyticsResults
            )
            setLoadedResults(transformedResults)
            setSelectedSession(sessionId)
        } catch (error) {
            console.error('Failed to load session results:', error)
            alert('Failed to load session results: ' + (error instanceof Error ? error.message : String(error)))
        } finally {
            setLoadingResults(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'default'
            case 'running': return 'secondary'
            case 'failed': return 'destructive'
            default: return 'outline'
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Benchmark History
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading benchmark history...</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Benchmark History
                </CardTitle>
                <CardDescription>
                    View and compare results from previous benchmark runs
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="sessions" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
                        {loadedResults && (
                            <TabsTrigger value="results">
                                Session Results ({loadedResults.session.model_label || loadedResults.session.model_name})
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="sessions" className="space-y-4">
                        {!sessions || sessions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No benchmark sessions found.</p>
                                <p className="text-sm">Run your first benchmark to see results here.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {sessions.map((session: BenchmarkSession) => (
                                    <Card key={session.id} className="border-l-4 border-l-primary/20">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Brain className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium">
                                                                    {session.model_label || session.model_name}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {session.test_subset_type === 'single-analytics' 
                                                                        ? `Single Analytics Test (${session.total_analytics_tests || 0} test)`
                                                                        : session.test_subset_type === 'single-rag'
                                                                        ? `Single RAG Test (${session.total_rag_tests || 0} test)`
                                                                        : `${session.total_rag_tests || 0} RAG + ${session.total_analytics_tests || 0} Analytics tests`
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-medium">
                                                                    {new Date(session.created_at).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {new Date(session.created_at).toLocaleTimeString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getStatusColor(session.status)}>
                                                        {session.status}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => loadSessionResults(session.id)}
                                                        disabled={loadingResults || session.status !== 'completed'}
                                                    >
                                                        {loadingResults && selectedSession === session.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                        <span className="ml-1">View Results</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">RAG Tests:</span>
                                                    <div className="font-medium">{session.total_rag_tests}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Analytics Tests:</span>
                                                    <div className="font-medium">{session.total_analytics_tests}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Test Type:</span>
                                                    <div className="font-medium capitalize">{session.test_subset_type}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Documents:</span>
                                                    <div className="font-medium">{session.selected_documents?.length || 0}</div>
                                                </div>
                                            </div>
                                            
                                            {session.status === 'failed' && (
                                                <div className="mt-3 p-2 rounded bg-destructive/10 text-destructive text-sm">
                                                    This session failed to complete. Some results may be missing.
                                                </div>
                                            )}
                                            
                                            {session.status === 'running' && (
                                                <div className="mt-3 p-2 rounded bg-yellow-100 text-yellow-800 text-sm">
                                                    This session is still running. Results will be available when complete.
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex justify-center">
                            <Button variant="outline" onClick={() => refetch()}>
                                <Clock className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </TabsContent>

                    {loadedResults && (
                        <TabsContent value="results">
                            <BenchmarkResultsDisplay results={loadedResults} />
                        </TabsContent>
                    )}
                </Tabs>
            </CardContent>
        </Card>
    )
} 