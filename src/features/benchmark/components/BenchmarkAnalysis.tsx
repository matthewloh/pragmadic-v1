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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { ScientificMetricsService } from "../services/scientificMetricsService"
import { Loader2, BarChart3, FileText, Copy, CheckCircle } from "lucide-react"

export function BenchmarkAnalysis() {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [copiedPaper, setCopiedPaper] = useState(false)

    // Fetch all benchmark sessions
    const { data: sessions, isLoading: sessionsLoading } = useQuery({
        queryKey: ['benchmark-sessions'],
        queryFn: () => ScientificMetricsService.getBenchmarkSessions(),
    })

    // Fetch detailed analysis for selected session
    const { data: sessionAnalysis, isLoading: analysisLoading } = useQuery({
        queryKey: ['session-analysis', selectedSessionId],
        queryFn: () => selectedSessionId 
            ? ScientificMetricsService.calculateSessionScientificMetrics(selectedSessionId)
            : null,
        enabled: !!selectedSessionId,
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    const copyPaperSummary = async () => {
        if (sessionAnalysis?.paperSummary) {
            await navigator.clipboard.writeText(sessionAnalysis.paperSummary)
            setCopiedPaper(true)
            setTimeout(() => setCopiedPaper(false), 2000)
        }
    }

    if (sessionsLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading benchmark sessions...</span>
                </CardContent>
            </Card>
        )
    }

    if (!sessions || sessions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Benchmark Data Found</CardTitle>
                    <CardDescription>
                        Run some benchmarks first to see scientific analysis here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Use the Benchmark Runner above to create some test sessions, then return here for detailed scientific analysis.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Scientific Benchmark Analysis
                    </CardTitle>
                    <CardDescription>
                        Analyze your existing benchmark sessions with scientific metrics for your conference paper
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sessions" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="sessions">Sessions</TabsTrigger>
                            <TabsTrigger value="analysis" disabled={!selectedSessionId}>
                                Analysis
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="sessions">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Available Sessions</h3>
                                    <Badge variant="secondary">
                                        {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                                
                                <ScrollArea className="h-96">
                                    <div className="space-y-3">
                                        {sessions.map((session) => (
                                            <Card 
                                                key={session.sessionId}
                                                className={`cursor-pointer transition-colors ${
                                                    selectedSessionId === session.sessionId 
                                                        ? 'border-primary bg-primary/5' 
                                                        : 'hover:bg-muted/50'
                                                }`}
                                                onClick={() => setSelectedSessionId(session.sessionId)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={
                                                                session.status === 'completed' ? 'default' :
                                                                session.status === 'failed' ? 'destructive' : 'secondary'
                                                            }>
                                                                {session.status}
                                                            </Badge>
                                                            <span className="font-medium">
                                                                {session.modelLabel || session.modelName}
                                                            </span>
                                                            {session.provider && (
                                                                <Badge variant="outline">{session.provider}</Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(session.timestamp)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span>RAG Tests: {session.totalRAGTests}</span>
                                                        <span>Analytics Tests: {session.totalAnalyticsTests}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {session.testSubsetType}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="mt-2 text-xs text-muted-foreground font-mono">
                                                        ID: {session.sessionId}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </TabsContent>

                        <TabsContent value="analysis">
                            {analysisLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="ml-2">Calculating scientific metrics...</span>
                                </div>
                            ) : sessionAnalysis ? (
                                <div className="space-y-6">
                                    {/* Session Summary */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                Session Analysis
                                                <Button
                                                    onClick={copyPaperSummary}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2"
                                                >
                                                    {copiedPaper ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <FileText className="h-4 w-4" />
                                                    )}
                                                    {copiedPaper ? 'Copied!' : 'Copy for Paper'}
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>
                                                Model: {sessionAnalysis.session.modelLabel || sessionAnalysis.session.modelName}
                                                {sessionAnalysis.session.provider && ` (${sessionAnalysis.session.provider})`}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-primary">
                                                        {sessionAnalysis.scientificMetrics.f1Score.toFixed(3)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">F1-Score</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {sessionAnalysis.scientificMetrics.precision.toFixed(3)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Precision</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {sessionAnalysis.scientificMetrics.recall.toFixed(3)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Recall</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {sessionAnalysis.scientificMetrics.meanReciprocalRank.toFixed(3)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">MRR</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Statistical Analysis */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Statistical Analysis</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">Confidence Intervals (95%)</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Precision:</span>
                                                            <span className="font-mono">
                                                                [{sessionAnalysis.scientificMetrics.confidenceIntervals.precision.lower.toFixed(3)}, 
                                                                 {sessionAnalysis.scientificMetrics.confidenceIntervals.precision.upper.toFixed(3)}]
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Recall:</span>
                                                            <span className="font-mono">
                                                                [{sessionAnalysis.scientificMetrics.confidenceIntervals.recall.lower.toFixed(3)}, 
                                                                 {sessionAnalysis.scientificMetrics.confidenceIntervals.recall.upper.toFixed(3)}]
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>F1-Score:</span>
                                                            <span className="font-mono">
                                                                [{sessionAnalysis.scientificMetrics.confidenceIntervals.f1Score.lower.toFixed(3)}, 
                                                                 {sessionAnalysis.scientificMetrics.confidenceIntervals.f1Score.upper.toFixed(3)}]
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Sample Characteristics</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Sample Size:</span>
                                                            <span className="font-mono">{sessionAnalysis.scientificMetrics.sampleSize}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Standard Error:</span>
                                                            <span className="font-mono">{sessionAnalysis.scientificMetrics.standardError.toFixed(4)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Confidence Level:</span>
                                                            <span className="font-mono">{(sessionAnalysis.scientificMetrics.confidenceLevel * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Paper Summary */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Conference Paper Summary</CardTitle>
                                            <CardDescription>
                                                Ready-to-use text for your CITIC 2025 submission
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="rounded bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
                                                {sessionAnalysis.paperSummary}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <p className="text-muted-foreground">Select a session from the Sessions tab to view analysis</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
} 