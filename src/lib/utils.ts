import { customAlphabet } from "nanoid"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
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
