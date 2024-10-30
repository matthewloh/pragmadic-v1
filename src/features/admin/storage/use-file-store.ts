import { useContext } from "react"
import { useStore } from "zustand"
import { FileStoreContext, type FileStoreState } from "./filestore"

export function useFileStoreContext<T>(
    selector: (state: FileStoreState) => T,
): T {
    const store = useContext(FileStoreContext)

    if (!store) {
        throw new Error("Missing FileStoreContext.Provider in the tree")
    }

    return useStore(store, selector)
}
