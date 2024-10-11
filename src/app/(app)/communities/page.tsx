import CommunityList from "@/components/communities/CommunityList"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCommunities } from "@/lib/api/communities/queries"
import { AuthSession } from "@/lib/auth/types"
import { getUserAuth } from "@/lib/auth/utils"
import { Suspense } from "react"

export const revalidate = 0

export default async function CommunitiesPage() {
    const { session } = await getUserAuth()
    return (
        <main className="container mx-auto p-8">
            <Suspense fallback={<CommunitiesLoading />}>
                <Communities session={session} />
            </Suspense>
        </main>
    )
}

const Communities = async ({
    session,
}: {
    session: AuthSession["session"]
}) => {
    const { communities } = await getCommunities()

    return <CommunityList communities={communities} session={session} />
}

const CommunitiesLoading = () => {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="mb-8 h-10 w-full" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="mt-2 h-4 w-5/6" />
                            <div className="mt-4 flex items-center">
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
