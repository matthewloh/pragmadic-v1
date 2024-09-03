import { redirect } from "next/navigation"
import { getSession, getUser } from "../../../supabase/queries/cached-queries"

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const {
        data: { user },
    } = await getSession()
    if (user) redirect("/")

    return <>{children}</>
}
