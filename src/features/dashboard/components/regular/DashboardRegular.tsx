"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Compass, Calendar, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardRegular() {
    const router = useRouter()

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome to DE Rantau
                </h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.push("/onboarding/map")}>
                        Explore Hubs
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/onboarding/profile")}
                    >
                        Complete Profile
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/onboarding/map">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recommended Hubs
                            </CardTitle>
                            <Compass className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">
                                Based on your interests
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/onboarding/events">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming Events
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">6</div>
                            <p className="text-xs text-muted-foreground">
                                In your area
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/communities">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Community Members
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                Active in your region
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/getting-started">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Getting Started
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2/5</div>
                            <p className="text-xs text-muted-foreground">
                                Steps completed
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
