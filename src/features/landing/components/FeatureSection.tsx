import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function FeatureSection() {
    return (
        <section id="features" className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Streamlined Visa Application Process
                </h2>
                <div className="grid items-center gap-8 md:grid-cols-2">
                    <div>
                        <p className="mb-4 text-lg">
                            Our platform leverages advanced natural language
                            processing technologies to simplify your DE Rantau
                            visa application. Simply describe your situation,
                            and our AI will guide you through the process,
                            ensuring accuracy and efficiency.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <CheckCircle className="mr-2 text-green-500" />{" "}
                                Intelligent form filling
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="mr-2 text-green-500" />{" "}
                                Real-time application status updates
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="mr-2 text-green-500" />{" "}
                                Document requirement analysis
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="mr-2 text-green-500" />{" "}
                                Personalized application tips
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Image
                            src="/placeholder.svg"
                            alt="AI-Powered Visa Application"
                            width={500}
                            height={300}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
