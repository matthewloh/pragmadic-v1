import { createContext } from "react"
import { createStore } from "zustand"

type Item = {
    id?: string
    name?: string
    tag?: string
    isFolder?: boolean
    isEditing?: boolean
    isLoading?: boolean
}

export interface FileStoreProps {
    data: Item[]
    parentId?: string
}

export interface FileStoreState extends FileStoreProps {
    deleteItem: (id: string) => void
    createFolder: (item: Item) => void
    updateItem: (id: string, payload: Item) => void
}

export type FileStore = ReturnType<typeof createFileStore>
export const FileStoreContext = createContext<FileStore | null>(null)

const DEFAULT_PROPS: FileStoreProps = {
    data: [],
}

export const createFileStore = (initProps?: Partial<FileStoreProps>) => {
    return createStore<FileStoreState>()((set) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        deleteItem: (id) => {
            set((state) => ({
                data: state.data.filter((item) =>
                    item.isFolder ? item.name !== id : item.id !== id,
                ),
            }))
        },

        createFolder: (item) => {
            set((state) => ({
                data: [
                    ...state.data,
                    {
                        ...item,
                        isEditing: true,
                        isFolder: true,
                        id: item.name,
                    },
                ],
            }))
        },

        updateItem: (id, payload) => {
            set((state) => {
                return {
                    data: state.data.map((d) =>
                        d.id === id ? { ...d, ...payload } : d,
                    ),
                }
            })
        },
    }))
}
