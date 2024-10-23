"use client"

import { BackButton } from "@/components/shared/BackButton"
import { ChatManagement } from "@/features/admin/components/ChatManagement"

export default function AdminChatPage() {
    return (
        <div className="container mx-auto">
            <BackButton currentResource="chat" />
            <h1 className="mb-6 text-3xl font-bold">Chat Management</h1>
            <ChatManagement />
        </div>
    )
}
