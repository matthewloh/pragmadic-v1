"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInForm setState={setState} />
        ) : (
          <SignUpForm setState={setState} />
        )}
      </div>
    </div>
  );
}
