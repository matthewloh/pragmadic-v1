import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function PragmadicPromisesSection() {
    const promises = ["Accommodations", "Coworking Spaces", "Community Events"]

    return (
        <section className="container mx-auto bg-background px-4 py-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
                Pragmadic&apos;s Promises
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {promises.map((title, index) => (
                    <Card key={index} className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-card-foreground">
                                {title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image
                                src={`/placeholder.svg?height=200&width=300`}
                                alt={title}
                                width={300}
                                height={200}
                                className="w-full rounded-lg object-cover"
                            />
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                Learn More
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
