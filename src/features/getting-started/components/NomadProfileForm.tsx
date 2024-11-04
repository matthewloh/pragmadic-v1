"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { assignUserRoleAction } from "@/features/auth/actions/roles"
import { createNomadProfileAction } from "@/lib/actions/nomadProfile"
import { insertNomadProfileParams } from "@/lib/db/schema/nomadProfile"
import useSupabaseBrowser from "@/utils/supabase/client"
import { NomadProfileRow } from "@/utils/supabase/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { motion } from "framer-motion"
import { Briefcase, Mail, MapPin, User2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { ProfileFormLayout } from "./shared/ProfileFormLayout"

interface GettingStartedNomadProfileFormProps {
    userId: string
}

export function GettingStartedNomadProfileForm({
    userId,
}: GettingStartedNomadProfileFormProps) {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const [isPending, startTransition] = useTransition()

    // Fetch existing profile
    // @ts-expect-error - Some incompatibilities with supabase version
    const { data: existingProfile } = useQuery<NomadProfileRow>(
        supabase
            .from("nomad_profile")
            .select("*")
            .eq("user_id", userId)
            .single(),
        {
            // Disable automatic refetching
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 5 * 60 * 1000, // 5 minutes
        },
    )

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

    // Update form when existing profile is loaded
    useEffect(() => {
        if (existingProfile) {
            form.reset({
                bio: existingProfile.bio || "",
                skills: existingProfile.skills || "",
                interests: existingProfile.interests || "",
                currentLocation: existingProfile.current_location || "",
                contactInformation: existingProfile.contact_information || "",
            })
        }
    }, [existingProfile, form])

    async function onSubmit(data: z.infer<typeof insertNomadProfileParams>) {
        startTransition(async () => {
            try {
                const profileError = await createNomadProfileAction({
                    ...data,
                })

                if (profileError) {
                    toast.error(profileError)
                    return
                }

                // Only assign role if it's a new profile
                if (!existingProfile) {
                    const roleError = await assignUserRoleAction({
                        userId,
                        role: "nomad",
                    })

                    if (roleError) {
                        toast.error(roleError)
                        return
                    }
                }

                toast.success(
                    existingProfile
                        ? "Profile updated successfully!"
                        : "Profile created successfully!",
                )
                router.push("/dashboard")
            } catch (error) {
                toast.error("Something went wrong")
                console.error(error)
            }
        })
    }

    if (isPending) {
        return (
            <ProfileFormLayout
                title="Loading Profile"
                subtitle="Please wait while we load your profile..."
            >
                <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </ProfileFormLayout>
        )
    }

    return (
        <ProfileFormLayout
            title={
                existingProfile
                    ? "Update Your Nomad Profile"
                    : "Complete Your Nomad Profile"
            }
            subtitle={
                existingProfile
                    ? "Review and update your profile information"
                    : "Tell us about yourself to connect with the right community"
            }
        >
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                {/* Bio Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <User2 className="h-5 w-5 text-primary" />
                        <Label htmlFor="bio" className="text-lg font-medium">
                            About You
                        </Label>
                    </div>
                    <Textarea
                        {...form.register("bio")}
                        placeholder="Share your story, work experience, and what brings you to Penang..."
                        className="min-h-[120px] resize-none"
                    />
                    {form.formState.errors.bio && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.bio.message}
                        </p>
                    )}
                </div>

                {/* Skills & Interests */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="skills"
                                className="text-lg font-medium"
                            >
                                Skills
                            </Label>
                        </div>
                        <Input
                            {...form.register("skills")}
                            placeholder="Web Development, Design, Marketing..."
                        />
                        {form.formState.errors.skills && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.skills.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label
                            htmlFor="interests"
                            className="text-lg font-medium"
                        >
                            Interests
                        </Label>
                        <Input
                            {...form.register("interests")}
                            placeholder="Travel, Photography, Local Culture..."
                        />
                        {form.formState.errors.interests && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.interests.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Location & Contact */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="currentLocation"
                                className="text-lg font-medium"
                            >
                                Current Location
                            </Label>
                        </div>
                        <Input
                            {...form.register("currentLocation")}
                            placeholder="City, Country"
                        />
                        {form.formState.errors.currentLocation && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.currentLocation.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="contactInformation"
                                className="text-lg font-medium"
                            >
                                Contact Information
                            </Label>
                        </div>
                        <Input
                            {...form.register("contactInformation")}
                            placeholder="@username or https://linkedin.com/in/..."
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
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="animate-pulse">
                                {existingProfile
                                    ? "Updating Profile..."
                                    : "Creating Profile..."}
                            </span>
                        ) : existingProfile ? (
                            "Update Profile"
                        ) : (
                            "Complete Setup"
                        )}
                    </Button>
                </div>
            </motion.form>
        </ProfileFormLayout>
    )
}
