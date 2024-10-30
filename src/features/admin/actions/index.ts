"use server"
import { createFolder, deleteFolder, remove } from "@/utils/supabase/storage"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createFolderAction(path: string, name: string) {
    const supabase = await createClient()
    try {
        const data = await createFolder(supabase, {
            bucket: "attachments",
            path: path.split("/"),
            name,
        })
        revalidatePath("/admin/chat")
        return data
    } catch (error) {
        throw new Error("Failed to create folder")
    }
}

export async function deleteFolderAction(path: string[]) {
    const supabase = await createClient()
    const { error } = await supabase.storage
        .from("attachments")
        .remove([path.join("/")])

    if (error) throw error
    return true
}

export async function deleteFileAction(id: string, path: string[]) {
    const supabase = await createClient()
    const { error } = await supabase.storage
        .from("attachments")
        .remove([path.join("/")])

    if (error) throw error
    return true
}
