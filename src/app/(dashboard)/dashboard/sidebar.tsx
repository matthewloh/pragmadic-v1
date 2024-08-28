import UserButtonSupabase from "@/features/auth/components/UserButtonSupabase"

export function Sidebar() {
    return (
        <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pb-4 pt-[9px]">
            <div>A</div>
            <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
                <UserButtonSupabase />
            </div>
        </aside>
    )
}
