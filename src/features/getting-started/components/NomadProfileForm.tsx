"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { assignUserRoleAction } from "@/features/auth/actions/roles"
import { createNomadProfileAction } from "@/lib/actions/nomadProfile"
import { insertNomadProfileParams } from "@/lib/db/schema/nomadProfile"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export function GettingStartedNomadProfileForm({ userId }: { userId: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(insertNomadProfileParams),
        defaultValues: {
            bio: "",
            skills: "",
            interests: "",
            currentLocation: "",
            contactInformation: "",
        },
    })

    async function onSubmit(data: z.infer<typeof insertNomadProfileParams>) {
        startTransition(async () => {
            try {
                // Create nomad profile
                const profileError = await createNomadProfileAction({
                    ...data,
                })

                if (profileError) {
                    toast.error(profileError)
                    return
                }

                // Assign regular (nomad) role
                const roleError = await assignUserRoleAction({
                    userId,
                    role: "nomad",
                })

                if (roleError) {
                    toast.error(roleError)
                    return
                }

                toast.success("Profile created successfully!")
                router.push("/dashboard")
            } catch (error) {
                toast.error("Something went wrong")
                console.error(error)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Complete Your Nomad Profile
                </CardTitle>
                <p className="text-muted-foreground">
                    Tell us more about yourself to help connect with the right
                    community
                </p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            {...form.register("bio")}
                            placeholder="Tell us about yourself, your work, and what brings you to Penang..."
                            className="min-h-[100px]"
                        />
                        {form.formState.errors.bio && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.bio.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="skills">Skills</Label>
                        <Input
                            {...form.register("skills")}
                            placeholder="e.g., Web Development, Digital Marketing, Content Creation"
                        />
                        {form.formState.errors.skills && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.skills.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interests">Interests</Label>
                        <Input
                            {...form.register("interests")}
                            placeholder="What are you passionate about?"
                        />
                        {form.formState.errors.interests && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.interests.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currentLocation">
                            Current Location
                        </Label>
                        <Input
                            {...form.register("currentLocation")}
                            placeholder="Where are you currently based?"
                        />
                        {form.formState.errors.currentLocation && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.currentLocation.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactInformation">
                            Contact Information
                        </Label>
                        <Input
                            {...form.register("contactInformation")}
                            placeholder="How can others reach you? (e.g., LinkedIn, Twitter)"
                        />
                        {form.formState.errors.contactInformation && (
                            <p className="text-sm text-destructive">
                                {
                                    form.formState.errors.contactInformation
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Creating Profile..." : "Complete Setup"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
