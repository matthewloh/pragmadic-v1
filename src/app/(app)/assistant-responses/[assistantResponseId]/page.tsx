import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getAssistantResponseById } from "@/lib/api/assistantResponses/queries"
import { getMessages } from "@/lib/api/messages/queries"
import OptimisticAssistantResponse from "@/app/(app)/assistant-responses/[assistantResponseId]/OptimisticAssistantResponse"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function AssistantResponsePage({
    params,
}: {
    params: { assistantResponseId: string }
}) {
    return (
        <main className="overflow-auto">
            <AssistantResponse id={params.assistantResponseId} />
        </main>
    )
}

const AssistantResponse = async ({ id }: { id: string }) => {
    const { assistantResponse } = await getAssistantResponseById(id)
    const { messages } = await getMessages()

    if (!assistantResponse) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="assistant-responses" />
                <OptimisticAssistantResponse
                    assistantResponse={assistantResponse}
                    messages={messages}
                />
            </div>
        </Suspense>
    )
}
