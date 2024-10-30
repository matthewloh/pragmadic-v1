import Link from "next/link"

export function Navigation() {
    return (
        <nav>
            {/* ... other navigation items */}
            <Link href="/hubs">Hubs</Link>
            <Link href="/invites">Invites</Link>
            {/* ... other navigation items */}
        </nav>
    )
}
