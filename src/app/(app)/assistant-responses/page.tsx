import { Suspense } from "react"

import Loading from "@/app/loading"
import AssistantResponseList from "@/components/assistantResponses/AssistantResponseList"
import { getAssistantResponses } from "@/lib/api/assistantResponses/queries"
import { getMessages } from "@/lib/api/messages/queries"

export const revalidate = 0

export default async function AssistantResponsesPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Assistant Responses
                    </h1>
                </div>
                <AssistantResponses />
            </div>
        </main>
    )
}

const AssistantResponses = async () => {
    const { assistantResponses } = await getAssistantResponses()
    const { messages } = await getMessages()
    return (
        <Suspense fallback={<Loading />}>
            <AssistantResponseList
                assistantResponses={assistantResponses}
                messages={messages}
            />
        </Suspense>
    )
}
