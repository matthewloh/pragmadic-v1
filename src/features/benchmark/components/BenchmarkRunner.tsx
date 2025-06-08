"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ANALYTICS_TEST_CASES, RAG_TEST_CASES } from "../data/testCases"
import { getDocuments } from "../services/documents"
import { BenchmarkResults, RAGTestCase } from "../types"
import { BenchmarkRunner as Runner } from "../utils/benchmarkRunner"
import { ChunkMapper } from "../utils/chunkMapping"
import { BenchmarkResultsDisplay } from "./BenchmarkResultsDisplay"

interface ProgressState {
    isRunning: boolean
    completed: number
    total: number
    current: string
    progress: number
}

const AVAILABLE_MODELS = [
    {
        value: "gemini-1.5-flash-002",
        label: "Gemini 1.5 Flash (Default)",
        provider: "Google",
    },
    {
        value: "gemini-1.5-pro-002",
        label: "Gemini 1.5 Pro",
        provider: "Google",
    },
    { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI" },
    { value: "claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic" },
    { value: "granite3-dense", label: "Granite 3 Dense", provider: "IBM" },
    { value: "llama3.1-8b", label: "Llama 3.1 8B", provider: "Meta" },
]

export function BenchmarkRunner() {
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
    const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash-002")
    const [isRunning, setIsRunning] = useState(false)
    const [results, setResults] = useState<BenchmarkResults | null>(null)
    const [progress, setProgress] = useState({
        completed: 0,
        total: 0,
        current: "",
    })
    const [validatedTestCases, setValidatedTestCases] = useState<RAGTestCase[]>(
        [],
    )
    const [chunkValidation, setChunkValidation] = useState<
        Record<string, boolean>
    >({})
    const [testSubset, setTestSubset] = useState<"all" | "sample" | "custom">("sample")
    const [maxTests, setMaxTests] = useState(5)

    const { data: documents } = useQuery({
        queryKey: ["documents"],
        queryFn: () => getDocuments(),
    })

    // Initialize and validate test cases on component mount
    useEffect(() => {
        async function initializeTestCases() {
            try {
                // Update test cases with validated chunk IDs
                const updatedCases =
                    await ChunkMapper.updateTestCaseChunks(RAG_TEST_CASES)
                setValidatedTestCases(updatedCases)

                // Validate all chunk IDs
                const allChunkIds = updatedCases.flatMap((testCase) =>
                    testCase.groundTruth.expectedChunks.map(
                        (chunk: { chunkId: string }) => chunk.chunkId,
                    ),
                )
                const validation =
                    await ChunkMapper.validateChunkIds(allChunkIds)
                setChunkValidation(validation)

                console.log("Test cases initialized and validated:", {
                    totalCases: updatedCases.length,
                    validChunks:
                        Object.values(validation).filter(Boolean).length,
                    invalidChunks: Object.values(validation).filter((v) => !v)
                        .length,
                })
            } catch (error) {
                console.error("Failed to initialize test cases:", error)
                setValidatedTestCases(RAG_TEST_CASES) // Fallback to original
            }
        }

        initializeTestCases()
    }, [])

    const runBenchmark = async () => {
        if (!selectedDocuments.length) {
            alert("Please select at least one document")
            return
        }

        if (validatedTestCases.length === 0) {
            alert("Test cases are not ready. Please wait for initialization.")
            return
        }

        setIsRunning(true)
        setResults(null)
        setProgress({
            completed: 0,
            total: 0,
            current: "Starting benchmark...",
        })

        try {
            const runner = new Runner()

            // Pre-validate chunk IDs
            console.log("Pre-benchmark chunk validation:", chunkValidation)
            const invalidChunks = Object.entries(chunkValidation)
                .filter(([_, isValid]) => !isValid)
                .map(([chunkId, _]) => chunkId)

            if (invalidChunks.length > 0) {
                console.warn("Some chunk IDs are invalid:", invalidChunks)
            }

            // Apply subset selection for cost control
            let ragTestsToRun = validatedTestCases
            let analyticsTestsToRun = ANALYTICS_TEST_CASES

            if (testSubset === "sample") {
                // Run a balanced sample from each category
                const highPriority = validatedTestCases.filter(t => t.category === "high-priority").slice(0, 3)
                const mediumPriority = validatedTestCases.filter(t => t.category === "medium-priority").slice(0, 2)
                const edgeCase = validatedTestCases.filter(t => t.category === "edge-case").slice(0, 1)
                const negativeTest = validatedTestCases.filter(t => t.category === "negative-test").slice(0, 1)
                
                ragTestsToRun = [...highPriority, ...mediumPriority, ...edgeCase, ...negativeTest]
                analyticsTestsToRun = ANALYTICS_TEST_CASES.slice(0, 3) // Just 3 analytics tests
            } else if (testSubset === "custom") {
                ragTestsToRun = validatedTestCases.slice(0, maxTests)
                analyticsTestsToRun = ANALYTICS_TEST_CASES.slice(0, maxTests)
            }

            console.log(`Running ${ragTestsToRun.length} RAG tests and ${analyticsTestsToRun.length} analytics tests`)

            const benchmarkResults = await runner.runAllTests(
                ragTestsToRun,
                analyticsTestsToRun,
                selectedDocuments,
                selectedModel,
                setProgress,
            )

            setResults(benchmarkResults)

            // Log summary for paper
            console.log("=== BENCHMARK RESULTS FOR PAPER ===")
            console.log("RAG System Performance:")
            console.log(
                `- Total Tests: ${benchmarkResults.summary.ragMetrics.totalTests}`,
            )
            console.log(
                `- Success Rate: ${((benchmarkResults.summary.ragMetrics.successfulTests / benchmarkResults.summary.ragMetrics.totalTests) * 100).toFixed(1)}%`,
            )
            console.log(
                `- Average Precision@K: ${(benchmarkResults.summary.ragMetrics.averagePrecisionAtK * 100).toFixed(1)}%`,
            )
            console.log(
                `- Average Recall: ${(benchmarkResults.summary.ragMetrics.averageRecall * 100).toFixed(1)}%`,
            )
            console.log(
                `- Hit Rate: ${(benchmarkResults.summary.ragMetrics.overallHitRate * 100).toFixed(1)}%`,
            )
            console.log(
                `- Average Response Time: ${(benchmarkResults.summary.ragMetrics.averageResponseTime / 1000).toFixed(1)}s`,
            )
            console.log(
                `- Average Token Usage: ${Math.round(benchmarkResults.summary.ragMetrics.averageTokenUsage)} tokens`,
            )
            console.log(
                `- Correct Refusal Rate: ${(benchmarkResults.summary.ragMetrics.correctRefusalRate * 100).toFixed(1)}%`,
            )

            console.log("\nAnalytics System Performance:")
            console.log(
                `- Total Tests: ${benchmarkResults.summary.analyticsMetrics.totalTests}`,
            )
            console.log(
                `- Tool Calling Accuracy: ${(benchmarkResults.summary.analyticsMetrics.toolCallingAccuracy * 100).toFixed(1)}%`,
            )
            console.log(
                `- Parameter Extraction Accuracy: ${(benchmarkResults.summary.analyticsMetrics.parameterExtractionAccuracy * 100).toFixed(1)}%`,
            )

            console.log("\nDetailed Results by Category:")
            Object.entries(
                benchmarkResults.summary.ragMetrics.byCategory,
            ).forEach(([category, metrics]) => {
                console.log(
                    `${category}: Success Rate ${(metrics.successRate * 100).toFixed(1)}%, Avg Scores: F:${metrics.averageScores.faithfulness?.toFixed(1)} R:${metrics.averageScores.relevance?.toFixed(1)} C:${metrics.averageScores.completeness?.toFixed(1)}`,
                )
            })
        } catch (error) {
            console.error("Benchmark failed:", error)
            alert(
                "Benchmark failed: " +
                    (error instanceof Error ? error.message : String(error)),
            )
        } finally {
            setIsRunning(false)
        }
    }

    const getChunkValidationStatus = () => {
        const total = Object.keys(chunkValidation).length
        const valid = Object.values(chunkValidation).filter(Boolean).length
        return { total, valid, invalid: total - valid }
    }

    const chunkStatus = getChunkValidationStatus()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Benchmark Configuration</CardTitle>
                    <CardDescription>
                        Configure and run comprehensive benchmarks for the RAG
                        Answer Engine and AI-Driven Analytics
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Test Case Validation Status */}
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <h4 className="mb-2 font-medium">
                            Test Case Validation Status
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>RAG Test Cases:</span>
                                <span>
                                    {validatedTestCases.length} cases loaded
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Chunk Validation:</span>
                                <span
                                    className={
                                        chunkStatus.invalid > 0
                                            ? "text-orange-600"
                                            : "text-green-600"
                                    }
                                >
                                    {chunkStatus.valid}/{chunkStatus.total}{" "}
                                    chunks valid
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Analytics Test Cases:</span>
                                <span>
                                    {ANALYTICS_TEST_CASES.length} cases loaded
                                </span>
                            </div>
                        </div>
                        {chunkStatus.invalid > 0 && (
                            <div className="mt-2 rounded border border-orange-200 bg-orange-50 p-2 text-sm text-orange-800">
                                ⚠️ Some chunk IDs may be outdated. Tests will
                                still run but accuracy may be affected.
                            </div>
                        )}
                    </div>

                    {/* Document Selection */}
                    <div>
                        <Label className="text-base font-medium">
                            Select Documents for Testing
                        </Label>
                        <p className="mb-3 text-sm text-muted-foreground">
                            Choose documents to use as the knowledge base for
                            RAG testing
                        </p>
                        <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto rounded-lg border p-3">
                            {documents?.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={doc.id}
                                        checked={selectedDocuments.includes(
                                            doc.id,
                                        )}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedDocuments([
                                                    ...selectedDocuments,
                                                    doc.id,
                                                ])
                                            } else {
                                                setSelectedDocuments(
                                                    selectedDocuments.filter(
                                                        (id) => id !== doc.id,
                                                    ),
                                                )
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={doc.id}
                                        className="flex-1 cursor-pointer text-sm"
                                    >
                                        {doc.name}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            ({doc.chunk_count} chunks)
                                        </span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Subset Selection for Cost Control */}
                    <div>
                        <Label className="text-base font-medium">
                            Test Subset (Cost Control)
                        </Label>
                        <p className="mb-3 text-sm text-muted-foreground">
                            Choose subset size to control API costs. Sample mode runs {maxTests} tests per category.
                        </p>
                        <div className="space-y-3">
                            <Select
                                value={testSubset}
                                onValueChange={(value: "all" | "sample" | "custom") => setTestSubset(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sample">Sample Testing ({maxTests} tests) - Recommended</SelectItem>
                                    <SelectItem value="all">Full Suite ({validatedTestCases.length + ANALYTICS_TEST_CASES.length} tests) - Expensive</SelectItem>
                                    <SelectItem value="custom">Custom Amount</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {testSubset === "custom" && (
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="maxTests" className="text-sm">Max tests per category:</Label>
                                    <input
                                        id="maxTests"
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={maxTests}
                                        onChange={(e) => setMaxTests(parseInt(e.target.value) || 1)}
                                        className="w-16 px-2 py-1 text-sm border rounded"
                                    />
                                </div>
                            )}
                            
                            {testSubset === "all" && (
                                <div className="rounded border border-orange-200 bg-orange-50 p-2 text-sm text-orange-800">
                                    ⚠️ Full testing will run {validatedTestCases.length + ANALYTICS_TEST_CASES.length} tests and may cost $5-15 depending on your model choice.
                                </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground">
                                Estimated tests to run: {testSubset === "all" ? validatedTestCases.length + ANALYTICS_TEST_CASES.length : 
                                    testSubset === "sample" ? Math.min(5, validatedTestCases.length) + Math.min(3, ANALYTICS_TEST_CASES.length) :
                                    Math.min(maxTests, validatedTestCases.length) + Math.min(maxTests, ANALYTICS_TEST_CASES.length)}
                            </div>
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div>
                        <Label className="text-base font-medium">
                            AI Model
                        </Label>
                        <Select
                            value={selectedModel}
                            onValueChange={setSelectedModel}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABLE_MODELS.map((model) => (
                                    <SelectItem
                                        key={model.value}
                                        value={model.value}
                                    >
                                        {model.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Test Preview */}
                    <div className="rounded-lg border p-4">
                        <h4 className="mb-2 font-medium">Test Overview</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="font-medium">RAG Tests:</div>
                                <div className="mt-1 space-y-1">
                                    <div>
                                        High Priority:{" "}
                                        {
                                            validatedTestCases.filter(
                                                (t) =>
                                                    t.category ===
                                                    "high-priority",
                                            ).length
                                        }
                                    </div>
                                    <div>
                                        Medium Priority:{" "}
                                        {
                                            validatedTestCases.filter(
                                                (t) =>
                                                    t.category ===
                                                    "medium-priority",
                                            ).length
                                        }
                                    </div>
                                    <div>
                                        Edge Cases:{" "}
                                        {
                                            validatedTestCases.filter(
                                                (t) =>
                                                    t.category === "edge-case",
                                            ).length
                                        }
                                    </div>
                                    <div>
                                        Negative Tests:{" "}
                                        {
                                            validatedTestCases.filter(
                                                (t) =>
                                                    t.category ===
                                                    "negative-test",
                                            ).length
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="font-medium">
                                    Analytics Tests:
                                </div>
                                <div className="mt-1 space-y-1">
                                    <div>
                                        Member Analytics:{" "}
                                        {
                                            ANALYTICS_TEST_CASES.filter(
                                                (t) =>
                                                    t.category ===
                                                    "member-analytics",
                                            ).length
                                        }
                                    </div>
                                    <div>
                                        Event Analytics:{" "}
                                        {
                                            ANALYTICS_TEST_CASES.filter(
                                                (t) =>
                                                    t.category ===
                                                    "event-analytics",
                                            ).length
                                        }
                                    </div>
                                    <div>
                                        Review Analytics:{" "}
                                        {
                                            ANALYTICS_TEST_CASES.filter(
                                                (t) =>
                                                    t.category ===
                                                    "review-analytics",
                                            ).length
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                        <Button
                        onClick={runBenchmark}
                        disabled={
                            isRunning ||
                            !selectedDocuments.length ||
                            validatedTestCases.length === 0
                        }
                        className="w-full"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Running Benchmark...
                            </>
                        ) : (
                            "Run Comprehensive Benchmark"
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Progress Display */}
            {isRunning && (
                <Card>
                    <CardHeader>
                        <CardTitle>Benchmark Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress:</span>
                                <span>
                                    {progress.completed}/{progress.total}
                                </span>
                            </div>
                            <Progress
                                value={
                                    (progress.completed /
                                        Math.max(progress.total, 1)) *
                                    100
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                Current: {progress.current}
                            </p>
                        </div>
                </CardContent>
            </Card>
            )}

            {/* Results Display */}
            {results && (
                <BenchmarkResultsDisplay
                    results={{
                        ...results,
                        metadata: {
                            model: selectedModel,
                            modelLabel: selectedModel,
                            timestamp: new Date().toISOString(),
                            testSuiteVersion: "1.0.0",
                        },
                    }}
                />
            )}
        </div>
    )
}
