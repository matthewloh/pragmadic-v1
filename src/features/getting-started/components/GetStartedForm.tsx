"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SelectUser } from "@/lib/db/schema"
import { useTransition } from "react"
import { ProfileUpload } from "@/components/shared/ProfileUpload"
import { updateUserProfileAction } from "@/lib/actions/users"

const profileSchema = z.object({
    display_name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    image_url: z.string().url("Please enter a valid URL").optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function GetStartedForm({ user }: { user: SelectUser }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const isReset = searchParams.get("reset") === "true"

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            display_name: user.display_name ?? "",
            image_url: user.image_url || undefined,
        },
    })

    async function onSubmit(data: ProfileFormData) {
        startTransition(async () => {
            try {
                const error = await updateUserProfileAction({
                    id: user.id,
                    ...data,
                })

                if (error) {
                    toast.error(error)
                    return
                }

                toast.success("Profile updated successfully!")
                router.push("/getting-started")
                router.refresh()
            } catch (error) {
                toast.error("Failed to update profile")
                console.error(error)
            }
        })
    }

    return (
        <Card className="w-full">
            <CardHeader className="space-y-3">
                <CardTitle className="text-2xl font-bold">
                    Welcome to Pragmadic! 👋
                </CardTitle>
                <p className="text-muted-foreground">
                    Let&apos;s get started by setting up your profile
                </p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="mx-auto max-w-xs">
                        <ProfileUpload
                            value={form.watch("image_url")}
                            onChange={(url) => form.setValue("image_url", url)}
                            userId={user.id}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            id="display_name"
                            placeholder="How should we call you?"
                            {...form.register("display_name")}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        {isReset && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push("/getting-started")}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    Saving...
                                </span>
                            ) : (
                                "Continue"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
