import { BotMessageSquareIcon, Home, Menu, UserRound } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

import PragmadicLogo from "@/components/branding/pragmadic-logo"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { db } from "@/lib/db"

export default async function Page() {
    const userDB = await db?.query.users.findMany()

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-700 to-purple-300">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
                <div className="flex h-[60px] items-center justify-between">
                    <Sheet>
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
                    </Sheet>
                    <MainNavBar />
                </div>
            </header>
            <main className="flex-1 py-8">
                <div className="max-w-screen container mx-auto px-4">
                    <h1 className="mb-8 text-3xl font-bold text-foreground">
                        Auth Users
                    </h1>
                    <div className="rounded-lg bg-background p-6 shadow-lg">
                        <ScrollArea className="h-[calc(100vh-240px)]">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {userDB.map((user) => (
                                    <Card
                                        key={user.id}
                                        className="transition-all duration-300 hover:shadow-md"
                                    >
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                            <Image
                                                src={
                                                    user.image_url ??
                                                    `https://avatar.vercel.sh/${user.display_name}`
                                                }
                                                alt={`Avatar of ${user.display_name}`}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <CardTitle className="text-base">
                                                    {user.display_name}
                                                </CardTitle>
                                                <p className="text-ellipsis text-sm text-card-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xs text-gray-400">
                                                Joined:{" "}
                                                {user.createdAt?.toLocaleDateString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </main>
        </div>
    )
}
