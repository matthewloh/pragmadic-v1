"use client"

import { useEffect } from "react"
import {
    FileStoreContext,
    type FileStoreProps,
    createFileStore,
} from "@/features/admin/storage/filestore"

type VaultProviderProps = React.PropsWithChildren<FileStoreProps>

export function VaultProvider({ children, data }: VaultProviderProps) {
    const store = createFileStore({ data })

    useEffect(() => {
        store.setState({ data })
    }, [data, store])

    return (
        <FileStoreContext.Provider value={store}>
            {children}
        </FileStoreContext.Provider>
    )
}
