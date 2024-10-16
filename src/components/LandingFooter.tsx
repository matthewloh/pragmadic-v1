import Link from 'next/link'

export function LandingFooter() {
  const footerSections = [
    { title: 'About Us', links: ['Our Story', 'Team', 'Careers'] },
    { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs'] },
    { title: 'Community', links: ['Events', 'Blog', 'Forum'] },
    { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'] },
  ]

  const socialIcons = ['facebook', 'twitter', 'instagram', 'linkedin']

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold mb-4 text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Follow Us</h3>
            <div className="flex space-x-4">
              {socialIcons.map((social) => (
                <Link key={social} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">{social}</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">&copy; 2024 Pragmadic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
