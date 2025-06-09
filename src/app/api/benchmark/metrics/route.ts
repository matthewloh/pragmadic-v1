import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
        return NextResponse.json({ error: 'ChatID is required' }, { status: 400 })
    }

    try {
        // Fetch both metrics and chunks
        const [metrics, chunks] = await Promise.all([
            kv.get(`metrics:${chatId}`),
            kv.get(`chunks:${chatId}`)
        ])

        return NextResponse.json({
            metrics: metrics || null,
            chunks: chunks || [],
            chatId: chatId
        })
    } catch (error) {
        console.error('Error retrieving benchmark metrics:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve metrics' },
            { status: 500 }
        )
    }
} 