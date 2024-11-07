"use client"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AiFillOpenAI } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { SiAnthropic } from "react-icons/si"
import { ChevronsUpDown } from "lucide-react"

export const options = [
    { provider: "OpenAI", model: "gpt-4o-mini", name: "GPT-4o-mini" },
    { provider: "OpenAI", model: "gpt-4o", name: "GPT-4o" },
    { provider: "Google", model: "gemini-1.5-pro-002", name: "Gemini" },
    { provider: "Anthropic", model: "claude-3-haiku", name: "Claude Haiku" },
] as const

export type ModelOption = (typeof options)[number]

export default function ModelSelector({
    isExpanded,
    selectedModel,
    onSelect,
}: {
    isExpanded: boolean
    selectedModel: ModelOption
    onSelect(option: ModelOption): void
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)

    const updateURL = (model: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("model", model)
        router.push(`?${params.toString()}`)
    }

    const handleSelect = (option: ModelOption) => {
        setOpen(false)
        updateURL(option.model)
        onSelect(option)
    }

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case "Google":
                return <FcGoogle className="h-5 w-5 rounded-full" />
            case "OpenAI":
                return <AiFillOpenAI className="h-5 w-5 rounded-full" />
            case "Anthropic":
                return <SiAnthropic className="h-5 w-5 rounded-full" />
            default:
                return <ChevronsUpDown className="h-5 w-5 rounded-full" />
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex w-full items-center",
                        isExpanded
                            ? "justify-start px-4"
                            : "justify-center px-0",
                    )}
                >
                    {getProviderIcon(selectedModel.provider)}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 overflow-hidden whitespace-nowrap"
                            >
                                {`${selectedModel.provider} - ${selectedModel.name}`}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <div className="max-h-[300px] overflow-auto">
                    {options.map((option) => (
                        <div
                            key={`${option.provider}-${option.model}`}
                            className={cn(
                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                selectedModel.model === option.model &&
                                    "animate-pulse border-2 border-primary",
                            )}
                            onClick={() => handleSelect(option)}
                        >
                            {getProviderIcon(option.provider)}
                            <span className="ml-2">
                                {option.provider} - {option.name}
                            </span>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
