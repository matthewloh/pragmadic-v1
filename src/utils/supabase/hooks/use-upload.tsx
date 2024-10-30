import { upload } from "@/utils/supabase/storage"
import { SupabaseClient } from "@supabase/supabase-js"
import { useState } from "react"
import useSupabaseBrowser from "../client"
interface UploadParams {
    file: File
    path: string
    bucket: string
}

interface UploadResult {
    url: string
    path: string
}

export function useUpload() {
    const supabase: SupabaseClient = useSupabaseBrowser()
    const [isLoading, setLoading] = useState<boolean>(false)

    const uploadFile = async ({
        file,
        path,
        bucket,
    }: UploadParams): Promise<UploadResult> => {
        setLoading(true)

        try {
            const url = await upload(supabase, {
                path: [path],
                file,
                bucket,
            })

            return {
                url,
                path,
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        uploadFile,
        isLoading,
    }
}
