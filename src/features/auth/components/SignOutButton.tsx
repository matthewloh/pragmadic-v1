"use client"

import { signout } from "@/features/auth/auth-actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { LogOut, LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { revalidatePath } from "next/cache"

export function SignOut() {
    const [isLoading, setLoading] = useState(false)
    const params = usePathname()
    const next = params ?? ""
    const queryClient = useQueryClient()
    const handleSignOut = async () => {
        toast.info("Signing out...", {
            description: `You will be redirected to the login page from ${params}`,
            duration: 3000,
            icon: <LogOut />,
        })
        setLoading(true)
        signout({ next })
        queryClient.invalidateQueries({ queryKey: ["current-user"] })
    }

    return (
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="mr-2 size-4" />
            {isLoading ? "Loading..." : "Sign out"}
        </DropdownMenuItem>
    )
}

