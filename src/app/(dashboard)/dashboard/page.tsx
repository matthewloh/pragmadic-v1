import PragmadicLogo from "@/components/branding/pragmadic-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { getUserAuth } from "@/lib/auth/utils"
import {
    BotMessageSquareIcon,
    Home,
    Menu,
    PlusIcon,
    UserRound,
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
    const { session } = await getUserAuth()
    const user = session?.user
    return (
        <div className="min-h-screen bg-[#b2e4e0]">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
                <div className="flex h-[60px] items-center justify-between">
                    {/* <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-[300px] sm:w-[400px]"
                        >
                            <nav className="grid gap-4 py-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <PragmadicLogo />
                                    <span className="sr-only">Pragmadic</span>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/chat"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <BotMessageSquareIcon className="h-5 w-5" />
                                    Chat
                                    <Badge className="ml-auto">6</Badge>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    <UserRound className="h-5 w-5" />
                                    Profile
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet> */}
                    <MainNavBar />
                </div>
            </header>
            <main className="container mx-auto p-4">
                <div className="mb-8 text-center">
                    <p className="text-sm font-medium text-gray-600">
                        Today is a great day to explore!
                    </p>
                    <h2 className="text-3xl font-bold">
                        Hello, {user?.user_metadata.full_name || "Nomad"} 👋
                    </h2>
                    <div className="mt-4 flex items-center justify-center space-x-4">
                        <Button variant="outline" className="rounded-full">
                            My Adventures
                        </Button>
                        <p className="text-sm text-gray-600">
                            0 tasks completed
                        </p>
                        <p className="text-sm text-gray-600">1 collaborator</p>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-4">
                                    {/* Example tasks, replace with dynamic data as needed */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                        />
                                        <span>Plan next destination</span>
                                        <span className="ml-auto text-sm text-gray-500">
                                            Due: Next week
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                        />
                                        <span>Book accommodation</span>
                                        <span className="ml-auto text-sm text-gray-500">
                                            Due: 3 days
                                        </span>
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Create new project
                                </Button>
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-md bg-blue-500" />
                                    <div>
                                        <h3 className="font-semibold">
                                            Travel Blog
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            3 posts due soon
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                No tasks assigned yet
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    You don&apos;et own any goals yet
                                </p>
                                <p className="text-xs text-gray-400">
                                    Add a goal to keep track of your adventures
                                </p>
                                <Button className="w-full">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add goal
                                </Button>
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>Explore 3 new countries</span>
                                        <span>90%</span>
                                    </div>
                                    <Progress value={90} />
                                </div>
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>Write 5 blog posts</span>
                                        <span>75%</span>
                                    </div>
                                    <Progress value={75} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
