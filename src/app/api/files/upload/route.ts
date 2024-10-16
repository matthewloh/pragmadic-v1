import { getUserRole } from "@/lib/auth/get-user-role"
import { getUserAuth } from "@/lib/auth/utils"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { session } = await getUserAuth()

    if (!session) {
        return Response.redirect("/login")
    }

    if (request.body === null) {
        return new Response("Request body is empty", { status: 400 })
    }

    const supabase = createClient()

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 },
            )
        }

        const filename = file.name
        const fileBuffer = await file.arrayBuffer()

        const { data, error } = await supabase.storage
            .from("attachments")
            .upload(filename, fileBuffer, {
                contentType: file.type,
                upsert: true,
            })

        if (error) {
            return NextResponse.json(
                { error: "Upload failed" },
                { status: 500 },
            )
        }

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 },
        )
    }
}
