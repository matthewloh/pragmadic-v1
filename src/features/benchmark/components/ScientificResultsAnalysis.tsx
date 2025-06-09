"use client"

import React, { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query"
import {
    BarChart,
    Brain,
    Calculator,
    Download,
    FileText,
    TrendingUp,
    Loader2,
    Copy,
    CheckCircle,
} from "lucide-react"
import { RAGTestResult, AnalyticsTestResult } from "../types"
import {
    scientificMetricsService,
    ScientificAnalysisSession,
} from "../services/scientificMetricsService"
import {
    ScientificMetricsCalculator,
    ScientificMetrics,
} from "../utils/scientificMetrics"

interface ScientificResultsAnalysisProps {
    ragResults: RAGTestResult[]
    analyticsResults: AnalyticsTestResult[]
    modelName: string
    modelLabel?: string
    sessionId?: string
    scientificMetrics?: ScientificMetrics
}

export function ScientificResultsAnalysis({
    ragResults,
    analyticsResults,
    modelName,
    modelLabel,
    sessionId,
    scientificMetrics: providedMetrics,
}: ScientificResultsAnalysisProps) {
    const [analysisSession, setAnalysisSession] =
        useState<ScientificAnalysisSession | null>(null)
    const [comparisonSessionId, setComparisonSessionId] = useState<string>("")
    const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95)
    const [loading, setLoading] = useState(false)
    const [copiedSummary, setCopiedSummary] = useState(false)

    // Get available sessions for comparison
    const { data: availableSessions } = useQuery({
        queryKey: ["available-sessions"],
        queryFn: () =>
            scientificMetricsService.getAvailableSessionsForAnalysis(),
    })

    // Use provided metrics or calculate them
    const metrics = React.useMemo(() => {
        if (providedMetrics) {
            return providedMetrics
        }
        return ScientificMetricsCalculator.calculateComprehensiveMetrics(
            ragResults,
            analyticsResults,
            confidenceLevel,
        )
    }, [providedMetrics, ragResults, analyticsResults, confidenceLevel])

    // Calculate alternative task-based metrics
    const taskMetrics = React.useMemo(() => {
        return ScientificMetricsCalculator.calculateTaskCompletionMetrics(ragResults, analyticsResults)
    }, [ragResults, analyticsResults])

    const uxMetrics = React.useMemo(() => {
        return ScientificMetricsCalculator.calculateUserExperienceMetrics(ragResults)
    }, [ragResults])

    const generateScientificAnalysis = async () => {
        if (!sessionId) {
            alert("Session ID required for detailed scientific analysis")
            return
        }

        setLoading(true)
        try {
            const analysis =
                await scientificMetricsService.calculateMetricsForSession(
                    sessionId,
                    confidenceLevel,
                )
            setAnalysisSession(analysis)
        } catch (error) {
            console.error("Failed to generate scientific analysis:", error)
            alert(
                "Failed to generate analysis: " +
                    (error instanceof Error ? error.message : String(error)),
            )
        } finally {
            setLoading(false)
        }
    }

    const copyPaperSummary = async () => {
        let summaryText = ""

        if (analysisSession?.paperSummary) {
            summaryText = analysisSession.paperSummary
        } else {
            // Generate immediate paper summary from current metrics
            summaryText = ScientificMetricsCalculator.exportMetricsForPaper(
                metrics,
                modelLabel || modelName,
            )
        }

        if (summaryText) {
            await navigator.clipboard.writeText(summaryText)
            setCopiedSummary(true)
            setTimeout(() => setCopiedSummary(false), 2000)
        }
    }

    const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`
    const formatDuration = (ms: number) =>
        ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`

    return (
        <div className="space-y-6">
            {/* Analysis Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Scientific Analysis Controls
                    </CardTitle>
                    <CardDescription>
                        Generate rigorous statistical analysis for your CITIC
                        2025 conference paper
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium">
                                Confidence Level
                            </label>
                            <Select
                                value={confidenceLevel.toString()}
                                onValueChange={(value) =>
                                    setConfidenceLevel(parseFloat(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0.90">
                                        90% Confidence
                                    </SelectItem>
                                    <SelectItem value="0.95">
                                        95% Confidence (Standard)
                                    </SelectItem>
                                    <SelectItem value="0.99">
                                        99% Confidence
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={generateScientificAnalysis}
                                disabled={loading || !sessionId}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Brain className="h-4 w-4" />
                                )}
                                {loading
                                    ? "Analyzing..."
                                    : "Generate Scientific Analysis"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="metrics" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="metrics">Core Metrics</TabsTrigger>
                    <TabsTrigger value="alternative">
                        Task-Based Metrics
                    </TabsTrigger>
                    <TabsTrigger value="statistical">
                        Statistical Analysis
                    </TabsTrigger>
                    <TabsTrigger value="paper">Paper Summary</TabsTrigger>
                    <TabsTrigger value="comparison">
                        Model Comparison
                    </TabsTrigger>
                </TabsList>

                {/* Core Metrics Tab */}
                <TabsContent value="metrics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Retrieval Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Retrieval Performance
                                </CardTitle>
                                <CardDescription>
                                    Information Retrieval Metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Precision@3:</span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                metrics.precisionAtK.k3,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Precision@5:</span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                metrics.precisionAtK.k5,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Precision@10:</span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                metrics.precisionAtK.k10,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Recall:</span>
                                        <span className="font-mono">
                                            {formatPercentage(metrics.recall)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>F1-Score:</span>
                                        <span className="font-mono">
                                            {formatPercentage(metrics.f1Score)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hit Rate:</span>
                                        <span className="font-mono">
                                            {formatPercentage(metrics.hitRate)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>MRR:</span>
                                        <span className="font-mono">
                                            {metrics.meanReciprocalRank.toFixed(
                                                3,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg Similarity:</span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                metrics.averageSimilarityScore,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {metrics.hitRate === 0 &&
                                    metrics.precisionAtK.k5 === 0 && (
                                        <div className="mt-3 rounded border border-orange-200 bg-orange-50 p-2 text-sm text-orange-800">
                                            ⚠️ Low retrieval scores may indicate
                                            ground truth chunk IDs don&apos;t
                                            match retrieved chunks. Check
                                            console for debugging info.
                                        </div>
                                    )}

                                {metrics.sampleSize === 1 && (
                                    <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">
                                        💡 Single test mode: Run multiple tests
                                        for more robust statistical analysis.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Generation Quality */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Generation Quality
                                </CardTitle>
                                <CardDescription>
                                    Natural Language Generation Assessment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Faithfulness:</span>
                                        <span className="font-mono">
                                            {metrics.faithfulness.mean.toFixed(
                                                1,
                                            )}
                                            /5.0
                                            <span className="ml-1 text-xs text-muted-foreground">
                                                (±
                                                {(
                                                    metrics.faithfulness
                                                        .confidenceInterval[1] -
                                                    metrics.faithfulness.mean
                                                ).toFixed(1)}
                                                )
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Relevance:</span>
                                        <span className="font-mono">
                                            {metrics.relevance.mean.toFixed(1)}
                                            /5.0
                                            <span className="ml-1 text-xs text-muted-foreground">
                                                (±
                                                {(
                                                    metrics.relevance
                                                        .confidenceInterval[1] -
                                                    metrics.relevance.mean
                                                ).toFixed(1)}
                                                )
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Completeness:</span>
                                        <span className="font-mono">
                                            {metrics.completeness.mean.toFixed(
                                                1,
                                            )}
                                            /5.0
                                            <span className="ml-1 text-xs text-muted-foreground">
                                                (±
                                                {(
                                                    metrics.completeness
                                                        .confidenceInterval[1] -
                                                    metrics.completeness.mean
                                                ).toFixed(1)}
                                                )
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="text-xs text-muted-foreground">
                                        Confidence intervals at{" "}
                                        {formatPercentage(confidenceLevel)}{" "}
                                        level
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    System Performance
                                </CardTitle>
                                <CardDescription>
                                    Operational Efficiency Metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Mean Response Time:</span>
                                        <span className="font-mono">
                                            {formatDuration(
                                                metrics.responseTime.mean,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Median Response Time:</span>
                                        <span className="font-mono">
                                            {formatDuration(
                                                metrics.responseTime.median,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>95th Percentile:</span>
                                        <span className="font-mono">
                                            {formatDuration(
                                                metrics.responseTime.p95,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg Tokens/Query:</span>
                                        <span className="font-mono">
                                            {Math.round(
                                                metrics.tokenEfficiency
                                                    .meanTokensPerQuery,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Est. Cost/Query:</span>
                                        <span className="font-mono">
                                            $
                                            {metrics.tokenEfficiency.costPerQuery.toFixed(
                                                4,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Error Analysis
                                </CardTitle>
                                <CardDescription>
                                    Failure Mode Assessment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Error Rate:</span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                metrics.errorAnalysis.errorRate,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Errors:</span>
                                        <span className="font-mono">
                                            {metrics.errorAnalysis.totalErrors}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sample Size:</span>
                                        <span className="font-mono">
                                            {metrics.sampleSize}
                                        </span>
                                    </div>
                                </div>
                                {metrics.errorAnalysis.commonFailureModes
                                    .length > 0 && (
                                    <div className="border-t pt-2">
                                        <div className="mb-2 text-sm font-medium">
                                            Common Failure Modes:
                                        </div>
                                        <div className="space-y-1">
                                            {metrics.errorAnalysis.commonFailureModes
                                                .slice(0, 3)
                                                .map((mode, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="text-xs"
                                                    >
                                                        <span className="font-medium">
                                                            {mode.type}:
                                                        </span>{" "}
                                                        {mode.frequency} cases
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Alternative Task-Based Metrics Tab */}
                <TabsContent value="alternative" className="space-y-4">
                    <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        💡 These metrics focus on system effectiveness and user experience, independent of ground truth chunk matching.
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* System Effectiveness */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">System Effectiveness</CardTitle>
                                <CardDescription>Task completion and reliability metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>System Availability:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.systemAvailability)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Questions Answered:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.questionsWithAnswers)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Documents Retrieved:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.documentsRetrieved)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>High Confidence Retrievals:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.highConfidenceRetrievals)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Response Completeness:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.responseCompleteness)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Experience */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">User Experience</CardTitle>
                                <CardDescription>Responsiveness and information quality</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Fast Responses (&lt;10s):</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.responsiveness.under10s)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Detailed Responses:</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.informationRichness.detailedResponses)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Cited Sources:</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.informationRichness.citedSources)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Structured Answers:</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.informationRichness.structuredAnswers)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Appropriate Length:</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.reliability.appropriateLength)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Performance Analysis</CardTitle>
                                <CardDescription>Efficiency and resource utilization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Average Response Length:</span>
                                        <span className="font-mono">{Math.round(taskMetrics.averageResponseLength)} chars</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Chunks Retrieved:</span>
                                        <span className="font-mono">{taskMetrics.averageChunksRetrieved.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Efficient Token Usage:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.efficientTokenUsage)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tool Invocation Success:</span>
                                        <span className="font-mono">{formatPercentage(taskMetrics.toolInvocationSuccess)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Tools/Query:</span>
                                        <span className="font-mono">{taskMetrics.averageToolsPerQuery.toFixed(1)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quality Assurance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quality Assurance</CardTitle>
                                <CardDescription>Reliability and consistency metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>No Hallucinations:</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.reliability.noHallucinations)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Response Times:</span>
                                        <div className="text-right">
                                            <div className="font-mono text-xs">
                                                &lt;5s: {formatPercentage(uxMetrics.responsiveness.under5s)}
                                            </div>
                                            <div className="font-mono text-xs">
                                                &lt;30s: {formatPercentage(uxMetrics.responsiveness.under30s)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Consistent Tone:</span>
                                        <span className="font-mono">{formatPercentage(uxMetrics.reliability.consistentToneAndStyle)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-800">
                                    📊 These metrics can be directly reported in your conference paper as they measure real system performance.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Statistical Analysis Tab */}
                <TabsContent value="statistical" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Statistical Significance Analysis
                            </CardTitle>
                            <CardDescription>
                                Detailed statistical metrics for peer review
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="mb-3 font-medium">
                                        Performance by Category
                                    </h4>
                                    <div className="space-y-3">
                                        {Object.entries(
                                            metrics.categoryPerformance,
                                        ).map(([category, perf]) => (
                                            <div
                                                key={category}
                                                className="rounded border p-3"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-medium capitalize">
                                                        {category.replace(
                                                            "-",
                                                            " ",
                                                        )}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            perf.hitRate >= 0.8
                                                                ? "default"
                                                                : perf.hitRate >=
                                                                    0.6
                                                                  ? "secondary"
                                                                  : "destructive"
                                                        }
                                                    >
                                                        {formatPercentage(
                                                            perf.hitRate,
                                                        )}{" "}
                                                        hit rate
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                    <div>
                                                        Tests: {perf.count}
                                                    </div>
                                                    <div>
                                                        Error Rate:{" "}
                                                        {formatPercentage(
                                                            perf.errorRate,
                                                        )}
                                                    </div>
                                                    <div>
                                                        Faithfulness:{" "}
                                                        {perf.averageScores.faithfulness.toFixed(
                                                            1,
                                                        )}
                                                        /5.0
                                                    </div>
                                                    <div>
                                                        Relevance:{" "}
                                                        {perf.averageScores.relevance.toFixed(
                                                            1,
                                                        )}
                                                        /5.0
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 font-medium">
                                        Confidence Intervals
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="rounded border p-3">
                                            <div className="mb-1 text-sm font-medium">
                                                Faithfulness (
                                                {formatPercentage(
                                                    confidenceLevel,
                                                )}{" "}
                                                CI)
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                [
                                                {metrics.faithfulness.confidenceInterval[0].toFixed(
                                                    2,
                                                )}
                                                ,{" "}
                                                {metrics.faithfulness.confidenceInterval[1].toFixed(
                                                    2,
                                                )}
                                                ]
                                            </div>
                                            <div className="text-xs">
                                                σ ={" "}
                                                {metrics.faithfulness.std.toFixed(
                                                    2,
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded border p-3">
                                            <div className="mb-1 text-sm font-medium">
                                                Relevance (
                                                {formatPercentage(
                                                    confidenceLevel,
                                                )}{" "}
                                                CI)
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                [
                                                {metrics.relevance.confidenceInterval[0].toFixed(
                                                    2,
                                                )}
                                                ,{" "}
                                                {metrics.relevance.confidenceInterval[1].toFixed(
                                                    2,
                                                )}
                                                ]
                                            </div>
                                            <div className="text-xs">
                                                σ ={" "}
                                                {metrics.relevance.std.toFixed(
                                                    2,
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded border p-3">
                                            <div className="mb-1 text-sm font-medium">
                                                Completeness (
                                                {formatPercentage(
                                                    confidenceLevel,
                                                )}{" "}
                                                CI)
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                [
                                                {metrics.completeness.confidenceInterval[0].toFixed(
                                                    2,
                                                )}
                                                ,{" "}
                                                {metrics.completeness.confidenceInterval[1].toFixed(
                                                    2,
                                                )}
                                                ]
                                            </div>
                                            <div className="text-xs">
                                                σ ={" "}
                                                {metrics.completeness.std.toFixed(
                                                    2,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Paper Summary Tab */}
                <TabsContent value="paper" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Conference Paper Summary
                            </CardTitle>
                            <CardDescription>
                                Formatted metrics ready for your CITIC 2025
                                submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="mb-4 flex items-center gap-2">
                                <Button
                                    onClick={copyPaperSummary}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    {copiedSummary ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    {copiedSummary
                                        ? "Copied!"
                                        : "Copy Paper Metrics"}
                                </Button>
                                <Badge variant="outline">
                                    Sample Size: {metrics.sampleSize}
                                </Badge>
                                <Badge variant="outline">
                                    {formatPercentage(metrics.confidenceLevel)}{" "}
                                    Confidence
                                </Badge>
                                {sessionId && (
                                    <Button
                                        onClick={generateScientificAnalysis}
                                        disabled={loading}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        {loading
                                            ? "Generating..."
                                            : "Enhanced Analysis"}
                                    </Button>
                                )}
                            </div>

                            <Textarea
                                value={
                                    analysisSession?.paperSummary ||
                                    ScientificMetricsCalculator.exportMetricsForPaper(
                                        metrics,
                                        modelLabel || modelName,
                                    )
                                }
                                readOnly
                                className="min-h-[400px] font-mono text-sm"
                                placeholder="Generating paper summary..."
                            />

                            {!analysisSession && (
                                <div className="rounded bg-muted/50 p-3 text-xs text-muted-foreground">
                                    💡 This summary is generated from your
                                    current test results.
                                    {sessionId &&
                                        " Click 'Enhanced Analysis' for database-backed metrics with additional features."}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Comparison Tab */}
                <TabsContent value="comparison" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Model Comparison
                            </CardTitle>
                            <CardDescription>
                                Compare performance against other benchmark
                                sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {availableSessions &&
                            availableSessions.length > 1 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Compare with Session:
                                        </label>
                                        <Select
                                            value={comparisonSessionId}
                                            onValueChange={
                                                setComparisonSessionId
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a session to compare..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSessions
                                                    .filter(
                                                        (session) =>
                                                            session.id !==
                                                            sessionId,
                                                    )
                                                    .map((session) => (
                                                        <SelectItem
                                                            key={session.id}
                                                            value={session.id}
                                                        >
                                                            {session.modelLabel ||
                                                                session.modelName}{" "}
                                                            -{" "}
                                                            {new Date(
                                                                session.timestamp,
                                                            ).toLocaleDateString()}{" "}
                                                            (
                                                            {session.totalTests}{" "}
                                                            tests)
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        disabled={
                                            !comparisonSessionId || !sessionId
                                        }
                                        onClick={async () => {
                                            // TODO: Implement comparison
                                            alert(
                                                "Model comparison feature coming soon!",
                                            )
                                        }}
                                    >
                                        Generate Comparison
                                    </Button>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <BarChart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        Run more benchmark sessions to enable
                                        model comparison
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
