"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { signout } from "@/features/auth/auth-actions"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut, LogOutIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function SignOut() {
    const router = useRouter()
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
        queryClient.clear()
        router.push("/")
        router.refresh()
    }

    return (
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="mr-2 size-4" />
            {isLoading ? "Loading..." : "Sign out"}
        </DropdownMenuItem>
    )
}
