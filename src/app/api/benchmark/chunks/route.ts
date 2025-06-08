import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { documentChunks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const DE_RANTAU_DOCUMENT_ID = '10ba6de3-c3b4-4999-86e1-4e0587b397b7'

export async function GET(request: NextRequest) {
    try {
        const chunks = await db
            .select({
                id: documentChunks.id,
                content: documentChunks.content,
                metadata: documentChunks.metadata
            })
            .from(documentChunks)
            .where(eq(documentChunks.documentId, DE_RANTAU_DOCUMENT_ID))

        return NextResponse.json(chunks)
    } catch (error) {
        console.error('Error fetching chunks:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chunks' },
            { status: 500 }
        )
    }
} 