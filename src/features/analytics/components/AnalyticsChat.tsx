"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "ai/react"

export function AnalyticsChat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: "/api/analytics/chat",
        async onToolCall({ toolCall }) {
            if (toolCall.toolName === "summarizeReviews") {
                console.log(toolCall.args)
                return "Reviews have been summarized and displayed"
            }
        },
    })

    return (
        <div className="flex h-full flex-col">
            <div className="border-b p-4">
                <h2 className="font-semibold">Analytics Assistant</h2>
            </div>

            <ScrollArea className="flex-1 p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 ${
                            message.role === "assistant" ? "ml-4" : "mr-4"
                        }`}
                    >
                        {message.toolInvocations
                            ? message.toolInvocations.map((tool, index) => (
                                  <>
                                      {tool.toolName === "summarizeReviews" &&
                                          tool.state === "result" && (
                                              <div className="flex flex-wrap">
                                                  {tool.args.reviews.map(
                                                      (
                                                          review: string,
                                                          reviewIndex: number,
                                                      ) => (
                                                          <div
                                                              className="w-1/2 p-2"
                                                              key={`${message.id}-${index}-${reviewIndex}`}
                                                          >
                                                              {review}
                                                          </div>
                                                      ),
                                                  )}
                                              </div>
                                          )}
                                  </>
                              ))
                            : null}
                        <div
                            className={`rounded-lg p-3 ${
                                message.role === "assistant"
                                    ? "bg-secondary"
                                    : "bg-primary text-primary-foreground"
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about your analytics..."
                    />
                    <Button type="submit">Send</Button>
                </div>
            </form>
        </div>
    )
}
