import Image from "next/image"

export default function CustomerLogoListSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Our DE Rantau Hub Partners
                </h2>
                <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex justify-center">
                            <Image
                                src="/placeholder.svg"
                                alt={`Partner Logo ${i}`}
                                width={150}
                                height={75}
                                className="opacity-50 transition-opacity hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
