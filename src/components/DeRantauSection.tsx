import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FocusCards } from "./aceternity/focus-cards"
import Link from "next/link"
import { ArrowRight, Building2, Network, Map } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

export function DeRantauSection() {
    const cards = [
        {
            title: "Coworking Spaces",
            description: "Modern workspaces designed for digital nomads",
            icon: <Building2 className="h-6 w-6" />,
            src: "https://images.unsplash.com/photo-1562664369-49d50bb66658?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            title: "Networking Events",
            description: "Connect with fellow nomads and local professionals",
            icon: <Network className="h-6 w-6" />,
            src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            title: "Local Experiences",
            description: "Immerse yourself in Penang's rich culture",
            icon: <Map className="h-6 w-6" />,
            src: "https://images.unsplash.com/photo-1581028107987-990cb2ecfa5b?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ]

    return (
        <section className="relative overflow-hidden bg-background py-16 sm:py-24">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container relative mx-auto px-4">
                <div className="flex flex-col items-center space-y-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        DE Rantau Partner
                    </span>
                    <h2 className="text-balance text-center text-3xl font-bold leading-tight tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                        We connect you to certified{" "}
                        <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            DE Rantau
                        </span>{" "}
                        hubs & partners
                    </h2>
                </div>

                <Separator className="my-12 bg-border/60" />

                <div className="grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-12">
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-lg text-muted-foreground md:text-xl">
                            Discover Penang&apos;s specialized hubs and partners
                            that provide nomad-tailored accommodations and
                            coworking spaces.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
                                size="lg"
                                asChild
                            >
                                <Link href="/onboarding/browse">
                                    Learn More
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="shadow-md hover:shadow-lg"
                                asChild
                            >
                                <Link href="/hubs">View Hubs</Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative aspect-video overflow-hidden rounded-xl shadow-2xl"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1590756568559-1e1f15180d39?q=80&w=2668&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="DE Rantau Hub"
                            fill
                            quality={90}
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </motion.div>
                </div>

                <Separator className="my-16 bg-border/60" />

                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Explore DE Rantau Offerings
                        </h3>
                        <p className="mt-4 text-muted-foreground">
                            Everything you need to thrive as a digital nomad in
                            Penang
                        </p>
                    </div>

                    <FocusCards cards={cards} />
                </div>
            </div>
            <Separator className="my-16 bg-border/60" />
        </section>
    )
}
