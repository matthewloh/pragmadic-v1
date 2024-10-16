import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send } from "lucide-react"

export function ChatbotSection() {
    return (
        <section className="container mx-auto bg-background px-4 py-12">
            <h2 className="mb-4 text-center text-8xl font-semibold leading-[52px] text-foreground md:text-3xl">
                Penang-based Retrieval-Augmented Generation powers nomadic
                convenience through our Chatbot powered by OpenAI and Llama 3.2
            </h2>
            <Button className="mb-8 bg-primary text-primary-foreground hover:bg-primary/90">
                Try it out
            </Button>
            <div className="rounded-lg bg-card p-6 shadow-lg">
                <div className="space-y-4">
                    {/* Chat messages */}
                    <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-muted p-2">
                            <MessageCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="max-w-[80%] rounded-lg bg-muted p-3">
                            <p className="text-foreground">
                                Hi there! How can I help you today?
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start justify-end">
                        <div className="max-w-[80%] rounded-lg bg-primary/10 p-3">
                            <p className="text-foreground">
                                I&apos;m looking for coworking spaces in Penang.
                                Any recommendations?
                            </p>
                        </div>
                        <div className="ml-4 rounded-full bg-primary p-2">
                            <MessageCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-muted p-2">
                            <MessageCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="max-w-[80%] rounded-lg bg-muted p-3">
                            <p className="text-foreground">
                                Penang has several great coworking spaces. Some
                                popular options include...
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center">
                    <Input
                        placeholder="Type your message..."
                        className="mr-2 flex-grow"
                    />
                    <Button
                        size="icon"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
