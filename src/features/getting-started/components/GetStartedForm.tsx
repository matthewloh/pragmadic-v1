"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserAction } from "@/features/auth/actions"
import { toast } from "sonner"
import { SelectUser } from "@/lib/db/schema"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useUpload } from "@supabase-cache-helpers/storage-react-query"
import { ProfileUpload } from "@/components/shared/ProfileUpload"

const profileSchema = z.object({
    display_name: z.string().min(2).max(50),
    image_url: z.string().url().optional(),
})

export function GetStartedForm({ user }: { user: SelectUser }) {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const { mutateAsync: upload } = useUpload(
        supabase.storage.from("avatars"),
        {
            buildFileName: ({ fileName, path }) => `${path}/${fileName}`,
        },
    )
    const [isPending, startTransition] = useState(false)
    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            display_name: user?.display_name || "",
            image_url: user?.image_url || "",
        },
    })

    async function onSubmit(data: z.infer<typeof profileSchema>) {
        startTransition(true)
        try {
            await updateUserAction({
                ...data,
                id: user.id,
            })
            toast.success("Profile updated!")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            startTransition(false)
        }
    }

    return (
        <Card>
            <CardHeader>
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
                    <ProfileUpload
                        value={form.watch("image_url")}
                        onChange={(url) => form.setValue("image_url", url)}
                        userId={user.id}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            {...form.register("display_name")}
                            placeholder="How should we call you?"
                        />
                        {form.formState.errors.display_name && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.display_name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url">Profile Picture URL</Label>
                        <Input
                            {...form.register("image_url")}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        {form.formState.errors.image_url && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.image_url.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Continue"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
