import { getChats } from "@/lib/api/chats/queries"
import { getSession } from "../../../../utils/supabase/queries/cached-queries"

export async function GET() {
    const {
        data: { session },
    } = await getSession()

    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { chats } = await getChats()
    return Response.json(chats)
}
