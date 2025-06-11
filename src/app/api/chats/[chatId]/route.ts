import { getChatById } from "@/lib/api/chats/queries"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: { chatId: string } }
) {
    try {
        const { chatId } = await params

        if (!chatId) {
            return NextResponse.json(
                { error: "Chat ID is required" },
                { status: 400 }
            )
        }

        const { chat } = await getChatById(chatId)

        if (!chat) {
            return NextResponse.json(
                { error: "Chat not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(chat)
    } catch (error) {
        console.error("Error fetching chat:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
} 