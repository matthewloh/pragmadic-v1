import { customAlphabet } from "nanoid"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function formatSize(bytes: number): string {
    const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"]

    const unitIndex = Math.max(
        0,
        Math.min(
            Math.floor(Math.log(bytes) / Math.log(1024)),
            units.length - 1,
        ),
    )

    return Intl.NumberFormat("en-US", {
        style: "unit",
        unit: units[unitIndex],
    }).format(+Math.round(bytes / 1024 ** unitIndex))
}

export enum FileType {
    Pdf = "application/pdf",
    Heic = "image/heic",
}

export const isSupportedFilePreview = (type: FileType) => {
    if (!type) {
        return false
    }

    if (type === FileType.Heic) {
        return false
    }

    if (type?.startsWith("image")) {
        return true
    }

    switch (type) {
        case FileType.Pdf:
            return true
        default:
            return false
    }
}

export function stripSpecialCharacters(inputString: string) {
    // Use a regular expression to replace all non-alphanumeric characters except hyphen, space, dot,and parentheses with an empty string
    return inputString?.replace(/[^a-zA-Z0-9\s.()-]/g, "")
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789")

export const timestamps: { createdAt: true; updatedAt: true } = {
    createdAt: true,
    updatedAt: true,
}

export type Action = "create" | "update" | "delete"

export type OptimisticAction<T> = {
    action: Action
    data: T
}
