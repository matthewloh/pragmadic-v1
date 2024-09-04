import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactSection() {
    return (
        <section id="contact" className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Get in Touch
                </h2>
                <div className="mx-auto max-w-2xl">
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="First Name" />
                            <Input placeholder="Last Name" />
                        </div>
                        <Input type="email" placeholder="Email" />
                        <Input placeholder="Subject" />
                        <textarea
                            className="w-full rounded-md border p-2"
                            rows={4}
                            placeholder="Your message"
                        ></textarea>
                        <Button type="submit" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
