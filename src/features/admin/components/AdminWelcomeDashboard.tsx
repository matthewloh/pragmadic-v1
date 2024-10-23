"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const dashboardItems = [
    {
        title: "User Management",
        description: "Manage user accounts and permissions",
        link: "/admin/users",
    },
    {
        title: "Chat Management",
        description: "Manage chat settings and knowledge base",
        link: "/admin/chat",
    },
]

const titleWords = "Admin Management".split(" ")

const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
        },
    }),
}

function EnhancedTitle() {
    return (
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            {titleWords.map((word, index) => (
                <motion.span
                    key={index}
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="inline-block"
                >
                    <span className="mr-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-primary">
                        {word}
                    </span>
                </motion.span>
            ))}
        </h1>
    )
}
export function AdminWelcomeDashboard() {
    return (
        <div className="flex h-full flex-col space-y-8 py-8">
            <EnhancedTitle />
            <div className="grid flex-grow grid-cols-2 gap-6">
                {dashboardItems.map((item) => (
                    <Link href={item.link} key={item.title} className="h-full">
                        <Card className="h-full transition-shadow hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
