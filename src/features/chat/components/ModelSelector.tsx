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

const options = [
    { provider: "Google", model: "gemini-1.5-pro-002", name: "Gemini" },
    { provider: "OpenAI", model: "gpt-4o", name: "GPT-4o" },
    { provider: "OpenAI", model: "gpt-4o-mini", name: "GPT-4o-mini" },
    { provider: "Anthropic", model: "claude-3-haiku", name: "Claude Haiku" },
]

export default function ModelSelector({
    isExpanded,
    onSelect = (provider: string, model: string) => {
        console.log(`Selected: ${provider} - ${model}`)
    },
}: {
    isExpanded: boolean
    onSelect: (provider: string, model: string) => void
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState(options[0])

    useEffect(() => {
        const modelParam = searchParams.get("model")
        if (modelParam) {
            const option = options.find((opt) => opt.model === modelParam)
            if (option) {
                setSelectedOption(option)
            }
        }
    }, [searchParams])

    const updateURL = (provider: string, model: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("model", model)
        router.push(`?${params.toString()}`)
    }

    const handleSelect = (option: (typeof options)[0]) => {
        setSelectedOption(option)
        setOpen(false)
        updateURL(option.provider, option.model)
        onSelect(option.provider, option.model)
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
                    {getProviderIcon(selectedOption.provider)}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 overflow-hidden whitespace-nowrap"
                            >
                                {`${selectedOption.provider} - ${selectedOption.name}`}
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
                                selectedOption.model === option.model &&
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
