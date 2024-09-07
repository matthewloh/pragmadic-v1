import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-4 text-center text-3xl font-bold">
                    Stay Updated
                </h2>
                <p className="mb-8 text-center">
                    Subscribe to our newsletter for the latest updates on
                    community events and platform news.
                </p>
                <form className="mx-auto flex max-w-md gap-4">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-grow"
                    />
                    <Button type="submit">Subscribe</Button>
                </form>
            </div>
        </section>
    )
}
