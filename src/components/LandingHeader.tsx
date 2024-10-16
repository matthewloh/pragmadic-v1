import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { sen } from "@/utils/fonts"

export function LandingHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="#003D79">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className={`text-2xl font-bold text-[#003D79] ${sen.className}`}>Pragmadic</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="#" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Community</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Events</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Your Profile</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost">Login</Button>
          <Button className="bg-[#0072E1] hover:bg-[#0056a8]">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
