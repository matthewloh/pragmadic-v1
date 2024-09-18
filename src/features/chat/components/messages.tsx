"use client"

import { cn } from "@/lib/utils"
import { MemoizedReactMarkdown } from "@/features/chat/components/markdown"
import { StreamableValue } from "ai/rsc"
import { useStreamableText } from "@/features/chat/hooks/use-streamable-text"
import { Loader2, Sparkle, UserIcon } from "lucide-react"
import { AiFillOpenAI } from "react-icons/ai"

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="group relative flex items-start md:-ml-12">
            <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
                <UserIcon />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
                {children}
            </div>
        </div>
    )
}
// export function BotMessage({
//     children,
//     className,
// }: {
//     children: React.ReactNode
//     className?: string
// }) {
//     return (
//         <div
//             className={cn(
//                 "group relative flex items-start md:-ml-12",
//                 className,
//             )}
//         >
//             <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
//                 <Sparkle />
//             </div>
//             <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
//                 {children}
//             </div>
//         </div>
//     )
// }

export function BotMessage({
    content,
    className,
}: {
    content: string | StreamableValue<string>
    className?: string
}) {
    const text = useStreamableText(content)

    return (
        <div
            className={cn(
                "group relative flex items-start md:-ml-12",
                className,
            )}
        >
            <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
                <AiFillOpenAI />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                <MemoizedReactMarkdown
                    className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
                    // components={{
                    //     p({ children }) {
                    //         return <p className="mb-2 last:mb-0">{children}</p>
                    //     },
                    //     // code({ node, inline, className, children, ...props }) {
                    //     //     if (children.length) {
                    //     //         if (children[0] == "▍") {
                    //     //             return (
                    //     //                 <span className="mt-1 animate-pulse cursor-default">
                    //     //                     ▍
                    //     //                 </span>
                    //     //             )
                    //     //         }

                    //     //         children[0] = (children[0] as string).replace(
                    //     //             "`▍`",
                    //     //             "▍",
                    //     //         )
                    //     //     }

                    //     //     const match = /language-(\w+)/.exec(className || "")

                    //     //     if (inline) {
                    //     //         return (
                    //     //             <code className={className} {...props}>
                    //     //                 {children}
                    //     //             </code>
                    //     //         )
                    //     //     }

                    //     //     return (
                    //     //         <CodeBlock
                    //     //             key={Math.random()}
                    //     //             language={(match && match[1]) || ""}
                    //     //             value={String(children).replace(/\n$/, "")}
                    //     //             {...props}
                    //     //         />
                    //     //     )
                    //     // },
                    // }}
                >
                    {text}
                </MemoizedReactMarkdown>
            </div>
        </div>
    )
}

export function BotCard({
    children,
    showAvatar = true,
}: {
    children: React.ReactNode
    showAvatar?: boolean
}) {
    return (
        <div className="group relative flex items-start md:-ml-12">
            <div
                className={cn(
                    "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
                    !showAvatar && "invisible",
                )}
            >
                <AiFillOpenAI />
            </div>
            <div className="ml-4 flex-1 pl-2">{children}</div>
        </div>
    )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={
                "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
            }
        >
            <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
        </div>
    )
}

export function SpinnerMessage() {
    return (
        <div className="group relative flex items-start md:-ml-12">
            <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
                <AiFillOpenAI />
            </div>
            <div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
                <Loader2 className="size-5 animate-spin stroke-zinc-400" />
            </div>
        </div>
    )
}
