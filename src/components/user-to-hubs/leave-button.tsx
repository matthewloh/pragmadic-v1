"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useUserRole } from "@/features/auth/hooks/use-user-role"

export default function LeaveButton({ hubId }: { hubId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const supabase = useSupabaseBrowser()
    const { data: userRoleData } = useUserRole()
    const { session, user, user_roles } = userRoleData ?? {}
    const router = useRouter()

    const handleLeave = async () => {
        try {
            setIsLoading(true)
            const { error } = await supabase
                .from("users_to_hubs")
                .delete()
                .eq("hub_id", hubId)
                .eq("user_id", user?.id ?? "")

            if (error) throw error

            toast.success("Successfully left the hub")
            router.refresh()
        } catch (error) {
            console.error("Error leaving hub:", error)
            toast.error("Failed to leave hub")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="gap-2 text-destructive-foreground hover:bg-destructive/10 hover:text-destructive"
                    disabled={isLoading}
                >
                    <LogOut className="h-4 w-4" />
                    Leave Hub
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Leave Hub?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to leave this hub? You&apos;ll
                        need to request to join again if you want to return.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLeave}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? "Leaving..." : "Leave Hub"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
