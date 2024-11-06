import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Sparkles } from "lucide-react"
import Link from "next/link"
import { Separator } from "./ui/separator"

export function ChatbotSection() {
    return (
        <section className="container mx-auto bg-background px-4 py-8 md:py-12">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Penang-based
                    </span>{" "}
                    Retrieval-Augmented Generation powers nomadic convenience
                </h2>
                <p className="mb-8 text-balance text-lg text-muted-foreground sm:text-xl">
                    Powered by OpenAI and Gemini
                </p>
                <Button
                    size="lg"
                    className="mb-12 inline-flex items-center gap-2 bg-primary px-8 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
                    asChild
                >
                    <Link href="/chat">
                        <Sparkles className="h-5 w-5" />
                        Try it out
                    </Link>
                </Button>
            </div>

            <div className="mx-auto max-w-2xl rounded-xl bg-card p-4 shadow-lg transition-all hover:shadow-xl sm:p-6 md:max-w-7xl">
                <div className="space-y-4">
                    {/* Chat messages */}
                    <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-muted p-2">
                            <MessageCircle className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
                        </div>
                        <div className="max-w-[80%] rounded-lg bg-muted p-3">
                            <p className="text-sm text-foreground sm:text-base">
                                Hi there! How can I help you today?
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start justify-end">
                        <div className="max-w-[80%] rounded-lg bg-primary/10 p-3">
                            <p className="text-sm text-foreground sm:text-base">
                                I&apos;m looking for coworking spaces in Penang.
                                Any recommendations?
                            </p>
                        </div>
                        <div className="ml-4 rounded-full bg-primary p-2">
                            <MessageCircle className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-muted p-2">
                            <MessageCircle className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
                        </div>
                        <div className="max-w-[80%] rounded-lg bg-muted p-3">
                            <p className="text-sm text-foreground sm:text-base">
                                Penang has several great coworking spaces. Some
                                popular options include...
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <Input
                        placeholder="Type your message..."
                        className="flex-grow text-sm sm:text-base"
                    />
                    <Button
                        size="icon"
                        className="h-10 w-10 bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-lg"
                        asChild
                    >
                        <Link href="/chat">
                            <Send className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
            <Separator className="my-8" />
        </section>
    )
}
