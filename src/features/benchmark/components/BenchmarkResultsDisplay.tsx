"use client"

import { BenchmarkResults } from "../types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    CheckCircle,
    XCircle,
    Clock,
    Zap,
    Target,
    Database,
    Brain,
    FileText,
    Copy,
} from "lucide-react"
import { ScientificResultsAnalysis } from "./ScientificResultsAnalysis"
import { ScientificMetricsCalculator } from "../utils/scientificMetrics"
import React from "react"
import { Button } from "@/components/ui/button"

interface BenchmarkResultsDisplayProps {
    results: BenchmarkResults & {
        metadata?: {
            model: string
            modelLabel?: string
            provider?: string
            timestamp?: string
            testSuiteVersion?: string
        }
    }
}

export function BenchmarkResultsDisplay({
    results,
}: BenchmarkResultsDisplayProps) {
    const { ragResults, analyticsResults, summary, metadata } = results
    const [copiedPaper, setCopiedPaper] = React.useState(false)

    // Calculate scientific metrics immediately
    const scientificMetrics = React.useMemo(() => {
        return ScientificMetricsCalculator.calculateComprehensiveMetrics(
            ragResults,
            analyticsResults,
            0.95 // 95% confidence level
        )
    }, [ragResults, analyticsResults])

    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms}ms`
        return `${(ms / 1000).toFixed(1)}s`
    }

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`
    }

    const exportForPaper = async () => {
        const paperSummary = ScientificMetricsCalculator.exportMetricsForPaper(
            scientificMetrics,
            metadata?.modelLabel || metadata?.model || "Unknown Model"
        )
        await navigator.clipboard.writeText(paperSummary)
        setCopiedPaper(true)
        setTimeout(() => setCopiedPaper(false), 2000)
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Benchmark Results
                        {metadata && (
                            <Badge variant="secondary" className="ml-2">
                                <Brain className="mr-1 h-3 w-3" />
                                {metadata.modelLabel || metadata.model}
                            </Badge>
                        )}
                    </CardTitle>
                    <Button
                        onClick={exportForPaper}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        {copiedPaper ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                            <FileText className="h-4 w-4" />
                        )}
                        {copiedPaper ? 'Copied!' : 'Export for Paper'}
                    </Button>
                </div>
                <CardDescription>
                    Quantitative evaluation results for conference paper metrics
                    {metadata && (
                        <span className="mt-1 block text-xs">
                            Model: {metadata.modelLabel || metadata.model}
                            {metadata.provider && ` (${metadata.provider})`}
                            {metadata.timestamp &&
                                ` • ${new Date(metadata.timestamp).toLocaleString()}`}
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="summary">
                            Summary Metrics
                        </TabsTrigger>
                        <TabsTrigger value="scientific">
                            Scientific Analysis
                        </TabsTrigger>
                        <TabsTrigger value="rag-details">
                            RAG Details
                        </TabsTrigger>
                        <TabsTrigger value="analytics-details">
                            Analytics Details
                        </TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* RAG Summary */}
                            {summary.ragMetrics.totalTests > 0 && (
                            <Card className={summary.analyticsMetrics.totalTests === 0 ? "md:col-span-2" : ""}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        RAG Answer Engine
                                        {summary.analyticsMetrics.totalTests === 0 && (
                                            <Badge variant="secondary" className="ml-2">Single Test Mode</Badge>
                                        )}
                                    </CardTitle>
                                    {metadata && (
                                        <CardDescription className="text-xs">
                                            Tested with{" "}
                                            {metadata.modelLabel ||
                                                metadata.model}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Success Rate
                                        </span>
                                        <span className="font-mono">
                                            {summary.ragMetrics.successfulTests}
                                            /{summary.ragMetrics.totalTests}(
                                            {formatPercentage(
                                                summary.ragMetrics
                                                    .successfulTests /
                                                    summary.ragMetrics
                                                        .totalTests,
                                            )}
                                            )
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Database className="h-4 w-4" />
                                            Precision@K
                                        </span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                summary.ragMetrics
                                                    .averagePrecisionAtK,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            Recall
                                        </span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                summary.ragMetrics
                                                    .averageRecall,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Database className="h-4 w-4" />
                                            Hit Rate
                                        </span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                summary.ragMetrics
                                                    .overallHitRate,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Avg Response Time
                                        </span>
                                        <span className="font-mono">
                                            {formatDuration(
                                                summary.ragMetrics
                                                    .averageResponseTime,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Zap className="h-4 w-4" />
                                            Avg Token Usage
                                        </span>
                                        <span className="font-mono">
                                            {Math.round(
                                                summary.ragMetrics
                                                    .averageTokenUsage,
                                            )}{" "}
                                            tokens
                                        </span>
                                    </div>

                                    {/* Generation Quality Metrics */}
                                    <div className="border-t pt-3">
                                        <h4 className="text-sm font-medium mb-2">Generation Quality</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Faithfulness:</span>
                                                <span className="font-mono">{summary.ragMetrics.averageFaithfulness?.toFixed(1) || 'N/A'}/5.0</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Relevance:</span>
                                                <span className="font-mono">{summary.ragMetrics.averageRelevance?.toFixed(1) || 'N/A'}/5.0</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Completeness:</span>
                                                <span className="font-mono">{summary.ragMetrics.averageCompleteness?.toFixed(1) || 'N/A'}/5.0</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Refusal Rate:</span>
                                                <span className="font-mono">{formatPercentage(summary.ragMetrics.correctRefusalRate)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show specific test details for single test mode */}
                                    {summary.analyticsMetrics.totalTests === 0 && ragResults.length === 1 && (
                                        <div className="border-t pt-3">
                                            <h4 className="text-sm font-medium mb-2">Test Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Test ID:</span>
                                                    <span className="font-mono">{ragResults[0].testCase.id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Category:</span>
                                                    <span className="font-mono">{ragResults[0].testCase.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Chunks Retrieved:</span>
                                                    <span className="font-mono">{ragResults[0].retrievedChunks.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Duration:</span>
                                                    <span className="font-mono">{formatDuration(ragResults[0].duration)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tokens Used:</span>
                                                    <span className="font-mono">{ragResults[0].tokenUsage.totalTokens}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            )}

                            {/* Analytics Summary */}
                            <Card className={summary.ragMetrics.totalTests === 0 ? "md:col-span-2" : ""}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        AI-Driven Analytics
                                        {summary.ragMetrics.totalTests === 0 && (
                                            <Badge variant="secondary" className="ml-2">Single Test Mode</Badge>
                                        )}
                                    </CardTitle>
                                    {metadata && (
                                        <CardDescription className="text-xs">
                                            Tested with{" "}
                                            {metadata.modelLabel ||
                                                metadata.model}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Success Rate
                                        </span>
                                        <span className="font-mono">
                                            {
                                                summary.analyticsMetrics
                                                    .successfulTests
                                            }
                                            /
                                            {
                                                summary.analyticsMetrics
                                                    .totalTests
                                            }
                                            (
                                            {formatPercentage(
                                                summary.analyticsMetrics
                                                    .successfulTests /
                                                    summary.analyticsMetrics
                                                        .totalTests,
                                            )}
                                            )
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Avg Response Time
                                        </span>
                                        <span className="font-mono">
                                            {formatDuration(
                                                summary.analyticsMetrics
                                                    .averageResponseTime,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            Tool Calling Accuracy
                                        </span>
                                        <span className="font-mono">
                                            {formatPercentage(
                                                summary.analyticsMetrics
                                                    .toolCallingAccuracy,
                                            )}
                                        </span>
                                    </div>

                                    {/* Show specific test details for single test mode */}
                                    {summary.ragMetrics.totalTests === 0 && analyticsResults.length === 1 && (
                                        <div className="border-t pt-3">
                                            <h4 className="text-sm font-medium mb-2">Test Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Test ID:</span>
                                                    <span className="font-mono">{analyticsResults[0].testCase.id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Category:</span>
                                                    <span className="font-mono">{analyticsResults[0].testCase.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tools Called:</span>
                                                    <span className="font-mono">{analyticsResults[0].toolsCalled.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Duration:</span>
                                                    <span className="font-mono">{formatDuration(analyticsResults[0].duration)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Key Metrics for Conference Paper */}
                        <Card className="border-primary">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">
                                    {summary.ragMetrics.totalTests === 0 ? "Single Analytics Test Results" : 
                                     summary.analyticsMetrics.totalTests === 0 ? "Single RAG Test Results" : 
                                     "Conference Paper Metrics"}
                                </CardTitle>
                                <CardDescription>
                                    {summary.ragMetrics.totalTests === 0 ? "Quick validation results for single analytics test" :
                                     summary.analyticsMetrics.totalTests === 0 ? "Quick validation results for single RAG test" :
                                     "Key quantitative results for your CITIC 2025 submission"
                                    }
                                    {metadata && (
                                        <span className="mt-1 block">
                                            Model evaluated:{" "}
                                            {metadata.modelLabel ||
                                                metadata.model}
                                            {metadata.provider &&
                                                ` (${metadata.provider})`}
                                        </span>
                                    )}
                                    {scientificMetrics.sampleSize > 1 && (
                                        <span className="mt-1 block text-xs font-mono">
                                            Scientific Metrics: F1={scientificMetrics.f1Score.toFixed(3)} | 
                                            MRR={scientificMetrics.meanReciprocalRank.toFixed(3)} | 
                                            CI={formatPercentage(scientificMetrics.confidenceLevel)}
                                        </span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 text-sm">
                                    {summary.ragMetrics.totalTests > 0 && (
                                    <div className="rounded bg-muted p-3">
                                        <strong>{summary.analyticsMetrics.totalTests === 0 ? "RAG Test Result" : "RAG System Evaluation"}:</strong>
                                        <ul className="ml-4 mt-2 space-y-1">
                                            <li>
                                                • Retrieval hit rate:{" "}
                                                {formatPercentage(
                                                    summary.ragMetrics
                                                        .overallHitRate,
                                                )}{" "}
                                                (
                                                {
                                                    summary.ragMetrics
                                                        .successfulTests
                                                }{" "}
                                                out of{" "}
                                                {summary.ragMetrics.totalTests}{" "}
                                                queries retrieved relevant
                                                chunks)
                                            </li>
                                            <li>
                                                • Average response time:{" "}
                                                {formatDuration(
                                                    summary.ragMetrics
                                                        .averageResponseTime,
                                                )}
                                            </li>
                                            <li>
                                                • System successfully processed{" "}
                                                {
                                                    summary.ragMetrics
                                                        .successfulTests
                                                }
                                                /{summary.ragMetrics.totalTests}{" "}
                                                test queries
                                            </li>
                                            <li>
                                                • Average computational cost:{" "}
                                                {Math.round(
                                                    summary.ragMetrics
                                                        .averageTokenUsage,
                                                )}{" "}
                                                tokens per query
                                            </li>
                                            {summary.analyticsMetrics.totalTests === 0 && ragResults.length === 1 && (
                                                <>
                                                    <li>
                                                        • Test question: &quot;{ragResults[0].testCase.question}&quot;
                                                    </li>
                                                    <li>
                                                        • Expected chunks: {ragResults[0].testCase.groundTruth.expectedChunks.length}
                                                    </li>
                                                    <li>
                                                        • Retrieved chunks: {ragResults[0].retrievedChunks.length}
                                                    </li>
                                                    <li>
                                                        • Result: {ragResults[0].success ? "✅ Success" : "❌ Failed"}
                                                    </li>
                                                </>
                                            )}
                                            {metadata && (
                                                <li>
                                                    • Evaluated using:{" "}
                                                    {metadata.modelLabel ||
                                                        metadata.model}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    )}
                                    {summary.analyticsMetrics.totalTests > 0 && (
                                    <div className="rounded bg-muted p-3">
                                        <strong>
                                            AI Analytics {summary.ragMetrics.totalTests === 0 ? "Test Result" : "Evaluation"}:
                                        </strong>
                                        <ul className="ml-4 mt-2 space-y-1">
                                            <li>
                                                • Tool calling accuracy:{" "}
                                                {formatPercentage(
                                                    summary.analyticsMetrics
                                                        .toolCallingAccuracy,
                                                )}{" "}
                                                (correct tool selection for
                                                natural language queries)
                                            </li>
                                            <li>
                                                • Task completion rate:{" "}
                                                {formatPercentage(
                                                    summary.analyticsMetrics
                                                        .successfulTests /
                                                        summary.analyticsMetrics
                                                            .totalTests,
                                                )}
                                            </li>
                                            <li>
                                                • Average response time:{" "}
                                                {formatDuration(
                                                    summary.analyticsMetrics
                                                        .averageResponseTime,
                                                )}
                                            </li>
                                            {summary.ragMetrics.totalTests === 0 && analyticsResults.length === 1 && (
                                                <>
                                                    <li>
                                                        • Test query: &quot;{analyticsResults[0].testCase.query}&quot;
                                                    </li>
                                                    <li>
                                                        • Expected tool: {analyticsResults[0].testCase.groundTruth?.expectedTool || "N/A"}
                                                    </li>
                                                    <li>
                                                        • Tools invoked: {analyticsResults[0].toolsCalled.join(", ") || "None"}
                                                    </li>
                                                    <li>
                                                        • Result: {analyticsResults[0].success ? "✅ Success" : "❌ Failed"}
                                                    </li>
                                                </>
                                            )}
                                            {metadata && (
                                                <li>
                                                    • Evaluated using:{" "}
                                                    {metadata.modelLabel ||
                                                        metadata.model}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Performance Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Performance by Test Category
                                </CardTitle>
                                <CardDescription>
                                    Detailed breakdown showing how the system performs across different types of queries
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* RAG Category Breakdown */}
                                    <div>
                                        <h4 className="font-medium mb-3">RAG System Categories</h4>
                                        <div className="space-y-3">
                                            {Object.entries(summary.ragMetrics.byCategory).map(([category, metrics]) => (
                                                <div key={category} className="rounded border p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium capitalize">
                                                            {category.replace('-', ' ')}
                                                        </span>
                                                        <Badge variant={
                                                            metrics.successRate >= 0.8 ? "default" :
                                                            metrics.successRate >= 0.6 ? "secondary" : "destructive"
                                                        }>
                                                            {formatPercentage(metrics.successRate)}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground space-y-1">
                                                        <div>Tests: {metrics.count}</div>
                                                        {metrics.averageScores.faithfulness !== undefined && (
                                                            <div>Faithfulness: {metrics.averageScores.faithfulness.toFixed(1)}/5.0</div>
                                                        )}
                                                        {metrics.averageScores.relevance !== undefined && (
                                                            <div>Relevance: {metrics.averageScores.relevance.toFixed(1)}/5.0</div>
                                                        )}
                                                        {metrics.averageScores.completeness !== undefined && (
                                                            <div>Completeness: {metrics.averageScores.completeness.toFixed(1)}/5.0</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Analytics Category Breakdown */}
                                    <div>
                                        <h4 className="font-medium mb-3">Analytics System Categories</h4>
                                        <div className="space-y-3">
                                            {Object.entries(summary.analyticsMetrics.byCategory).map(([category, metrics]) => (
                                                <div key={category} className="rounded border p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium capitalize">
                                                            {category.replace('-', ' ')}
                                                        </span>
                                                        <Badge variant={
                                                            metrics.successRate >= 0.8 ? "default" :
                                                            metrics.successRate >= 0.6 ? "secondary" : "destructive"
                                                        }>
                                                            {formatPercentage(metrics.successRate)}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground space-y-1">
                                                        <div>Tests: {metrics.count}</div>
                                                        <div>Tool Accuracy: {formatPercentage(metrics.averageToolAccuracy)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Scientific Analysis Tab */}
                    <TabsContent value="scientific">
                        <ScientificResultsAnalysis
                            ragResults={ragResults}
                            analyticsResults={analyticsResults}
                            modelName={metadata?.model || "Unknown Model"}
                            modelLabel={metadata?.modelLabel}
                            scientificMetrics={scientificMetrics}
                        />
                    </TabsContent>

                    {/* RAG Details Tab */}
                    <TabsContent value="rag-details" className="space-y-4">
                        <div className="grid gap-4">
                            {ragResults.map((result) => (
                                <Card
                                    key={result.testCase.id}
                                    className={
                                        result.success
                                            ? "border-green-200"
                                            : "border-red-200"
                                    }
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {result.success ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                                <span className="font-mono text-sm">
                                                    {result.testCase.id}
                                                </span>
                                                <Badge
                                                    variant={
                                                        result.testCase
                                                            .category ===
                                                        "high-priority"
                                                            ? "default"
                                                            : result.testCase
                                                                    .category ===
                                                                "medium-priority"
                                                              ? "secondary"
                                                              : result.testCase
                                                                      .category ===
                                                                  "edge-case"
                                                                ? "outline"
                                                                : "destructive"
                                                    }
                                                >
                                                    {result.testCase.category}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDuration(
                                                    result.duration,
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {result.testCase.question}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        {result.success ? (
                                            <>
                                                <div>
                                                    <h4 className="mb-1 text-sm font-medium">
                                                        Retrieved Chunks (
                                                        {
                                                            result
                                                                .retrievedChunks
                                                                .length
                                                        }
                                                        )
                                                    </h4>
                                                    <div className="space-y-1 text-xs">
                                                        {result.retrievedChunks
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    chunk,
                                                                    idx,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            chunk.chunkId
                                                                        }
                                                                        className="flex items-center justify-between rounded bg-muted p-2"
                                                                    >
                                                                        <span className="truncate font-mono">
                                                                            {
                                                                                chunk.chunkId
                                                                            }
                                                                        </span>
                                                                        <span className="text-muted-foreground">
                                                                            {(
                                                                                chunk.similarity *
                                                                                100
                                                                            ).toFixed(
                                                                                1,
                                                                            )}
                                                                            %
                                                                            similarity
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                        {result.retrievedChunks
                                                            .length > 3 && (
                                                            <div className="text-center text-muted-foreground">
                                                                +
                                                                {result
                                                                    .retrievedChunks
                                                                    .length -
                                                                    3}{" "}
                                                                more chunks
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="mb-1 text-sm font-medium">
                                                        Generated Response
                                                        Preview
                                                    </h4>
                                                    <p className="rounded bg-muted p-2 text-xs">
                                                        {result.generatedText.substring(
                                                            0,
                                                            200,
                                                        )}
                                                        ...
                                                    </p>
                                                </div>
                                                <div className="flex gap-4 text-xs text-muted-foreground">
                                                    <span>
                                                        Tokens:{" "}
                                                        {
                                                            result.tokenUsage
                                                                .totalTokens
                                                        }
                                                    </span>
                                                    <span>
                                                        Finish:{" "}
                                                        {result.finishReason}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-sm text-red-600">
                                                Error: {result.error}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Analytics Details Tab */}
                    <TabsContent
                        value="analytics-details"
                        className="space-y-4"
                    >
                        <div className="grid gap-4">
                            {analyticsResults.map((result) => (
                                <Card
                                    key={result.testCase.id}
                                    className={
                                        result.success
                                            ? "border-green-200"
                                            : "border-red-200"
                                    }
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {result.success ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                                <span className="font-mono text-sm">
                                                    {result.testCase.id}
                                                </span>
                                                <Badge variant="secondary">
                                                    {result.testCase.category}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDuration(
                                                    result.duration,
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {result.testCase.query}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {result.success ? (
                                            <div className="space-y-2">
                                                <div>
                                                    <h4 className="text-sm font-medium">
                                                        Expected Tool:{" "}
                                                        {result.testCase
                                                            .groundTruth
                                                            ?.expectedTool ||
                                                            "N/A"}
                                                    </h4>
                                                    <h4 className="text-sm font-medium">
                                                        Tools Called:{" "}
                                                        {
                                                            result.toolsCalled
                                                                .length
                                                        }
                                                    </h4>
                                                </div>
                                                {result.toolsCalled.map(
                                                    (toolName, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="rounded bg-muted p-2 text-xs"
                                                        >
                                                            <span className="font-mono">
                                                                {toolName}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-red-600">
                                                Error: {result.error}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
