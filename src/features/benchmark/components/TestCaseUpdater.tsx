"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw, CheckCircle, AlertTriangle, Copy } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function TestCaseUpdater() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    const updateTestCases = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/benchmark/update-test-cases', {
                method: 'POST'
            })
            const data = await response.json()
            setResult(data)
        } catch (error) {
            setResult({
                success: false,
                error: 'Network error',
                message: 'Failed to connect to server'
            })
        } finally {
            setLoading(false)
        }
    }

    const copyCode = async () => {
        if (result?.generatedCode) {
            await navigator.clipboard.writeText(result.generatedCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Fix Test Case Ground Truth
                </CardTitle>
                <CardDescription>
                    Update your test cases with the correct chunk IDs from your current database to fix precision/recall calculations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Your test cases are currently using outdated chunk IDs, which is why precision and recall are showing as 0. 
                        This tool will scan your database and provide updated chunk IDs for each test case.
                    </AlertDescription>
                </Alert>

                <Button 
                    onClick={updateTestCases}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Database...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Test Cases
                        </>
                    )}
                </Button>

                {result && (
                    <div className="space-y-4">
                        {result.success ? (
                            <Alert>
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Successfully analyzed your database! Found updated chunk mappings for {Object.keys(result.mapping).length} test cases.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    {result.message}: {result.error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {result.success && result.mapping && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Test Case Analysis</h4>
                                    <div className="grid gap-2">
                                        {Object.entries(result.mapping).map(([testId, chunkIds]: [string, string[]]) => (
                                            <div key={testId} className="flex items-center justify-between p-2 border rounded">
                                                <span className="font-mono text-sm">{testId}</span>
                                                <Badge variant={chunkIds.length > 0 ? "default" : "destructive"}>
                                                    {chunkIds.length} chunks
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {result.generatedCode && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">Updated Code</h4>
                                            <Button
                                                onClick={copyCode}
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2"
                                            >
                                                {copied ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                                {copied ? 'Copied!' : 'Copy Code'}
                                            </Button>
                                        </div>
                                        <div className="bg-muted p-4 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-auto">
                                            {result.generatedCode}
                                        </div>
                                        <Alert className="mt-2">
                                            <AlertDescription>
                                                Copy this code and manually update the expectedChunks arrays in your testCases.ts file to fix the precision/recall calculations.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 