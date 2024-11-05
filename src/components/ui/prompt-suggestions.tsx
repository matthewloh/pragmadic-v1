interface PromptSuggestionsProps {
    label: string
    append: (message: { role: "user"; content: string }) => void
    suggestions: string[]
}

export function PromptSuggestions({
    label,
    append,
    suggestions,
}: PromptSuggestionsProps) {
    return (
        <div className="flex h-full w-full flex-col space-y-4">
            <h2 className="text-center text-lg font-semibold">{label}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() =>
                            append({ role: "user", content: suggestion })
                        }
                        className="w-full rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-muted"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    )
}
