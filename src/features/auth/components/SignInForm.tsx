import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/features/auth/auth-actions";
import { SignInFlow } from "../types";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

type SignInCardProps = {
  setState: (state: SignInFlow) => void;
};

export function SignInForm({ setState }: SignInCardProps) {
  const params = useSearchParams();
  const next = params.get("next") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.startsWith("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.endsWith("/") ? url : `${url}/`;
    return url;
  };
  const handleLoginWithOAuth = async (provider: "github" | "google") => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL() + "auth/callback?next=" + next,
        // redirectTo: "/auth/callback",
        // ?next=" + next, // equal to localhost:3000 in dev or your domain in prod
      },
    });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to Continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" action={login}>
          <Input
            disabled={false}
            value={email}
            name="email"
            onChange={(e) => {
              setEmail(e.target.value);
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
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          {/* Hidden input value for next */}
          {next && <Input type="hidden" name="next" value={next} />}
          <Button type="submit" className="w-full" size={"lg"} disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => {
              handleLoginWithOAuth("google");
            }}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            disabled={false}
            onClick={() => {
              handleLoginWithOAuth("github");
            }}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account? {""}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign up now.
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
