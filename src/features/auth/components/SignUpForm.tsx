import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "../types"
import { useState } from "react"
import { signup } from "@/app/login/actions"
import { useSearchParams } from "next/navigation"

type SignUpCardProps = {
    setState: (state: SignInFlow) => void
}

export function SignUpForm({ setState }: SignUpCardProps) {
    const params = useSearchParams()
    const next = params.get("next")

    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Sign up to Continue</CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" action={signup}>
                    <Input
                        disabled={false}
                        value={first_name}
                        name="first_name"
                        onChange={(e) => {
                            setFirst_name(e.target.value)
                        }}
                        placeholder="First Name"
                        type="text"
                        required
                    />
                    <Input
                        disabled={false}
                        value={last_name}
                        name="last_name"
                        onChange={(e) => {
                            setLast_name(e.target.value)
                        }}
                        placeholder="Last Name"
                        type="text"
                        required
                    />
                    <Input
                        disabled={false}
                        value={email}
                        name="email"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={false}
                        value={password}
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Input
                        disabled={false}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                        placeholder="Confirm Password"
                        type="password"
                        required
                    />
                    {/* Hidden input value for next */}
                    {next && <Input type="hidden" name="next" value={next} />}

                    <Button
                        type="submit"
                        className="w-full"
                        size={"lg"}
                        disabled={false}
                    >
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={false}
                        onClick={() => {}}
                        variant={"outline"}
                        size={"lg"}
                        className="relative w-full"
                    >
                        <FcGoogle className="absolute left-2.5 top-3 size-5" />
                        Continue with Google
                    </Button>
                    <Button
                        disabled={false}
                        onClick={() => {}}
                        variant={"outline"}
                        size={"lg"}
                        className="relative w-full"
                    >
                        <FaGithub className="absolute left-2.5 top-3 size-5" />
                        Continue with GitHub
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already have an account? {""}{" "}
                    <span
                        className="cursor-pointer text-sky-700 hover:underline"
                        onClick={() => setState("signIn")}
                    >
                        Sign in.
                    </span>
                </p>
            </CardContent>
        </Card>
    )
}
