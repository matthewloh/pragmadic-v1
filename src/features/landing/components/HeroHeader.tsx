import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function HeroHeader() {
    return (
        <section className="bg-primary py-20 text-primary-foreground">
            <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:flex-row">
                <div className="mb-10 md:mb-0 md:w-1/2">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        Simplify Your DE Rantau Visa Application
                    </h1>
                    <p className="mb-6 text-xl">
                        Experience a streamlined process powered by AI to start
                        your digital nomad journey in Malaysia.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/apply">Start Your Application</Link>
                    </Button>
                </div>
                <div className="md:w-1/2">
                    <Image
                        src="/placeholder.svg"
                        alt="DE Rantau Visa Application Process"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </section>
    )
}
