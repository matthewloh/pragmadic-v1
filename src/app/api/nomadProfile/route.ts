import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
    createNomadProfile,
    deleteNomadProfile,
    updateNomadProfile,
} from "@/lib/api/nomadProfile/mutations"
import {
    nomadProfileIdSchema,
    insertNomadProfileParams,
    updateNomadProfileParams,
} from "@/lib/db/schema/nomadProfile"

export async function POST(req: Request) {
    try {
        const validatedData = insertNomadProfileParams.parse(await req.json())
        const { nomadProfile } = await createNomadProfile(validatedData)

        revalidatePath("/nomadProfile") // optional - assumes you will have named route same as entity

        return NextResponse.json(nomadProfile, { status: 201 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 })
        } else {
            return NextResponse.json({ error: err }, { status: 500 })
        }
    }
}

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        const validatedData = updateNomadProfileParams.parse(await req.json())
        const validatedParams = nomadProfileIdSchema.parse({ id })

        const { nomadProfile } = await updateNomadProfile(
            validatedParams.id,
            validatedData,
        )

        return NextResponse.json(nomadProfile, { status: 200 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 })
        } else {
            return NextResponse.json(err, { status: 500 })
        }
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        const validatedParams = nomadProfileIdSchema.parse({ id })
        const { nomadProfileSchema } = await deleteNomadProfile(validatedParams.id)

        return NextResponse.json(nomadProfileSchema, { status: 200 })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 })
        } else {
            return NextResponse.json(err, { status: 500 })
        }
    }
}
