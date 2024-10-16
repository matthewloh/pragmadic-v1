import { MessageSquare } from "lucide-react"

export const EmptyChat = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">
                Start a New Conversation
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Your journey of discovery begins with a single message.
            </p>
        </div>
    </div>
)
