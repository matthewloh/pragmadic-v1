import { BotMessageSquareIcon, Home, Menu, UserRound } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import PragmadicLogo from "@/components/branding/pragmadic-logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import UserButtonSupabase from "@/features/auth/components/UserButtonSupabase"
import { db } from "@/lib/db"
import Image from "next/image"
import MainNavBar from "@/features/dashboard/components/MainNavBar"

export default async function Page() {
    const userDB = await db?.query.userTable.findMany()
    return (
        <div className="flex min-h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-6">
                    <div className="flex h-12 items-center justify-between border-b px-4 lg:h-[60px] lg:px-8">
                        <Link
                            href="/dashboard"
                            className="ms-auto flex items-start gap-2 font-semibold"
                        >
                            <PragmadicLogo />
                        </Link>
                        <div className="items-center justify-center align-middle">
                            <SidebarTrigger />
                        </div>
                    </div>
                    <div className="hidden flex-1">
                        <DashboardSidebar />
                    </div>
                </div>
            </div> */}
            <div className="flex min-h-screen flex-1 flex-col">
                <header className="bg-muted/40 lg:h-[60px] flex h-14 items-center gap-4 border-b">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <PragmadicLogo />
                                    <span className="sr-only">Pragmadic</span>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/chat"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                                >
                                    <BotMessageSquareIcon className="h-5 w-5" />
                                    Chat
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <UserRound className="h-5 w-5" />
                                    Profile
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <MainNavBar />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">
                            Auth Users
                        </h1>
                    </div>
                    <div
                        className="flex flex-1 flex-col items-center justify-center overflow-y-auto rounded-lg border border-dashed shadow-sm"
                        x-chunk="dashboard-02-chunk-1"
                    >
                        <div className="m-6 flex h-full flex-1 flex-col items-center gap-1 overflow-hidden bg-background/65 text-center lg:flex lg:flex-row lg:items-start lg:justify-center">
                            <ScrollArea className="w-full rounded-md lg:w-auto">
                                <div className="m-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {userDB.map((user) => (
                                        <Card
                                            key={user.id}
                                            className="flex-shrink-0"
                                        >
                                            <CardHeader>
                                                <CardTitle>
                                                    {user.display_name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {user.email}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center">
                                                {user.createdAt?.toTimeString()}
                                                <Image
                                                    src={
                                                        user.image_url ??
                                                        `https://avatar.vercel.sh/${user.display_name}`
                                                    }
                                                    alt={`Image of ${user.display_name}`}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
