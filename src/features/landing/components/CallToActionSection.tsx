import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CallToActionSection() {
    return (
        <section className="bg-primary py-20 text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold">
                    Ready to Start Your Malaysian Adventure?
                </h2>
                <p className="mb-8 text-xl">
                    Begin your DE Rantau visa application process today and join
                    our thriving digital nomad community.
                </p>
                <div className="space-x-4">
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/apply">Start Application</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/learn-more">Learn More</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
