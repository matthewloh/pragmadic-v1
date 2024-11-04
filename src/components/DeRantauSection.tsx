import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FocusCards } from "./aceternity/focus-cards"

export function DeRantauSection() {
    const cards = [
        {
            title: "Coworking Spaces",
            src: "https://images.unsplash.com/photo-1562664369-49d50bb66658?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            title: "Networking Events",
            src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            title: "Local Experiences",
            src: "https://images.unsplash.com/photo-1581028107987-990cb2ecfa5b?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ]

    return (
        <section className="container mx-auto bg-background px-4 py-12">
            <div className="mb-12 flex flex-col items-center md:flex-row">
                <div className="mb-8 md:mb-0 md:w-1/2">
                    <h2 className="mb-4 text-3xl font-bold text-foreground">
                        We connect you to certified DE Rantau hubs & partners
                    </h2>
                    <p className="mb-4 text-muted-foreground">
                        Discover Penang&apos;s specialized hubs and partners
                        that provide nomad-tailored accommodations and coworking
                        spaces.
                    </p>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Learn More
                    </Button>
                </div>
                <div className="md:w-1/2">
                    <Image
                        src="https://images.unsplash.com/photo-1590756568559-1e1f15180d39?q=80&w=2668&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="DE Rantau Hub"
                        width={500}
                        height={300}
                        quality={80}
                        className="size-full rounded-lg object-cover shadow-lg"
                    />
                </div>
            </div>
            <div className="mt-12">
                <h3 className="mb-6 text-center text-2xl font-bold text-foreground">
                    Explore DE Rantau Offerings
                </h3>
                <FocusCards cards={cards} />
            </div>
        </section>
    )
}
