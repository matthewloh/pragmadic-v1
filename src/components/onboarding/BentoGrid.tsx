import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Users, Search } from "lucide-react"
import { motion } from "framer-motion"

const MotionCard = motion(Card)

const items = [
    {
        title: "Explore Penang",
        description: "Discover hubs and events on an interactive 3D map",
        icon: Globe,
        href: "/onboarding/map",
        className: "col-span-2 row-span-2 md:col-span-4 md:row-span-2",
    },
    {
        title: "Networking",
        description: "Connect with other digital nomads",
        icon: Users,
        href: "/onboarding/networking",
        className: "col-span-2 md:col-span-2",
    },
    {
        title: "DE Rantau Services",
        description: "Explore services tailored for digital nomads",
        icon: Search,
        href: "/onboarding/browse",
        className: "col-span-2 md:col-span-2",
    },
]

export function BentoGrid() {
    return (
        <div className="grid h-[calc(100vh-12rem)] gap-6 sm:grid-cols-2 md:grid-cols-6 md:grid-rows-3">
            {items.map((item, index) => (
                <Link key={index} href={item.href} className={item.className}>
                    <MotionCard
                        className="group h-full overflow-hidden transition-all hover:shadow-lg"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CardHeader className="relative p-6">
                            <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold md:text-2xl lg:text-3xl">
                                <item.icon className="h-8 w-8 text-primary" />
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-base text-muted-foreground md:text-lg lg:text-xl">
                                {item.description}
                            </p>
                        </CardContent>
                    </MotionCard>
                </Link>
            ))}
        </div>
    )
}
