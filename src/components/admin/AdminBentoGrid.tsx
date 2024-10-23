import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

const MotionCard = motion(Card)

const items = [
    {
        title: "User Management",
        description: "Manage user accounts and permissions",
        icon: Users,
        href: "/admin/users",
        className: "col-span-3 row-span-3",
    },
    {
        title: "Chat Management",
        description: "Manage chat settings and knowledge base",
        icon: MessageSquare,
        href: "/admin/chat",
        className: "col-span-3 row-span-3",
    },
]

export function AdminBentoGrid() {
    return (
        <div className="flex h-full flex-col">
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
