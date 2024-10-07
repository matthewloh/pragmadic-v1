import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { ArrowUpRight, BarChart3, MapPin, Users } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="flex h-[60px] items-center justify-between">
                    <MainNavBar />
                </div>
            </header>

            <main className="container py-6">
                <div className="flex flex-col space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[Users, MapPin, BarChart3, ArrowUpRight].map(
                            (Icon, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            <Skeleton className="h-4 w-24" />
                                        </CardTitle>
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="mb-1 h-7 w-16" />
                                        <Skeleton className="h-3 w-28" />
                                    </CardContent>
                                </Card>
                            ),
                        )}
                    </div>

                    <Tabs defaultValue="users" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="users">Users</TabsTrigger>
                            <TabsTrigger value="roles">
                                System Role Management
                            </TabsTrigger>
                            <TabsTrigger value="info">
                                Additional Info
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="users" className="space-y-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...Array(5)].map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-32" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-5 w-16" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-8 w-16" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
