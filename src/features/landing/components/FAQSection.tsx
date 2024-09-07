import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
    return (
        <section id="faq" className="bg-secondary py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Frequently Asked Questions
                </h2>
                <Accordion
                    type="single"
                    collapsible
                    className="mx-auto max-w-2xl"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            What is the DE Rantau program?
                        </AccordionTrigger>
                        <AccordionContent>
                            DE Rantau is a program by the Malaysian government
                            to attract digital nomads to work and live in
                            Malaysia. It offers a special visa and various
                            benefits for remote workers and digital
                            professionals.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            How long does the visa application process take?
                        </AccordionTrigger>
                        <AccordionContent>
                            The visa application process typically takes 3-5
                            business days once all required documents are
                            submitted. Our AI-powered platform helps streamline
                            this process for faster results.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            What are the requirements for the DE Rantau visa?
                        </AccordionTrigger>
                        <AccordionContent>
                            Requirements include proof of employment or business
                            ownership, a minimum monthly income of $2,000, and a
                            valid passport. Our platform will guide you through
                            the specific requirements based on your situation.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            Can I bring my family with me on the DE Rantau visa?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, the DE Rantau visa allows you to bring your
                            spouse and children as dependents. Additional
                            documentation will be required for family members.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
}
