import { openai } from "@ai-sdk/openai"
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai"
import { customMiddleware } from "@/lib/ai/custom-middleware"
import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"

export const customModel = wrapLanguageModel({
    model: openai("gpt-4o-mini"),
    middleware: customMiddleware,
})

export const geminiModel = wrapLanguageModel({
    model: google("gemini-1.5-pro-002"),
    middleware: customMiddleware,
})

export const anthropicModel = wrapLanguageModel({
    model: anthropic("claude-3-haiku-20240307"),
    middleware: customMiddleware,
})
