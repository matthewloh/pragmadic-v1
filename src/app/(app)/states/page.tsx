import { Suspense } from "react"

import Loading from "@/app/loading"
import StateList from "@/components/states/StateList"
import { getStates } from "@/lib/api/states/queries"
import { getRegions } from "@/lib/api/regions/queries"
import { getUserRole } from "@/lib/auth/get-user-role"

export const revalidate = 0

export default async function StatesPage() {
    return (
        <main className="h-full w-full">
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">States</h1>
                </div>
                <States />
            </div>
        </main>
    )
}

const States = async () => {
    const { states } = await getStates()
    const { regions } = await getRegions()
    const { role } = await getUserRole()
    return (
        <Suspense fallback={<Loading />}>
            <StateList states={states} regions={regions} role={role} />
        </Suspense>
    )
}
