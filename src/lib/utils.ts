import { customAlphabet } from "nanoid"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

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
