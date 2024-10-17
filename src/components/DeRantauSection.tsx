import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FocusCards } from "./aceternity/focus-cards"

export function DeRantauSection() {
    const cards = [
        {
            title: "Coworking Spaces",
            src: "/placeholder.svg",
        },
        {
            title: "Networking Events",
            src: "/placeholder.svg",
        },
        {
            title: "Local Experiences",
            src: "/placeholder.svg",
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
                        src="/placeholder.svg"
                        alt="DE Rantau Hub"
                        width={500}
                        height={300}
                        className="rounded-lg shadow-lg"
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
