import "client-only"
import { upload } from "@/utils/supabase/storage"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useState } from "react"
import { useUpload } from "@supabase-cache-helpers/storage-react-query"

export function useSupaStorage() {
    const supabase = useSupabaseBrowser()
    const [isLoading, setLoading] = useState(false)

    const uploadFile = async ({
        file,
        path,
        bucket,
    }: {
        file: File
        path: string[]
        bucket: string
    }) => {
        setLoading(true)

        const url = await upload(supabase, {
            path,
            file,
            bucket,
        })

        setLoading(false)

        return {
            url,
            path,
        }
    }

    return {
        uploadFile,
        isLoading,
    }
}
