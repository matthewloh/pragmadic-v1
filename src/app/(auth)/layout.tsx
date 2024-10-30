import { redirect } from "next/navigation"
import { getSession } from "../../utils/supabase/queries/cached-queries"

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const {
        data: { session },
    } = await getSession()
    if (session) redirect("/")

    return <>{children}</>
}
