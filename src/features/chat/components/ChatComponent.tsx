"use client"
import { CornerDownLeft, Mic, Paperclip } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Markdown from "react-markdown"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useChat } from "ai/react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
export function ChatComponent() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: "/api/chat",
        maxToolRoundtrips: 2,
    })

    return (
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
                Output
            </Badge>
            <div className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                    {messages.map((m) => (
                        <div key={m.id} className="mb-4 whitespace-pre-wrap">
                            <div className="font-bold">{m.role}</div>
                            {m.content.length > 0 ? (
                                <Markdown>{m.content}</Markdown>
                            ) : (
                                <span className="font-light italic">
                                    {"calling tool: " +
                                        m?.toolInvocations?.[0].toolName}
                                </span>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </div>
            <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Input
                    id="message"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Mic className="size-4" />
                                <span className="sr-only">Use Microphone</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            Use Microphone
                        </TooltipContent>
                    </Tooltip>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

// <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
//     <div className="space-y-4">
//         {messages.map((m) => (
//             <div key={m.id} className="whitespace-pre-wrap">
//                 <div>
//                     <div className="font-bold">{m.role}</div>
//                     <p>
//                         {m.content.length > 0 ? (
//                             m.content
//                         ) : (
//                             <span className="font-light italic">
//                                 {"calling tool: " +
//                                     m?.toolInvocations?.[0].toolName}
//                             </span>
//                         )}
//                     </p>
//                 </div>
//             </div>
//         ))}
//     </div>

//     <form onSubmit={handleSubmit}>
//         <input
//             className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
//             value={input}
//             placeholder="Say something..."
//             onChange={handleInputChange}
//         />
//     </form>
// </div>
// )
// }
