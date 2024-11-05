"use client"

import { useChat } from "ai/react"
import { MemberDistributionChart } from "../charts/MemberDistributionChart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { BarChart2, Send } from "lucide-react"
import MarkdownRenderer from "@/components/ui/markdown-renderer"
import { AnimatedPromptSuggestions } from "@/components/ui/animated-prompt-suggestions"
import { HubMetricsRadar } from "@/features/analytics/charts/HubMetricsRadar"
import { ReviewAnalytics } from "@/features/analytics/charts/ReviewAnalytics"

const renderToolResult = (toolInvocation: any) => {
    if (toolInvocation.state !== "result") return null

    try {
        const data = JSON.parse(toolInvocation.result)

        switch (toolInvocation.toolName) {
            case "getMemberStats":
                return (
                    <div key={toolInvocation.toolCallId} className="mt-4">
                        <MemberDistributionChart {...data} />
                    </div>
                )

            case "hubMetricsAnalysis":
                return (
                    <div key={toolInvocation.toolCallId} className="mt-4">
                        <HubMetricsRadar {...data} />
                    </div>
                )

            case "getReviewAnalysis":
                if (!data.type || !data.data) {
                    console.error(
                        "Invalid review analysis data structure:",
                        data,
                    )
                    return null
                }
                return (
                    <div key={toolInvocation.toolCallId} className="mt-4">
                        <ReviewAnalytics
                            type={data.type}
                            data={data.data}
                            title={data.title}
                        />
                    </div>
                )

            default:
                return null
        }
    } catch (error) {
        console.error("Failed to parse tool result:", error)
        return null
    }
}

export function AnalyticsChat() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        append,
    } = useChat({
        api: "/api/analytics/chat",
        experimental_onToolCall: async (tool) => {
            console.log("Tool called:", tool)
        },
    })

    const suggestionSections = [
        {
            label: "Quick Actions for Member Analytics",
            suggestions: [
                "Show me the total number of members",
                "Show me the distribution of member skills",
                "Show me the distribution of member locations",
                "Suggest me a list of events to run based on member interests",
            ],
        },
        {
            label: "Quick Actions for Review Analytics",
            suggestions: [
                "Show me the top rated hubs",
                "Show me the review volume by hub",
                "Show me the ratings by hub type",
                "Show me the rating distribution",
            ],
        },
    ]

    return (
        <div className="flex h-dvh flex-col gap-4 rounded-lg border bg-background p-4">
            {/* Header */}
            <div className="flex items-center gap-2 border-b pb-4">
                <BarChart2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Analytics Assistant</h2>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4">
                <div className="flex flex-col gap-4 pb-4">
                    {messages.map((message) => (
                        <Card
                            key={message.id}
                            className={`p-4 ${
                                message.role === "assistant"
                                    ? "bg-muted"
                                    : "bg-primary/10"
                            }`}
                        >
                            <div className="mb-2 text-sm font-medium">
                                {message.role === "user" ? "You" : "Assistant"}
                            </div>
                            <MarkdownRenderer>
                                {message.content}
                            </MarkdownRenderer>

                            {message.toolInvocations?.map((toolInvocation) =>
                                renderToolResult(toolInvocation),
                            )}
                        </Card>
                    ))}
                </div>
            </ScrollArea>

            {/* Bottom Section */}
            <div className="mt-auto space-y-4 border-t pt-4">
                <AnimatedPromptSuggestions
                    sections={suggestionSections}
                    append={append}
                />
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2"
                >
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about analytics..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
