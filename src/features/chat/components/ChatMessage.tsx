import { Attachment, Message, ToolInvocation } from "ai"
import { motion } from "framer-motion"
import { BotIcon, UserIcon } from "lucide-react"
import Markdown from "react-markdown"
import { PreviewAttachment } from "./PreviewAttachment"

export const ChatMessage = ({ message }: { message: Message }) => {
    const { role, content, experimental_attachments, toolInvocations } = message

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`mb-6 flex ${
                role === "user" ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`max-w-[80%] rounded-lg p-4 shadow-lg ${
                    role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                }`}
            >
                <div className="mb-2 flex items-center gap-2">
                    {role === "user" ? (
                        <UserIcon className="h-5 w-5" />
                    ) : (
                        <BotIcon className="h-5 w-5" />
                    )}
                    <span className="text-sm font-medium">
                        {role === "user" ? "You" : "AI Assistant"}
                    </span>
                </div>
                {content && content.length > 0 ? (
                    <Markdown className="prose prose-sm dark:prose-invert max-w-none">
                        {content}
                    </Markdown>
                ) : (
                    <span className="text-sm font-light italic">
                        {"Initiating: " + toolInvocations?.[0]?.toolName}
                    </span>
                )}

                {experimental_attachments &&
                    experimental_attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {experimental_attachments.map(
                                (attachment: Attachment) => (
                                    <PreviewAttachment
                                        key={attachment.url}
                                        attachment={attachment}
                                    />
                                ),
                            )}
                        </div>
                    )}

                {toolInvocations && toolInvocations.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <h4 className="mb-2 text-sm font-semibold">
                            Tool Invocations:
                        </h4>
                        {toolInvocations.map((invocation: ToolInvocation) => (
                            <div
                                key={invocation.toolCallId}
                                className="mb-2 rounded bg-gray-100 p-2 text-sm dark:bg-gray-800"
                            >
                                <span className="font-medium">
                                    {invocation.toolName}:{" "}
                                </span>
                                {invocation.state === "result" ? (
                                    <span>
                                        {JSON.stringify(invocation.result)}
                                    </span>
                                ) : (
                                    <span className="italic">
                                        Processing...
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
