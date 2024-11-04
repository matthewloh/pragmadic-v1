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
                src="https://images.unsplash.com/photo-1654201925953-3e51b98bea95?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Nomad Network Event"
                width={600}
                height={400}
                quality={80}
                className="max-h-[800px] w-full rounded-lg object-cover shadow-lg"
            />
        </section>
    )
}
