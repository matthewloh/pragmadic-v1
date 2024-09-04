import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

export default function TeamSection() {
    return (
        <section id="team" className="bg-secondary py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Meet Our Team
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            name: "Jane Doe",
                            role: "Founder & CEO",
                            image: "/placeholder.svg",
                        },
                        {
                            name: "John Smith",
                            role: "CTO",
                            image: "/placeholder.svg",
                        },
                        {
                            name: "Alice Lee",
                            role: "Community Manager",
                            image: "/placeholder.svg",
                        },
                    ].map((member) => (
                        <Card key={member.name}>
                            <CardHeader>
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={200}
                                    height={200}
                                    className="mx-auto mb-4 rounded-full"
                                />
                                <CardTitle>{member.name}</CardTitle>
                                <CardDescription>{member.role}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center">
                                    Passionate about creating a seamless
                                    experience for digital nomads in Malaysia.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
