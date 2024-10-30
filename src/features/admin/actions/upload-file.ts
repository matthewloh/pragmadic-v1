"use server"

import { createClient } from "@/utils/supabase/server"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { redirect } from "next/navigation"
import { getPdfContentFromUrl } from "../utils/pdf"
import { embedMany } from "ai"
import { openai } from "@ai-sdk/openai"

export async function uploadPDFAndGenerateEmbeddings(file: File) {
    // Authorize the user
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // If invalid file
    if (!file.name.endsWith(".pdf")) {
        throw new Error("Invalid file type")
    }
    const {
        data: { publicUrl },
    } = await supabase.storage.from("knowledge_base").getPublicUrl(file.name)

    const content = await getPdfContentFromUrl(publicUrl)
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const chunkedContent = await textSplitter.createDocuments([content])

    const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: chunkedContent.map((chunk) => chunk.pageContent),
    })

    // TODO: Insert chunks into database
    // await insertChunks({
    //     chunks,
    // })
}
