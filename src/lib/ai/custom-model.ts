import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai"
import { ollama } from "ollama-ai-provider"
import { ragMiddleware } from "./ragMiddleware"

export const gpt4oModel = wrapLanguageModel({
    model: openai("gpt-4o"),
    middleware: ragMiddleware,
})

export const gpt4ominiModel = wrapLanguageModel({
    model: openai("gpt-4o-mini"),
    middleware: ragMiddleware,
})

export const geminiProModel = wrapLanguageModel({
    model: google("gemini-1.5-pro-latest"),
    middleware: ragMiddleware,
})

export const geminiFlashModel = wrapLanguageModel({
    model: google("gemini-1.5-flash"),
    middleware: ragMiddleware,
})

export const anthropicModel = wrapLanguageModel({
    model: anthropic("claude-3-haiku-20240307"),
    middleware: ragMiddleware,
})

export const llama3Model = wrapLanguageModel({
    model: ollama("llama3.1:8b"),
    middleware: ragMiddleware,
})

export const granite3DenseModel = wrapLanguageModel({
    model: ollama("granite3-dense:8b"),
    middleware: ragMiddleware,
})

// Add GROOOOOOQ I'M GONNA GROOQ