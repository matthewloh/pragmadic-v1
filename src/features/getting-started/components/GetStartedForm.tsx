"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SelectUser } from "@/lib/db/schema"
import { useTransition } from "react"
import { ProfileUpload } from "@/components/shared/ProfileUpload"
import { updateUserProfileAction } from "@/lib/actions/users"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { insertProfileParams, Profile } from "@/lib/db/schema/profile"
import { createProfileAction, updateProfileAction } from "@/lib/actions/profile"
import { cn } from "@/lib/utils"

const userProfileSchema = z.object({
    display_name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    image_url: z.string().url("Please enter a valid URL").optional(),
})

type UserProfileFormData = z.infer<typeof userProfileSchema>

export function GetStartedForm({
    user,
    profile,
}: {
    user: SelectUser
    profile?: Profile
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const isReset = searchParams.get("reset") === "true"

    const userForm = useForm<UserProfileFormData>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            display_name: user.display_name ?? "",
            image_url: user.image_url || undefined,
        },
    })

    const defaultProfileValues = {
        bio: profile?.bio ?? "",
        occupation: profile?.occupation ?? "",
        location: profile?.location ?? "",
        website: profile?.website ?? "",
        contactNumber: profile?.contactNumber ?? "",
        socialLinks: profile?.socialLinks ?? "",
    }

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                // Handle mandatory user profile update
                const userError = await updateUserProfileAction({
                    id: user.id,
                    display_name: formData.get("display_name") as string,
                    image_url: userForm.getValues("image_url") || "",
                })

                if (userError) {
                    toast.error(
                        "Failed to update user profile, please check you have uploaded an image for your profile",
                    )
                    return
                }

                // Handle profile creation/update
                const profileData = {
                    bio: (formData.get("bio") as string) || "",
                    occupation: formData.get("occupation") as string | null,
                    location: formData.get("location") as string | null,
                    website: (formData.get("website") as string) || "",
                    contactNumber: formData.get("contactNumber") as
                        | string
                        | null,
                    socialLinks: formData.get("socialLinks") as string | null,
                }

                if (profile) {
                    // Update existing profile
                    const profileError = await updateProfileAction({
                        id: profile.id,
                        ...profileData,
                    })
                    if (profileError) {
                        toast.error(profileError)
                        return
                    }
                } else if (Object.values(profileData).some((value) => value)) {
                    // Create new profile only if any field is filled
                    const profileParsed =
                        await insertProfileParams.safeParseAsync(profileData)

                    if (!profileParsed.success) {
                        toast.error("Invalid profile data")
                        return
                    }

                    const profileError = await createProfileAction(
                        profileParsed.data,
                    )
                    if (profileError) {
                        toast.error(profileError)
                        return
                    }
                }

                toast.success("Profile saved successfully!")
                router.push("/getting-started")
                router.refresh()
            } catch (error) {
                toast.error("Failed to save profile")
                console.error(error)
            }
        })
    }

    const { errors } = userForm.formState

    const handleImageUpload = (url: string) => {
        userForm.setValue("image_url", url, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <form
                onSubmit={userForm.handleSubmit((_, event) =>
                    onSubmit(new FormData(event?.target as HTMLFormElement)),
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="w-full">
                        <CardHeader className="space-y-3">
                            <CardTitle className="text-2xl font-bold">
                                Welcome to Pragmadic! 👋
                            </CardTitle>
                            <CardDescription>
                                Let&apos;s get started by setting up your
                                profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="mx-auto max-w-xs">
                                <ProfileUpload
                                    value={userForm.watch("image_url")}
                                    onChange={handleImageUpload}
                                    userId={user.id}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="display_name"
                                    className={cn(
                                        errors.display_name
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    Display Name *
                                </Label>
                                <Input
                                    id="display_name"
                                    {...userForm.register("display_name")}
                                    className={cn(
                                        errors.display_name
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                    placeholder="How should we call you?"
                                />
                                {errors.display_name ? (
                                    <p className="text-xs text-destructive">
                                        {errors.display_name.message}
                                    </p>
                                ) : (
                                    <div className="h-6" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6"
                >
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>
                                Complete Your Profile (Optional)
                            </CardTitle>
                            <CardDescription>
                                Tell us more about yourself
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <Label className="mb-2 inline-block">
                                        Bio
                                    </Label>
                                    <Textarea
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        defaultValue={defaultProfileValues.bio}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {[
                                        {
                                            name: "occupation",
                                            label: "Occupation",
                                            defaultValue:
                                                defaultProfileValues.occupation,
                                        },
                                        {
                                            name: "location",
                                            label: "Location",
                                            defaultValue:
                                                defaultProfileValues.location,
                                        },
                                        {
                                            name: "website",
                                            label: "Website",
                                            defaultValue:
                                                defaultProfileValues.website,
                                        },
                                        {
                                            name: "contactNumber",
                                            label: "Contact Number",
                                            defaultValue:
                                                defaultProfileValues.contactNumber,
                                        },
                                        {
                                            name: "socialLinks",
                                            label: "Social Links",
                                            defaultValue:
                                                defaultProfileValues.socialLinks,
                                        },
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <Label className="mb-2 inline-block">
                                                {field.label}
                                            </Label>
                                            <Input
                                                name={field.name}
                                                defaultValue={
                                                    field.defaultValue
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-4">
                                    {isReset && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const params =
                                                    new URLSearchParams(
                                                        searchParams,
                                                    )
                                                params.delete("reset")
                                                router.push(
                                                    `${window.location.pathname}?${params}`,
                                                )
                                            }}
                                        >
                                            Forward
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        className="min-w-[120px]"
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
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </form>
        </div>
    )
}
