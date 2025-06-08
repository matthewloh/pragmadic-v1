import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { documentChunks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
    try {
        const { chunkId } = await req.json()

        if (!chunkId) {
            return NextResponse.json(
                { error: 'chunkId is required' },
                { status: 400 }
            )
        }

        // Check if the chunk exists in the database
        const chunk = await db
            .select({ id: documentChunks.id })
            .from(documentChunks)
            .where(eq(documentChunks.id, chunkId))
            .limit(1)

        const exists = chunk.length > 0

        return NextResponse.json({ 
            chunkId, 
            exists,
            ...(exists && { found: true })
        })

    } catch (error) {
        console.error('Error validating chunk ID:', error)
        return NextResponse.json(
            { error: 'Failed to validate chunk ID' },
            { status: 500 }
        )
    }
} 