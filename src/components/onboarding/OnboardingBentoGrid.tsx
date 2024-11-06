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
        className: "col-span-6 row-span-3",
    },
    // {
    //     title: "Networking",
    //     description: "Connect with other digital nomads",
    //     icon: Users,
    //     href: "/onboarding/networking",
    //     className: "col-span-2 row-span-2",
    // },
    // {
    //     title: "DE Rantau Services",
    //     description: "Explore services tailored for digital nomads",
    //     icon: Search,
    //     href: "/onboarding/browse",
    //     className: "col-span-2 row-span-1",
    // },
]

export function OnboardingBentoGrid() {
    return (
        <div className="flex h-full w-full flex-col">
            <div className="grid flex-grow grid-cols-6 grid-rows-3 gap-6">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`${item.className} flex`}
                    >
                        <MotionCard
                            className="group flex flex-grow flex-col overflow-hidden transition-all hover:shadow-lg dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <CardHeader className="p-6">
                                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                                    <item.icon className="h-6 w-6 text-primary" />
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow p-6 pt-0">
                                <p className="text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </MotionCard>
                    </Link>
                ))}
            </div>
        </div>
    )
}
