import React from "react"
import { motion } from "framer-motion"
import { User, Building2, ShieldCheck, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type ProfileType = "regular" | "owner" | "admin"

type ProfileCardProps = {
    profile: {
        id: string
        type: ProfileType
        exists: boolean
        title: string
        description: string
    }
    isExpanded: boolean
    onToggle: () => void
    onManage: () => void
}

const ProfileIcon = ({ type }: { type: ProfileType }) => {
    switch (type) {
        case "regular":
            return <User className="h-6 w-6" />
        case "owner":
            return <Building2 className="h-6 w-6" />
        case "admin":
            return <ShieldCheck className="h-6 w-6" />
    }
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    profile,
    isExpanded,
    onToggle,
    onManage,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <Card
                className={`w-full transition-all duration-300 ${isExpanded ? "bg-primary/5" : ""}`}
            >
                <CardHeader className="cursor-pointer" onClick={onToggle}>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ProfileIcon type={profile.type} />
                            {profile.title}
                        </div>
                        <Badge
                            variant={profile.exists ? "secondary" : "outline"}
                        >
                            {profile.exists ? "Active" : "Inactive"}
                        </Badge>
                    </CardTitle>
                    <CardDescription>{profile.description}</CardDescription>
                </CardHeader>
                {isExpanded && (
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            {profile.exists
                                ? "Your profile is set up and ready to use. You can view and edit your information."
                                : "You haven't created this profile yet. Click the button below to get started."}
                        </p>
                        <Button
                            variant={profile.exists ? "outline" : "default"}
                            className="w-full"
                            onClick={onManage}
                        >
                            {profile.exists
                                ? "Manage Profile"
                                : "Create Profile"}
                        </Button>
                        <Link href={`/profile/${profile.id}`} />
                    </CardContent>
                )}
                <CardFooter className="flex justify-end p-2">
                    <Button variant="ghost" size="icon" onClick={onToggle}>
                        <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default ProfileCard
