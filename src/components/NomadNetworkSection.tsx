import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function NomadNetworkSection() {
    return (
        <section className="relative overflow-hidden bg-background py-16 sm:py-24">
            {/* Background pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        Community Events
                    </span>

                    <h2 className="mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-4xl">
                        Be a part of the nomad network in Penang
                    </h2>

                    <p className="mb-8 text-balance text-lg text-muted-foreground sm:text-xl">
                        Join the many hosted community events and connect with
                        fellow digital nomads in Penang through our generative
                        AI integrated networking support.
                    </p>

                    <Button
                        size="lg"
                        className="group inline-flex items-center gap-2 bg-primary px-6 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
                    >
                        View Events
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>

                <motion.div
                    className="relative mt-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {/* Gradient overlay for image */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-muted shadow-2xl">
                        <div className="aspect-[16/9]">
                            <Image
                                src="https://images.unsplash.com/photo-1654201925953-3e51b98bea95?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Nomad Network Event"
                                fill
                                quality={90}
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
                                priority
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
