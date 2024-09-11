import { text, varchar, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { messages } from "./messages"
import { type getAssistantResponses } from "@/lib/api/assistantResponses/queries"

import { nanoid } from "@/lib/utils"

export const assistantResponses = pgTable("assistant_responses", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    toolInvocations: text("tool_invocations"),
    usage: text("usage"),
    finishReason: varchar("finish_reason", { length: 256 }),
    messageId: varchar("message_id", { length: 256 })
        .references(() => messages.id, { onDelete: "cascade" })
        .notNull(),
})

// Schema for assistantResponses - used to validate API requests
const baseSchema = createSelectSchema(assistantResponses)

export const insertAssistantResponseSchema =
    createInsertSchema(assistantResponses)
export const insertAssistantResponseParams = baseSchema
    .extend({
        messageId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
    })

export const updateAssistantResponseSchema = baseSchema
export const updateAssistantResponseParams = baseSchema.extend({
    messageId: z.coerce.string().min(1),
})
export const assistantResponseIdSchema = baseSchema.pick({ id: true })

// Types for assistantResponses - used to type API request params and within Components
export type AssistantResponse = typeof assistantResponses.$inferSelect
export type NewAssistantResponse = z.infer<typeof insertAssistantResponseSchema>
export type NewAssistantResponseParams = z.infer<
    typeof insertAssistantResponseParams
>
export type UpdateAssistantResponseParams = z.infer<
    typeof updateAssistantResponseParams
>
export type AssistantResponseId = z.infer<
    typeof assistantResponseIdSchema
>["id"]

// this type infers the return from getAssistantResponses() - meaning it will include any joins
export type CompleteAssistantResponse = Awaited<
    ReturnType<typeof getAssistantResponses>
>["assistantResponses"][number]
