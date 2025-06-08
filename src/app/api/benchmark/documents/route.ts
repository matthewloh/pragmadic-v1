import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    try {
        const docs = await db
            .select({
                id: documents.id,
                name: documents.name,
                chunk_count: documents.chunkCount,
                status: documents.status,
                processed_at: documents.processedAt
            })
            .from(documents)
            .where(eq(documents.status, 'completed'))
            .orderBy(documents.name)

        const formattedDocs = docs.map(doc => ({
            id: doc.id,
            name: doc.name,
            chunk_count: doc.chunk_count,
            status: doc.status,
            processed_at: doc.processed_at?.toISOString() || null
        }))

        return NextResponse.json(formattedDocs)
    } catch (error) {
        console.error('Error fetching documents:', error)
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        )
    }
} 