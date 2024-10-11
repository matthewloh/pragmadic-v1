"use client"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function CardDemo() {
    return (
        <div className="group/card w-full max-w-[200px]">
            <div
                className={cn(
                    "card backgroundImage relative mx-auto flex h-96 max-w-sm cursor-pointer flex-col justify-between overflow-hidden rounded-md p-4 shadow-xl",
                    "bg-[url(https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)] bg-cover",
                )}
            >
                <div className="absolute left-0 top-0 h-full w-full opacity-60 transition duration-300 group-hover/card:bg-black"></div>
                <div className="z-10 flex flex-row items-center space-x-4">
                    <Image
                        height="100"
                        width="100"
                        alt="Avatar"
                        src="/placeholder.svg"
                        className="h-10 w-10 rounded-full border-2 object-cover"
                    />
                    <div className="flex flex-col">
                        <p className="relative z-10 text-base font-normal text-gray-50">
                            Manu Arora
                        </p>
                        <p className="text-sm text-gray-400">2 min read</p>
                    </div>
                </div>
                <div className="text content">
                    <h1 className="relative z-10 text-xl font-bold text-gray-50 md:text-2xl">
                        Author Card
                    </h1>
                    <p className="relative z-10 my-4 text-sm font-normal text-gray-50">
                        Card with Author avatar, complete name and time to read
                        - most suitable for blogs.
                    </p>
                </div>
            </div>
        </div>
    )
}
