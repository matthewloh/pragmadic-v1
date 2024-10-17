import Image from "next/image"
import { Button } from "@/components/ui/button"

export function NomadNetworkSection() {
    return (
        <section className="container mx-auto bg-background px-4 py-12">
            <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                    Be a part of the nomad network in Penang
                </h2>
                <p className="mb-4 text-muted-foreground">
                    Join the many hosted community events and connect with
                    fellow digital nomads in Penang through our generative AI
                    integrated networking support.
                </p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    View Events
                </Button>
            </div>
            <Image
                src="/placeholder.svg"
                alt="Nomad Network Event"
                width={600}
                height={400}
                className="max-h-[800px] w-full rounded-lg object-cover shadow-lg"
            />
        </section>
    )
}
